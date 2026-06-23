import { useRef, useState } from 'react'

function reorder(list, from, to) {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export default function SortableList({
  items,
  keyExtractor,
  onReorder,
  renderItem,
  className = 'manage-list',
  itemClassName = 'manage-item',
}) {
  const listRef = useRef(null)
  const timerRef = useRef(null)
  const dragIndexRef = useRef(null)
  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  const getIndexFromY = (clientY) => {
    const nodes = listRef.current?.querySelectorAll('[data-sortable-item]')
    if (!nodes?.length) return null
    for (let i = 0; i < nodes.length; i++) {
      const rect = nodes[i].getBoundingClientRect()
      if (clientY < rect.top + rect.height / 2) return i
    }
    return nodes.length - 1
  }

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const startDrag = (index) => {
    dragIndexRef.current = index
    setDragIndex(index)
    setOverIndex(index)
    navigator.vibrate?.(25)
  }

  const finishDrag = () => {
    clearTimer()
    const from = dragIndexRef.current
    const to = overIndex
    dragIndexRef.current = null
    setDragIndex(null)
    setOverIndex(null)
    if (from != null && to != null && from !== to) {
      onReorder(reorder(items, from, to))
    }
  }

  const onTouchStart = (index, e) => {
    if (e.target.closest('button, a, input, select, label')) return
    const touch = e.touches[0]
    const startY = touch.clientY
    clearTimer()
    timerRef.current = setTimeout(() => startDrag(index), 420)
    const onMove = (ev) => {
      if (dragIndexRef.current == null) {
        if (Math.abs(ev.touches[0].clientY - startY) > 8) clearTimer()
        return
      }
      ev.preventDefault()
      const idx = getIndexFromY(ev.touches[0].clientY)
      if (idx != null) setOverIndex(idx)
    }
    const onEnd = () => {
      document.removeEventListener('touchmove', onMove, { capture: true })
      document.removeEventListener('touchend', onEnd)
      document.removeEventListener('touchcancel', onEnd)
      finishDrag()
    }
    document.addEventListener('touchmove', onMove, { passive: false, capture: true })
    document.addEventListener('touchend', onEnd)
    document.addEventListener('touchcancel', onEnd)
  }

  const onMouseDown = (index, e) => {
    if (e.button !== 0 || e.target.closest('button, a, input, select, label')) return
    const startY = e.clientY
    clearTimer()
    timerRef.current = setTimeout(() => startDrag(index), 420)
    const onMove = (ev) => {
      if (dragIndexRef.current == null) {
        if (Math.abs(ev.clientY - startY) > 8) clearTimer()
        return
      }
      const idx = getIndexFromY(ev.clientY)
      if (idx != null) setOverIndex(idx)
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      finishDrag()
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <ul ref={listRef} className={className}>
      {items.map((item, index) => (
        <li
          key={keyExtractor(item)}
          data-sortable-item
          className={[
            itemClassName,
            dragIndex === index ? 'sortable-dragging' : '',
            overIndex === index && dragIndex !== null && dragIndex !== index ? 'sortable-over' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onTouchStart={(e) => onTouchStart(index, e)}
          onMouseDown={(e) => onMouseDown(index, e)}
        >
          <span className="drag-handle" aria-hidden="true">
            ⠿
          </span>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  )
}
