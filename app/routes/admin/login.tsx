import { AdminLogin } from '~/components/AdminLogin'

export function meta() {
  return [
    { title: 'Admin Login - Open Talk Conference' },
    {
      name: 'description',
      content: 'Admin login for Open Talk Conference management',
    },
  ]
}

export default function AdminLoginPage() {
  return <AdminLogin />
}
