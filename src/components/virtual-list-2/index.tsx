import React, { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'

export interface ItemType {
  id: number
  value: string
}
export interface PositionType {
  index: number
  height: number
  top: number
  bottom: number
}
interface VirtualList2Props {
  listData: ItemType[]
  itemSize: number
  estimatedItemSize: number
}

const VirtualList2: React.FC<VirtualList2Props> = (props) => {
  const { listData = [], itemSize = 200, estimatedItemSize } = props
  const [screenHeight, setSceenHeight] = useState(0)
  const [startOffset, setStartOffset] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)
  const [positions, setPositions] = useState<PositionType[]>([])

  const list = useRef<HTMLDivElement>(null)
  const items = useRef<HTMLDivElement>(null)

  const listHeight = useMemo(() => positions[positions.length - 1]?.bottom ?? 0, [positions])
  const visibleCount = useMemo(() => Math.ceil(screenHeight / itemSize), [screenHeight, itemSize])
  const transformValue = useMemo(() => `translateY(${startOffset}px)`, [startOffset])
  const _listData = useMemo(
    () => listData.map((item) => ({ id: `_${item.id}`, value: item.value })),
    [listData]
  )
  const visibleData = useMemo(
    () => _listData.slice(startIndex, Math.min(_listData.length, endIndex)),
    [startIndex, endIndex, _listData]
  )

  useEffect(() => {
    setEndIndex(startIndex + visibleCount)
  }, [visibleCount, startIndex])
  useEffect(() => {
    const element = list.current
    setSceenHeight(element?.clientHeight ?? 0)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSceenHeight(entry.contentRect.height)
      }
    })
    if (element) {
      resizeObserver.observe(element)
    }
    return () => {
      if (element) {
        resizeObserver.unobserve(element)
      }
    }
  }, [])
  useEffect(
    () =>
      setPositions(
        listData.map((_, index) => ({
          index,
          height: estimatedItemSize,
          top: index * estimatedItemSize,
          bottom: (index + 1) * estimatedItemSize
        }))
      ),
    [estimatedItemSize, listData]
  )

  const handleScroll = () => {
    const scrollTop = list.current?.scrollTop ?? 0
    const startIndexValue = getStartIndex(scrollTop)
    setStartIndex(startIndexValue)
    setEndIndex(startIndexValue + visibleCount)
    updateItemSize(startIndexValue)
  }

  const updateItemSize = (startIndexValue: number) => {
    const itemlist = items.current?.children
    if (itemlist) {
      const elementList = Array.from(itemlist)
      const newPositions = [...positions]
      for (const item of elementList) {
        const rect = item.getBoundingClientRect()
        const height = rect.height
        const index = Number(item.id.slice(1))
        const oldHeight = positions[index].height
        const diffValue = oldHeight - height
        if (diffValue) {
          newPositions[index].bottom -= diffValue
          newPositions[index].height = height
          for (let i = index + 1; i < newPositions.length; i++) {
            newPositions[i].top = newPositions[i - 1].bottom
            newPositions[i].bottom -= diffValue
          }
          setPositions(newPositions)
        }
      }
      setStartOffset(startIndexValue === 0 ? 0 : positions[startIndexValue - 1]?.bottom)
    }
  }

  const getStartIndex = (value: number) => {
    let start = 0
    let end = positions.length - 1
    let tempIndex = null
    while (start <= end) {
      const midIndex = Math.floor((start + end) / 2)
      const midValue = positions[midIndex].bottom
      if (midValue === value) {
        return midIndex + 1
      } else if (midValue < value) {
        start = midIndex + 1
      } else if (midValue > value) {
        if (tempIndex === null || tempIndex > midIndex) {
          tempIndex = midIndex
        }
        end = end - 1
      }
    }
    return tempIndex ?? 0
  }

  return (
    <div ref={list} className="infinite-list-container" onScroll={handleScroll}>
      <div className="infinite-list-phantom" style={{ height: `${listHeight}px` }}></div>
      <div ref={items} className="infinite-list" style={{ transform: transformValue }}>
        {visibleData.map((item) => (
          <div className="infinite-list-item" id={item.id} key={item.id}>
            {item.value}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VirtualList2
