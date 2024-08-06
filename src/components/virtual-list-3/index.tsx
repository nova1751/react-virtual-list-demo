import React, { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'

export interface ItemType {
  id: string
  value: string
}
export interface PositionType {
  index: number
  height: number
  top: number
  bottom: number
}
interface VirtualList3Props {
  listData: ItemType[]
  itemSize: number
  estimatedItemSize: number
  bufferScale: number
}

const VirtualList3: React.FC<VirtualList3Props> = (props) => {
  const { listData = [], itemSize = 200, estimatedItemSize, bufferScale = 1 } = props
  const [screenHeight, setSceenHeight] = useState(0)
  const [startOffset, setStartOffset] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)
  const [positions, setPositions] = useState<PositionType[]>([])

  const list = useRef<HTMLDivElement>(null)
  const items = useRef<HTMLDivElement>(null)

  const listHeight = useMemo(() => positions[positions.length - 1]?.bottom ?? 0, [positions])
  const visibleCount = useMemo(() => Math.ceil(screenHeight / itemSize), [screenHeight, itemSize])
  const aboveCount = useMemo(
    () => Math.min(startIndex, bufferScale * visibleCount),
    [startIndex, bufferScale, visibleCount]
  )
  const belowCount = useMemo(
    () => Math.min(listData.length - endIndex, bufferScale * visibleCount),
    [endIndex, bufferScale, visibleCount, listData.length]
  )
  const visibleData = useMemo(() => {
    return listData.slice(startIndex - aboveCount, endIndex + belowCount)
  }, [listData, startIndex, aboveCount, endIndex, belowCount])

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
  useEffect(() => updateItemSize(startIndex))

  const handleScroll = () => {
    const scrollTop = list.current?.scrollTop ?? 0
    const startIndexValue = getStartIndex(scrollTop)
    setStartIndex(startIndexValue)
    setEndIndex(startIndexValue + visibleCount)
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
      if (startIndexValue) {
        const size =
          positions[startIndexValue]?.top - positions[startIndexValue - aboveCount]?.top ?? 0
        setStartOffset(positions[startIndexValue - 1]?.bottom - size)
      } else {
        setStartOffset(0)
      }
    }
  }

  const getStartIndex = (value: number) => {
    let start = 0
    let end = positions.length - 1
    let tempIndex: number | null = null
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
      <div
        ref={items}
        className="infinite-list"
        style={{ transform: `translateY(${startOffset}px)` }}
      >
        {visibleData.map((item) => (
          <div className="infinite-list-item" id={item.id} key={item.id}>
            {item.value}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VirtualList3
