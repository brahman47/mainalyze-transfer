'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Skeleton AI Evaluation states
  const [evaluating, setEvaluating] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState<any>(null)
  const [evalError, setEvalError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadError(null)
    setUploadedUrls([])

    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append('files', file)
    })

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setUploadedUrls(data.urls || [])
      if (data.errors && data.errors.length > 0) {
        setUploadError('Some files failed: ' + data.errors.join(', '))
      }
    } catch (err: any) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
      // Reset file input
      e.target.value = ''
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
      <p className="text-gray-600 mb-8">{user?.email}</p>

      <div className="space-y-8">
        {/* Answer Upload Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-2">Answer Upload</h2>
          <p className="text-gray-600 mb-6">
            Upload your handwritten or typed answers (JPG, PNG, PDF). Max 10MB per file.
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800 disabled:opacity-50"
            />
            <p className="mt-2 text-xs text-gray-500">
              You can select multiple files at once
            </p>
          </div>

          {uploading && (
            <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-900 rounded-full"></div>
              Uploading...
            </div>
          )}

          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {uploadError}
            </div>
          )}

          {uploadedUrls.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Uploaded Files</h3>
              <ul className="space-y-2 text-sm">
                {uploadedUrls.map((url, index) => (
                  <li key={index} className="break-all">
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>

              {/* === Skeleton AI Evaluation Feature === */}
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={async () => {
                    setEvaluating(true)
                    setEvalError(null)
                    setEvaluationResult(null)

                    try {
                      const { data, error } = await supabase.functions.invoke('evaluate-mains-answer', {
                        body: {
                          question: "Evaluate this UPSC Mains answer",
                          fileUrls: uploadedUrls,
                        }
                      })

                      if (error) throw error

                      setEvaluationResult(data)
                    } catch (err: any) {
                      console.error(err)
                      setEvalError(err.message || 'Failed to get AI evaluation')
                    } finally {
                      setEvaluating(false)
                    }
                  }}
                  disabled={evaluating}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {evaluating ? 'Evaluating with AI...' : 'Run AI Evaluation (Skeleton)'}
                </button>

                {evaluating && (
                  <p className="mt-3 text-sm text-gray-600">Calling Supabase Edge Function + Gemini...</p>
                )}

                {evalError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {evalError}
                  </div>
                )}

                {evaluationResult && (
                  <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-xl">
                    <h4 className="font-bold text-lg mb-3">AI Evaluation Result (Skeleton)</h4>
                    <pre className="text-xs bg-white p-4 rounded overflow-auto max-h-96 border">
                      {JSON.stringify(evaluationResult, null, 2)}
                    </pre>
                    <p className="mt-3 text-xs text-gray-500">
                      This is a neutral skeleton. No AI provider is attached.<br />
                      Implement your own AI logic inside the Edge Function.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-4">Basic Dashboard</h2>
          <p className="text-gray-600">
            This is a minimal version of the application focused on core authentication and file upload.
          </p>
        </div>
      </div>
    </div>
  )
}
