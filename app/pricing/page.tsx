import { PricingTable } from '@clerk/nextjs'

export default function PricingPage() {
  return (
    <div className='max-w-3xl flex mx-auto items-center min-h-screen'>
      <PricingTable />
    </div>
  )
}