import VirtualList4, { ItemType } from '@/components/virtual-list-4'
import { faker } from '@faker-js/faker'

const data: ItemType[] = []
for (let i = 0; i < 1000; i++) {
  data.push({ id: `_${i}`, value: faker.lorem.sentences() })
}

const VirtualListDemo4 = () => {
  return <VirtualList4 listData={data} estimatedItemSize={50} bufferScale={1} />
}

export default VirtualListDemo4
