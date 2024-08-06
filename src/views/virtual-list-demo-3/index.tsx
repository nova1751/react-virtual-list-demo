import VirtualList3, { ItemType } from '@/components/virtual-list-3'
import { faker } from '@faker-js/faker'

const data: ItemType[] = []
for (let i = 0; i < 1000; i++) {
  data.push({ id: `_${i}`, value: faker.lorem.sentences() })
}

const VirtualListDemo2 = () => {
  return <VirtualList3 listData={data} itemSize={50} estimatedItemSize={50} bufferScale={1} />
}

export default VirtualListDemo2
