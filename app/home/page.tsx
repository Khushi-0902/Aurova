import { getHomePropertyCards } from '@/lib/property-data'
import { MarketingHome } from '@/components/home/marketing-home'

export default function HomePage() {
  return <MarketingHome properties={getHomePropertyCards()} />
}
