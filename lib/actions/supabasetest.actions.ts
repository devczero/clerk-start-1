'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

export interface TestRecord {
  id: string
  user_id: string
  description: string
  created_at: string
  updated_at: string
}

const testRecordSchema = z.object({
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
})

export type TestRecordFormData = z.infer<typeof testRecordSchema>

export async function getTestRecords(): Promise<TestRecord[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('record_test')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function createTestRecord(formData: TestRecordFormData): Promise<TestRecord> {
  const validatedData = testRecordSchema.parse(formData)
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('record_test')
    .insert(validatedData)
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  return data
}

export async function updateTestRecord(id: string, formData: TestRecordFormData): Promise<TestRecord> {
  const validatedData = testRecordSchema.parse(formData)
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('record_test')
    .update(validatedData)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  return data
}

export async function deleteTestRecord(id: string): Promise<void> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('record_test')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
}