import { auth } from '@clerk/nextjs/server'

export type PlanType = 'free' | 'pro'

export async function getUserPlan(): Promise<PlanType | null> {
  const { has } = await auth()

  if (typeof has === 'function') {
    if (has({ plan: 'pro_plan' })) return 'pro'
    if (has({ plan: 'free_user' })) return 'free'
  }

  return null
}

export async function checkProPlan(): Promise<boolean> {
    const plan = await getUserPlan()
    return plan === 'pro'
}