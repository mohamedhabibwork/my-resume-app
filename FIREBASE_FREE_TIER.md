# Firebase Free Tier Optimization Guide

This application is optimized to use **only Firebase free tier features** (Spark Plan).

## Free Tier Limits

### Cloud Firestore
- **50,000 reads/day** - Document reads, query executions
- **20,000 writes/day** - Document creates, updates
- **20,000 deletes/day** - Document deletions
- **1 GB storage** - Total document storage
- **Real-time listeners** - Included (no additional cost)

### Firebase Authentication
- **Unlimited users** - No limits on user accounts
- **Unlimited operations** - Sign in, sign up, password reset, etc.
- **All providers** - Email/Password, Google, GitHub, etc.

### Firebase Analytics
- **Unlimited events** - No limits on event logging
- **Unlimited properties** - User properties, custom parameters
- **14 months retention** - Data retention period

### Firebase Storage
- **5 GB storage** - Total file storage
- **1 GB/day downloads** - Daily download bandwidth
- **20,000 uploads/day** - Daily upload operations

### Firebase Cloud Messaging (FCM)
- **Unlimited messages** - No limits on push notifications
- **Unlimited devices** - No limits on registered devices
- **Unlimited topics** - No limits on topic subscriptions
- **Completely FREE** - No charges for any FCM usage

## Optimization Strategies Implemented

### 1. Real-Time Listeners (onSnapshot)
- **Benefit**: Reduces read operations by using efficient real-time sync
- **Usage**: Resume and cover letter stores use `subscribeToQuery()` instead of polling
- **Impact**: Single read per document change instead of repeated queries

### 2. Offline Persistence
- **Benefit**: Caches data locally, reducing Firestore reads
- **Implementation**: `enableIndexedDbPersistence()` in `firebase.ts`
- **Impact**: Subsequent reads served from cache (no Firestore read)

### 3. Debounced Updates
- **Benefit**: Combines multiple rapid updates into single write
- **Implementation**: `useDebounceFn()` in `ResumeBuilderView.vue`
- **Impact**: Reduces write operations by ~90% during active editing

### 4. Batch Operations
- **Benefit**: Multiple operations count as single write
- **Implementation**: `batchWrite()` in `FirestoreService`
- **Impact**: Up to 500 operations per batch = 1 write

### 5. Query Optimization
- **Benefit**: Efficient queries with proper indexes
- **Implementation**: Composite indexes in `firestore.indexes.json`
- **Impact**: Faster queries, fewer read operations

### 6. Memory Caching
- **Benefit**: Reduces redundant Firestore reads
- **Implementation**: Pinia stores cache data in memory
- **Impact**: No Firestore read needed for cached data

## Monitoring Usage

To monitor your Firebase usage:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to "Usage and billing"
4. Check daily quotas for each service

## Best Practices

### Do's ✅
- Use real-time listeners for frequently accessed data
- Enable offline persistence
- Debounce rapid updates
- Use batch writes for bulk operations
- Cache data in memory when possible
- Limit query results with `.limit()` when appropriate

### Don'ts ❌
- Don't poll Firestore with repeated `getDocs()` calls
- Don't write on every keystroke (use debouncing)
- Don't fetch all documents when you only need a few
- Don't create unnecessary indexes (they use storage)
- Don't store large files in Firestore (use Storage instead)

## Cost Estimation

For a typical user:
- **Daily reads**: ~100-500 (well under 50K limit)
- **Daily writes**: ~50-200 (well under 20K limit)
- **Storage**: ~1-10 MB per user (well under 1 GB limit)

**Estimated capacity**: 100-500 active users/day on free tier

## Upgrade Considerations

If you exceed free tier limits, consider:
1. **Blaze Plan (Pay-as-you-go)**: Only pay for what you use
2. **Optimize further**: Implement more aggressive caching
3. **CDN caching**: Use Cloudflare for static content
4. **Database optimization**: Review and optimize queries

## Current Implementation Status

✅ All Firebase services configured for free tier
✅ Offline persistence enabled
✅ Real-time listeners implemented
✅ Debounced updates active
✅ Batch operations available
✅ Query indexes configured
✅ Memory caching via Pinia stores
