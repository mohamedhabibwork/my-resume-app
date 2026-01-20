import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  type Firestore,
  type DocumentData,
  type QueryConstraint,
  onSnapshot,
  type Unsubscribe,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { firestore } from '@/config/firebase'
import type { ID } from '@/types'
import { removeUndefined } from '@/utils/helpers'

/**
 * Generic Firestore service for CRUD operations
 *
 * FREE TIER LIMITS (Spark Plan):
 * - 50,000 reads/day
 * - 20,000 writes/day
 * - 20,000 deletes/day
 * - 1 GB storage
 *
 * OPTIMIZATION STRATEGIES:
 * - Use real-time listeners (onSnapshot) instead of repeated getDocs calls
 * - Enable offline persistence to cache data locally
 * - Use batch writes to combine multiple operations
 * - Limit query results with .limit() when possible
 * - Cache frequently accessed data in memory
 */
export class FirestoreService<T extends DocumentData> {
  private collectionName: string
  private db: Firestore

  constructor(collectionName: string) {
    this.collectionName = collectionName
    this.db = firestore
  }

  /**
   * Get a single document by ID
   */
  async getById(id: ID): Promise<T | null> {
    try {
      const docRef = doc(this.db, this.collectionName, id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as unknown as T
      }
      return null
    } catch (error) {
      console.error(`Error getting document ${id}:`, error)
      throw error
    }
  }

  /**
   * Get all documents in collection
   *
   * FREE TIER OPTIMIZATION:
   * - Prefer subscribeToQuery() for real-time updates (more efficient)
   * - Use limit() to restrict result size when possible
   * - Consider caching results to reduce reads
   */
  async getAll(constraints: QueryConstraint[] = [], maxResults?: number): Promise<T[]> {
    try {
      const constraintsWithLimit = maxResults
        ? [...constraints, limit(maxResults)]
        : constraints
      const q = query(collection(this.db, this.collectionName), ...constraintsWithLimit)
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as T[]
    } catch (error) {
      console.error(`Error getting all documents:`, error)
      throw error
    }
  }

  /**
   * Get documents by field value
   */
  async getByField(field: string, value: unknown): Promise<T[]> {
    return this.getAll([where(field, '==', value)])
  }

  /**
   * Create a new document
   */
  async create(data: Omit<T, 'id' | 'timestamps'>, id?: ID): Promise<ID> {
    try {
      const docRef = id ? doc(this.db, this.collectionName, id) : doc(collection(this.db, this.collectionName))
      // Remove undefined values before saving (Firestore doesn't allow undefined)
      const cleanedData = removeUndefined(data as Record<string, unknown>)
      const docData = {
        ...cleanedData,
        timestamps: {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
      }
      await setDoc(docRef, docData)
      return docRef.id
    } catch (error) {
      console.error('Error creating document:', error)
      throw error
    }
  }

  /**
   * Update an existing document
   */
  async update(id: ID, data: Partial<Omit<T, 'id' | 'timestamps'>>): Promise<void> {
    try {
      const docRef = doc(this.db, this.collectionName, id)
      await updateDoc(docRef, {
        ...data,
        'timestamps.updatedAt': serverTimestamp(),
      })
    } catch (error) {
      console.error(`Error updating document ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete a document
   */
  async delete(id: ID): Promise<void> {
    try {
      const docRef = doc(this.db, this.collectionName, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error(`Error deleting document ${id}:`, error)
      throw error
    }
  }

  /**
   * Subscribe to real-time updates for a single document
   */
  subscribe(id: ID, callback: (data: T | null) => void): Unsubscribe {
    const docRef = doc(this.db, this.collectionName, id)
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback({ id: docSnap.id, ...docSnap.data() } as unknown as T)
        } else {
          callback(null)
        }
      },
      (error) => {
        console.error(`Error in subscription for ${id}:`, error)
        callback(null)
      }
    )
  }

  /**
   * Subscribe to real-time updates for a collection query
   */
  subscribeToQuery(
    constraints: QueryConstraint[],
    callback: (data: T[]) => void
  ): Unsubscribe {
    const q = query(collection(this.db, this.collectionName), ...constraints)
    return onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as T[]
        callback(data)
      },
      (error) => {
        console.error('Error in query subscription:', error)
        callback([])
      }
    )
  }

  /**
   * Batch write operations
   *
   * FREE TIER OPTIMIZATION:
   * - Batch writes count as single operation (up to 500 operations per batch)
   * - Reduces write count significantly for bulk operations
   * - Free tier: 20,000 writes/day
   */
  async batchWrite(operations: Array<{ type: 'create' | 'update' | 'delete'; id?: ID; data?: Partial<T> }>): Promise<void> {
    try {
      const batch = writeBatch(this.db)

      operations.forEach((op) => {
        if (op.type === 'create' && op.id && op.data) {
          const docRef = doc(this.db, this.collectionName, op.id)
          // Remove undefined values before saving
          const cleanedData = removeUndefined(op.data as Record<string, unknown>)
          batch.set(docRef, {
            ...cleanedData,
            timestamps: {
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
          })
        } else if (op.type === 'update' && op.id && op.data) {
          const docRef = doc(this.db, this.collectionName, op.id)
          // Remove undefined values before saving
          const cleanedData = removeUndefined(op.data as Record<string, unknown>)
          batch.update(docRef, {
            ...cleanedData,
            'timestamps.updatedAt': serverTimestamp(),
          })
        } else if (op.type === 'delete' && op.id) {
          const docRef = doc(this.db, this.collectionName, op.id)
          batch.delete(docRef)
        }
      })

      await batch.commit()
    } catch (error) {
      console.error('Error in batch write:', error)
      throw error
    }
  }
}

/**
 * Helper function to create a Firestore service instance
 */
export function createFirestoreService<T extends DocumentData>(collectionName: string) {
  return new FirestoreService<T>(collectionName)
}
