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
  // 原数据与列表项的高度
  const { listData = [], itemSize = 200 } = props
  // 视口的高度
  const [screenHeight, setSceenHeight] = useState(0)
  // 渲染数据起始索引
  const [startIndex, setStartIndex] = useState(0)
  // 实际渲染数据的 2D 位移偏移量
  const [startOffset, setStartOffset] = useState(0)

  // 最外层容器，获取 scrollTop 属性，并监听滚动事件
  const list = useRef<HTMLDivElement>(null)

  // 内层撑开外层容器的高度，由数据量和元素高度决定
  const listHeight = useMemo(() => listData.length * itemSize, [listData.length, itemSize])
  // 可视区域渲染元素数据的数量，由视口高度与元素高度决定
  const visibleCount = useMemo(() => Math.ceil(screenHeight / itemSize), [screenHeight, itemSize])
  // 结束索引，由开始索引和可视数据的数量决定
  const endIndex = useMemo(() => startIndex + visibleCount, [startIndex, visibleCount])
  // 实际渲染数据的列表，由总数据与起始索引与结束索引决定
  const visibleData = useMemo(
    () => listData.slice(startIndex, Math.min(listData.length, endIndex)),
    [startIndex, endIndex, listData]
  )

  // 在视口发生 Resize 事件的时候需要重新设置高度，触发 visibleCount 数量的变化
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

  const handleScroll = () => {
    // 获取外部元素的 scrollTop 属性
    const scrollTop = list.current?.scrollTop ?? 0
    // 计算出当前可视数据的起始 index ，注意需要向下取整，由于元素的不完全展示
    const startIndexValue = Math.floor(scrollTop / itemSize)
    setStartIndex(startIndexValue)
    // 小于等于元素高度的滚动位移的体现由原生的 scrollTop 属性体现，反之由内容元素的 2D 位移与 scrollTop属性共同实现
    setStartOffset(scrollTop - (scrollTop % itemSize))
  }

  return (
    <div ref={list} className="infinite-list-container" onScroll={handleScroll}>
      {/* 最外层容器，获取 scrollTop 属性，并监听滚动事件 */}
      <div className="infinite-list-phantom" style={{ height: `${listHeight}px` }}></div>
      {/* 用于将最外层容器的高度撑开，获取滚动效果 */}
      <div className="infinite-list" style={{ transform: `translateY(${startOffset}px` }}>
        {/* 实际的渲染层，动态增减元素渲染，减少过多 dom 元素渲染带来的性能损耗 */}
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
