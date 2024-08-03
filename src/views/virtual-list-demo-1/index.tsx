import VirtualList1, { ItemType } from '@/components/virtual-list-1'

const data: ItemType[] = []
for (let i = 0; i < 1000; i++) {
  data.push({ id: i, value: i })
}

const VirtualListDemo1 = () => {
  return <VirtualList1 listData={data} itemSize={100} />
}

export default VirtualListDemo1
