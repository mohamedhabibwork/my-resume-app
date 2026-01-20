import { ref } from 'vue'

export function useDragAndDrop<T extends { id: string }>(_items: T[]) {
  const draggedItem = ref<T | null>(null)
  const draggedOverIndex = ref<number | null>(null)

  function handleDragStart(item: T) {
    draggedItem.value = item
  }

  function handleDragOver(index: number, event: DragEvent) {
    event.preventDefault()
    draggedOverIndex.value = index
  }

  function handleDrop(index: number, itemsArray: T[]) {
    if (draggedItem.value === null) return

    const draggedIndex = itemsArray.findIndex((item) => item.id === draggedItem.value!.id)
    if (draggedIndex === -1) return

    const newItems = [...itemsArray]
    const [removed] = newItems.splice(draggedIndex, 1)
    if (removed) {
      newItems.splice(index, 0, removed)
    }

    draggedItem.value = null
    draggedOverIndex.value = null

    return newItems
  }

  function handleDragEnd() {
    draggedItem.value = null
    draggedOverIndex.value = null
  }

  return {
    draggedItem,
    draggedOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  }
}
