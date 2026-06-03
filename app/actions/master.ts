'use server'

import { db } from '@/lib/db'
import {
  incomeCategory,
  expenseCategory,
  incomeAccount,
  expenseAccount,
  user as userTable,
} from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

// Helper to get user ID from localStorage token (client-side compatible)
export async function getSessionUserId() {
  // This will be called from client side, so we need to pass userId
  return null
}

// Income Category Actions
export async function getIncomeCategories(userId: string) {
  return db
    .select()
    .from(incomeCategory)
    .where(eq(incomeCategory.createdBy, userId))
    .orderBy(desc(incomeCategory.createdAt))
}

export async function createIncomeCategory(
  userId: string,
  data: {
    name: string
    description?: string
    code?: string
  }
) {
  if (!userId) throw new Error('Unauthorized')

  const id = crypto.randomUUID()

  await db.insert(incomeCategory).values({
    id,
    name: data.name,
    description: data.description,
    code: data.code,
    createdBy: userId,
  })

  revalidatePath('/master/kategori')
  return { id, ...data }
}

export async function updateIncomeCategory(
  userId: string,
  categoryId: string,
  data: {
    name: string
    description?: string
    code?: string
  }
) {
  if (!userId) throw new Error('Unauthorized')

  // Verify ownership
  const existing = await db
    .select()
    .from(incomeCategory)
    .where(
      and(
        eq(incomeCategory.id, categoryId),
        eq(incomeCategory.createdBy, userId)
      )
    )
    .limit(1)

  if (existing.length === 0) throw new Error('Category not found or unauthorized')

  await db
    .update(incomeCategory)
    .set({
      name: data.name,
      description: data.description,
      code: data.code,
      updatedAt: new Date(),
    })
    .where(eq(incomeCategory.id, categoryId))

  revalidatePath('/master/kategori')
}

export async function deleteIncomeCategory(userId: string, categoryId: string) {
  if (!userId) throw new Error('Unauthorized')

  // Verify ownership
  const existing = await db
    .select()
    .from(incomeCategory)
    .where(
      and(
        eq(incomeCategory.id, categoryId),
        eq(incomeCategory.createdBy, userId)
      )
    )
    .limit(1)

  if (existing.length === 0) throw new Error('Category not found or unauthorized')

  await db.delete(incomeCategory).where(eq(incomeCategory.id, categoryId))

  revalidatePath('/master/kategori')
}

// Expense Category Actions
export async function getExpenseCategories(userId: string) {
  return db
    .select()
    .from(expenseCategory)
    .where(eq(expenseCategory.createdBy, userId))
    .orderBy(desc(expenseCategory.createdAt))
}

export async function createExpenseCategory(
  userId: string,
  data: {
    name: string
    description?: string
    code?: string
  }
) {
  if (!userId) throw new Error('Unauthorized')

  const id = crypto.randomUUID()

  await db.insert(expenseCategory).values({
    id,
    name: data.name,
    description: data.description,
    code: data.code,
    createdBy: userId,
  })

  revalidatePath('/master/kategori')
  return { id, ...data }
}

export async function updateExpenseCategory(
  userId: string,
  categoryId: string,
  data: {
    name: string
    description?: string
    code?: string
  }
) {
  if (!userId) throw new Error('Unauthorized')

  const existing = await db
    .select()
    .from(expenseCategory)
    .where(
      and(
        eq(expenseCategory.id, categoryId),
        eq(expenseCategory.createdBy, userId)
      )
    )
    .limit(1)

  if (existing.length === 0) throw new Error('Category not found or unauthorized')

  await db
    .update(expenseCategory)
    .set({
      name: data.name,
      description: data.description,
      code: data.code,
      updatedAt: new Date(),
    })
    .where(eq(expenseCategory.id, categoryId))

  revalidatePath('/master/kategori')
}

export async function deleteExpenseCategory(userId: string, categoryId: string) {
  if (!userId) throw new Error('Unauthorized')

  const existing = await db
    .select()
    .from(expenseCategory)
    .where(
      and(
        eq(expenseCategory.id, categoryId),
        eq(expenseCategory.createdBy, userId)
      )
    )
    .limit(1)

  if (existing.length === 0) throw new Error('Category not found or unauthorized')

  await db.delete(expenseCategory).where(eq(expenseCategory.id, categoryId))

  revalidatePath('/master/kategori')
}

// Income Account Actions
export async function getIncomeAccounts(userId: string) {
  return db
    .select()
    .from(incomeAccount)
    .where(eq(incomeAccount.createdBy, userId))
    .orderBy(desc(incomeAccount.createdAt))
}

export async function createIncomeAccount(
  userId: string,
  data: {
    name: string
    description?: string
    accountNumber?: string
    categoryId?: string
  }
) {
  if (!userId) throw new Error('Unauthorized')

  const id = crypto.randomUUID()

  await db.insert(incomeAccount).values({
    id,
    name: data.name,
    description: data.description,
    accountNumber: data.accountNumber,
    categoryId: data.categoryId,
    createdBy: userId,
  })

  revalidatePath('/master/akun')
  return { id, ...data }
}

export async function updateIncomeAccount(
  userId: string,
  accountId: string,
  data: {
    name: string
    description?: string
    accountNumber?: string
    categoryId?: string
  }
) {
  if (!userId) throw new Error('Unauthorized')

  const existing = await db
    .select()
    .from(incomeAccount)
    .where(
      and(eq(incomeAccount.id, accountId), eq(incomeAccount.createdBy, userId))
    )
    .limit(1)

  if (existing.length === 0) throw new Error('Account not found or unauthorized')

  await db
    .update(incomeAccount)
    .set({
      name: data.name,
      description: data.description,
      accountNumber: data.accountNumber,
      categoryId: data.categoryId,
      updatedAt: new Date(),
    })
    .where(eq(incomeAccount.id, accountId))

  revalidatePath('/master/akun')
}

export async function deleteIncomeAccount(userId: string, accountId: string) {
  if (!userId) throw new Error('Unauthorized')

  const existing = await db
    .select()
    .from(incomeAccount)
    .where(
      and(eq(incomeAccount.id, accountId), eq(incomeAccount.createdBy, userId))
    )
    .limit(1)

  if (existing.length === 0) throw new Error('Account not found or unauthorized')

  await db.delete(incomeAccount).where(eq(incomeAccount.id, accountId))

  revalidatePath('/master/akun')
}

// Expense Account Actions
export async function getExpenseAccounts(userId: string) {
  return db
    .select()
    .from(expenseAccount)
    .where(eq(expenseAccount.createdBy, userId))
    .orderBy(desc(expenseAccount.createdAt))
}

export async function createExpenseAccount(
  userId: string,
  data: {
    name: string
    description?: string
    accountNumber?: string
    categoryId?: string
  }
) {
  if (!userId) throw new Error('Unauthorized')

  const id = crypto.randomUUID()

  await db.insert(expenseAccount).values({
    id,
    name: data.name,
    description: data.description,
    accountNumber: data.accountNumber,
    categoryId: data.categoryId,
    createdBy: userId,
  })

  revalidatePath('/master/akun')
  return { id, ...data }
}

export async function updateExpenseAccount(
  userId: string,
  accountId: string,
  data: {
    name: string
    description?: string
    accountNumber?: string
    categoryId?: string
  }
) {
  if (!userId) throw new Error('Unauthorized')

  const existing = await db
    .select()
    .from(expenseAccount)
    .where(
      and(eq(expenseAccount.id, accountId), eq(expenseAccount.createdBy, userId))
    )
    .limit(1)

  if (existing.length === 0) throw new Error('Account not found or unauthorized')

  await db
    .update(expenseAccount)
    .set({
      name: data.name,
      description: data.description,
      accountNumber: data.accountNumber,
      categoryId: data.categoryId,
      updatedAt: new Date(),
    })
    .where(eq(expenseAccount.id, accountId))

  revalidatePath('/master/akun')
}

export async function deleteExpenseAccount(userId: string, accountId: string) {
  if (!userId) throw new Error('Unauthorized')

  const existing = await db
    .select()
    .from(expenseAccount)
    .where(
      and(eq(expenseAccount.id, accountId), eq(expenseAccount.createdBy, userId))
    )
    .limit(1)

  if (existing.length === 0) throw new Error('Account not found or unauthorized')

  await db.delete(expenseAccount).where(eq(expenseAccount.id, accountId))

  revalidatePath('/master/akun')
}
