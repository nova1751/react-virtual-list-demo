import VirtualList2, { ItemType } from '@/components/virtual-list-2'
import { faker } from '@faker-js/faker'

const data: ItemType[] = []
for (let i = 0; i < 1000; i++) {
  data.push({ id: `_${i}`, value: faker.lorem.sentences() })
}

const VirtualListDemo2 = () => {
  return <VirtualList2 listData={data} estimatedItemSize={50} />
}

export default VirtualListDemo2
