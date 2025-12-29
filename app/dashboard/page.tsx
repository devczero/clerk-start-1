import { checkProPlan } from '@/lib/subscription'
import SupabaseTest from './_components/SupabaseTest'

export default async function Dashboard() {
  const isProUser = await checkProPlan()
  
  if (!isProUser) return <h1 className='text-7xl'>You need to have a pro plan to get an access</h1>

  return (
    <>
      <SupabaseTest/>
    </>
  )
}