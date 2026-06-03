'use server'

import { db } from '@/lib/db'
import { asset, user, activityLog } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// Helper function to get current user ID - needs to be called with userId from client
export async function getAssets(userId: string) {
  if (!userId) throw new Error('Unauthorized')
  return db
    .select()
    .from(asset)
    .where(eq(asset.userId, userId))
    .orderBy(desc(asset.createdAt))
}

export async function createAsset(
  userId: string,
  data: {
    name: string
    category: string
    value: number
    condition: string
    location: string
    purchaseDate: string
    notes?: string
  }
) {
  if (!userId) throw new Error('Unauthorized')
  const id = crypto.randomUUID()

  await db.insert(asset).values({
    id,
    userId,
    createdBy: userId,
    name: data.name,
    category: data.category,
    value: data.value,
    condition: data.condition,
    location: data.location,
    purchaseDate: new Date(data.purchaseDate),
    notes: data.notes || '',
  })

  // Log activity
  await db.insert(activityLog).values({
    id: crypto.randomUUID(),
    userId,
    action: 'CREATE',
    resourceType: 'ASSET',
    resourceId: id,
    description: `Created asset: ${data.name}`,
  })

  revalidatePath('/aset')
  return id
}

export async function updateAsset(
  userId: string,
  id: string,
  data: {
    name: string
    category: string
    value: number
    condition: string
    location: string
    purchaseDate: string
    notes?: string
  },
  userRole: string
) {
  if (!userId) throw new Error('Unauthorized')

  // Get the asset to check permissions
  const existingAsset = await db
    .select()
    .from(asset)
    .where(eq(asset.id, id))
    .limit(1)

  if (!existingAsset[0]) throw new Error('Asset not found')

  // Check permission: Admin can edit any, Staff can edit own
  if (userRole !== 'admin' && existingAsset[0].userId !== userId) {
    throw new Error('Permission denied')
  }

  if (userRole === 'viewer') throw new Error('Viewers cannot edit assets')

  await db
    .update(asset)
    .set({
      name: data.name,
      category: data.category,
      value: data.value,
      condition: data.condition,
      location: data.location,
      purchaseDate: new Date(data.purchaseDate),
      notes: data.notes || '',
      lastModifiedBy: userId,
      updatedAt: new Date(),
    })
    .where(eq(asset.id, id))

  // Log activity
  await db.insert(activityLog).values({
    id: crypto.randomUUID(),
    userId,
    action: 'UPDATE',
    resourceType: 'ASSET',
    resourceId: id,
    description: `Updated asset: ${data.name}`,
  })

  revalidatePath('/aset')
}

export async function deleteAsset(userId: string, id: string, userRole: string) {
  if (!userId) throw new Error('Unauthorized')

  // Get the asset to check permissions
  const existingAsset = await db
    .select()
    .from(asset)
    .where(eq(asset.id, id))
    .limit(1)

  if (!existingAsset[0]) throw new Error('Asset not found')

  // Check permission: Only Admin can delete
  if (userRole !== 'admin') {
    throw new Error('Only admins can delete assets')
  }

  await db.delete(asset).where(eq(asset.id, id))

  // Log activity
  await db.insert(activityLog).values({
    id: crypto.randomUUID(),
    userId,
    action: 'DELETE',
    resourceType: 'ASSET',
    resourceId: id,
    description: `Deleted asset`,
  })

  revalidatePath('/aset')
}

// User management (Admin only)
export async function getUsers(userId: string, userRole: string) {
  if (!userId) throw new Error('Unauthorized')
  if (userRole !== 'admin') throw new Error('Only admins can view users')

  return db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    })
    .from(user)
}

export async function updateUserRole(
  currentUserId: string,
  targetUserId: string,
  role: 'admin' | 'staff' | 'viewer',
  userRole: string
) {
  if (!currentUserId) throw new Error('Unauthorized')
  if (userRole !== 'admin') throw new Error('Only admins can manage roles')

  await db
    .update(user)
    .set({
      role,
      updatedAt: new Date(),
    })
    .where(eq(user.id, targetUserId))

  // Log activity
  await db.insert(activityLog).values({
    id: crypto.randomUUID(),
    userId: currentUserId,
    action: 'UPDATE_ROLE',
    resourceType: 'USER',
    resourceId: targetUserId,
    description: `Changed user role to ${role}`,
  })

  revalidatePath('/pengaturan')
}

// Update current user profile
export async function updateUserProfile(userId: string, data: { name: string; email: string }) {
  if (!userId) throw new Error('Unauthorized')

  await db
    .update(user)
    .set({
      name: data.name,
      email: data.email,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))

  revalidatePath('/akun')
}

// Change password (handled by auth, but we can log it)
export async function logPasswordChange(userId: string) {
  if (!userId) throw new Error('Unauthorized')

  await db.insert(activityLog).values({
    id: crypto.randomUUID(),
    userId,
    action: 'CHANGE_PASSWORD',
    resourceType: 'USER',
    resourceId: userId,
    description: `Changed password`,
  })

  revalidatePath('/akun')
}
