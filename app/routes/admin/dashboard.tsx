import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@hooks/useAuth'

export function meta() {
  return [
    { title: 'Admin Dashboard - Open Talk Conference' },
    {
      name: 'description',
      content: 'Admin dashboard for Open Talk Conference management',
    },
  ]
}

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}
