'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateUserRole } from '@/app/actions/user'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
}

interface UserManagementProps {
  users: User[]
}

export function UserManagement({ users: initialUsers }: UserManagementProps) {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [message, setMessage] = useState('')

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (newRole === selectedRole[userId] || !newRole) return

    setLoading((prev) => ({ ...prev, [userId]: true }))
    setMessage('')

    try {
      await updateUserRole(userId, newRole as 'admin' | 'staff' | 'viewer')
      setSelectedRole((prev) => ({ ...prev, [userId]: newRole }))
      setMessage('User role updated successfully')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to update role')
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.includes('successfully')
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {initialUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 font-semibold">Joined</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {initialUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.name || 'N/A'}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <Select
                          value={selectedRole[user.id] || user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value)}
                          disabled={loading[user.id]}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(user.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        {loading[user.id] ? (
                          <span className="text-sm text-gray-500">Saving...</span>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Definitions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Full system access</li>
              <li>✓ Create/edit/delete users</li>
              <li>✓ Manage roles</li>
              <li>✓ Access settings</li>
              <li>✓ Full asset management</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Create assets</li>
              <li>✓ Edit own assets</li>
              <li>✓ View all assets</li>
              <li>✗ Cannot delete assets</li>
              <li>✗ Cannot manage users</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Viewer</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ View all assets</li>
              <li>✗ Cannot create assets</li>
              <li>✗ Cannot edit assets</li>
              <li>✗ Cannot delete assets</li>
              <li>✗ Cannot manage users</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
