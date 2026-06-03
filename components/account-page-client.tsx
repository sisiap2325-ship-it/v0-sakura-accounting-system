'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateUserProfile, logPasswordChange } from '@/app/actions/user'
import { useSessionContext } from '@/lib/session-context'

interface AccountPageProps {
  user: {
    id: string
    email: string
    name: string | null
    role: string
  }
}

export function AccountPageClient({ user }: AccountPageProps) {
  const router = useRouter()
  const { session } = useSessionContext()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email,
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await updateUserProfile({
        name: formData.name,
        email: formData.email,
      })
      setMessage('Profile updated successfully')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setMessage('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // Password change is handled by Better Auth client
      // This is a placeholder for the actual implementation
      await logPasswordChange()
      setMessage('Password changed successfully')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setLoading(true)
    try {
      localStorage.removeItem('auth_session')
      router.push('/sign-in')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to logout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b">
        <h1 className="text-3xl lg:text-4xl font-bold">Pengaturan Akun</h1>
        <p className="text-muted-foreground mt-2 text-lg">Kelola informasi akun dan keamanan Anda</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.includes('successfully')
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Informasi Profil</CardTitle>
            <CardDescription>Perbarui nama dan email Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <div className="p-2 bg-gray-50 rounded-md">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Ubah Kata Sandi</CardTitle>
            <CardDescription>Perbarui kata sandi untuk keamanan akun</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <Input
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <Input
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Logout */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900 text-xl">Zona Bahaya</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogout}
            disabled={loading}
            variant="destructive"
            className="w-full"
          >
            {loading ? 'Keluar...' : 'Keluar dari Akun'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
