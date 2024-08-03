import React, { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'

export interface ItemType {
  id: number
  value: number
}
interface VirtualList1Props {
  listData: ItemType[]
  itemSize: number
}

const VirtualList1: React.FC<VirtualList1Props> = (props) => {
  const { listData = [], itemSize = 200 } = props
  const [screenHeight, setSceenHeight] = useState(0)
  const [startOffset, setStartOffset] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)

  const list = useRef<HTMLDivElement>(null)

  const listHeight = useMemo(() => listData.length * itemSize, [listData.length, itemSize])
  const visibleCount = useMemo(() => Math.ceil(screenHeight / itemSize), [screenHeight, itemSize])
  const transformValue = useMemo(() => `translateY(${startOffset}px)`, [startOffset])
  const visibleData = useMemo(
    () => listData.slice(startIndex, Math.min(listData.length, endIndex)),
    [startIndex, endIndex, listData]
  )

  useEffect(() => {
    setSceenHeight(list.current?.clientHeight ?? 0)
    setEndIndex(0 + visibleCount)
  }, [visibleCount])

  const handleScroll = () => {
    const scrollTop = list.current?.scrollTop ?? 0
    const startIndexValue = Math.floor(scrollTop / itemSize)
    setStartIndex(startIndexValue)
    setEndIndex(startIndexValue + visibleCount)
    setStartOffset(scrollTop - (scrollTop % itemSize))
  }

  return (
    <div ref={list} className="infinite-list-container" onScroll={handleScroll}>
      <div className="infinite-list-phantom" style={{ height: `${listHeight}px` }}></div>
      <div className="infinite-list" style={{ transform: transformValue }}>
        {visibleData.map((item) => (
          <div
            className="infinite-list-item"
            style={{ height: itemSize, lineHeight: itemSize + 'px' }}
            key={item.id}
          >
            {item.value}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VirtualList1
