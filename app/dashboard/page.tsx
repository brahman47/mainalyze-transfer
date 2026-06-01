'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

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

      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-4">Basic Dashboard</h2>
        <p className="text-gray-600 mb-6">
          This is a minimal version of the application.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/dashboard/profile"
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="font-medium">Profile</div>
            <div className="text-sm text-gray-500">Manage your account</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Mains Evaluation</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6">Get AI-powered feedback on your answers</p>
            <div className="flex gap-3">
              <Link
                href="/dashboard/mains"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Submit Answer →
              </Link>
              <Link
                href="/dashboard/mains/history"
                className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                title="View History"
              >
                History
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Prelims Practice</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6">Generate custom MCQs for practice</p>
            <div className="flex gap-3">
              <Link
                href="/dashboard/prelims"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Generate Questions →
              </Link>
              <Link
                href="/dashboard/prelims/history"
                className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                title="View History"
              >
                History
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          
          {stats.recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No activity yet. Start practicing to see your progress!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className="p-5 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">
                        {activity.type === 'mains'
                          ? activity.question.substring(0, 60) + '...'
                          : `${activity.topic} - ${activity.difficulty}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.created_at).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {activity.type === 'mains' && activity.status && (
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          activity.status === 'completed'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : activity.status === 'pending'
                            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {activity.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

