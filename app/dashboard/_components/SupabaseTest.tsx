'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { getTestRecords, createTestRecord, updateTestRecord, deleteTestRecord, 
    type TestRecord, 
    type TestRecordFormData
} from '@/lib/actions/supabasetest.actions'

export default function SupabaseTest() {
  const [records, setRecords] = useState<TestRecord[]>([])
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDescription, setEditDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { user } = useUser()

  useEffect(() => {
    if (!user) return
    fetchRecords()
  }, [user])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const data = await getTestRecords()
      setRecords(data)
      setMessage('Records loaded successfully')
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : error}`)
    } finally {
      setLoading(false)
    }
  }

  const createRecord = async () => {
    if (!description.trim()) return

    try {
      setLoading(true)
      const formData: TestRecordFormData = { description: description.trim() }
      await createTestRecord(formData)
      setDescription('')
      fetchRecords()
      setMessage('Record created successfully')
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : error}`)
    } finally {
      setLoading(false)
    }
  }

  const updateRecord = async (id: string) => {
    if (!editDescription.trim()) return

    try {
      setLoading(true)
      const formData: TestRecordFormData = { description: editDescription.trim() }
      await updateTestRecord(id, formData)
      setEditingId(null)
      setEditDescription('')
      fetchRecords()
      setMessage('Record updated successfully')
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return

    try {
      setLoading(true)
      await deleteTestRecord(id)
      fetchRecords()
      setMessage('Record deleted successfully')
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : error}`)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div>Please sign in to test Supabase connection</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      <p className="mb-4 text-gray-600">User ID: {user.id}</p>

      {message && (
        <div className={`p-3 mb-4 rounded ${
          message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Create Record */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Create New Record</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={createRecord}
            disabled={loading || !description.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>

      {/* Records List */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Your Records ({records.length})</h2>
        {loading && <p>Loading...</p>}
        {records.length === 0 && !loading && (
          <p className="text-gray-500">No records found. Create your first record above!</p>
        )}

        <div className="space-y-2">
          {records.map((record) => (
            <div key={record.id} className="p-3 border rounded">
              {editingId === record.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="flex-1 p-1 border rounded"
                  />
                  <button
                    onClick={() => updateRecord(record.id)}
                    disabled={loading}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null)
                      setEditDescription('')
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{record.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(record.id)
                        setEditDescription(record.description)
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      disabled={loading}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}