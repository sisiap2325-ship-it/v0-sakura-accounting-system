import { pgTable, text, timestamp, boolean, varchar, index, bigint, date, timestamp as tsType } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Better Auth required tables
export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('emailverified').default(false),
    name: text('name'),
    image: text('image'),
    role: text('role').default('viewer').notNull(),
    permissions: text('permissions').array().default([]),
    createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_user_email').on(table.email)]
)

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expiresat', { withTimezone: true }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
    ipAddress: text('ipaddress'),
    userAgent: text('useragent'),
    userId: text('userid')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('idx_session_userId').on(table.userId)]
)

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('accountid').notNull(),
    providerId: text('providerid').notNull(),
    userId: text('userid')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('accesstoken'),
    refreshToken: text('refreshtoken'),
    idToken: text('idtoken'),
    accessTokenExpiresAt: timestamp('accesstokenexpiresat', { withTimezone: true }),
    refreshTokenExpiresAt: timestamp('refreshtokenexpiresat', { withTimezone: true }),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_account_userId').on(table.userId)]
)

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresat', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
})

// App-specific tables
export const asset = pgTable(
  'asset',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    category: text('category').notNull(),
    value: bigint('value', { mode: 'number' }).notNull(),
    acquisitionCost: bigint('acquisitioncost', { mode: 'number' }).notNull(), // Harga Perolehan
    bookValue: bigint('bookvalue', { mode: 'number' }).notNull(), // Nilai Buku
    depreciation: bigint('depreciation', { mode: 'number' }).default(0), // Total Penyusutan
    depreciationRate: bigint('depreciationrate', { mode: 'number' }).default(0), // Tarif Penyusutan (%)
    depreciationMethod: text('depreciationmethod').default('straight-line'), // Metode: straight-line, declining-balance, units-of-production
    condition: text('condition').notNull(),
    location: text('location').notNull(),
    purchaseDate: date('purchasedate', { mode: 'date' }).notNull(),
    notes: text('notes'),
    createdBy: text('createdby').references(() => user.id, { onDelete: 'set null' }),
    lastModifiedBy: text('lastmodifiedby').references(() => user.id, { onDelete: 'set null' }),
    userId: text('userid')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_asset_userId').on(table.userId),
    index('idx_asset_createdBy').on(table.createdBy),
  ]
)

export const activityLog = pgTable(
  'activity_log',
  {
    id: text('id').primaryKey(),
    userId: text('userid')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    action: text('action').notNull(),
    resourceType: text('resource_type').notNull(),
    resourceId: text('resource_id'),
    description: text('description'),
    createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_activity_userId').on(table.userId)]
)

// Master Data Tables
export const incomeCategory = pgTable(
  'income_category',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    code: text('code').unique(),
    createdBy: text('createdby')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_income_category_createdBy').on(table.createdBy)]
)

export const expenseCategory = pgTable(
  'expense_category',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    code: text('code').unique(),
    createdBy: text('createdby')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_expense_category_createdBy').on(table.createdBy)]
)

export const incomeAccount = pgTable(
  'income_account',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    accountNumber: text('accountnumber').unique(),
    categoryId: text('categoryid').references(() => incomeCategory.id, { onDelete: 'set null' }),
    createdBy: text('createdby')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_income_account_categoryId').on(table.categoryId)]
)

export const expenseAccount = pgTable(
  'expense_account',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    accountNumber: text('accountnumber').unique(),
    categoryId: text('categoryid').references(() => expenseCategory.id, { onDelete: 'set null' }),
    createdBy: text('createdby')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_expense_account_categoryId').on(table.categoryId)]
)

// Relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  assets: many(asset),
  activities: many(activityLog),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const assetRelations = relations(asset, ({ one }) => ({
  user: one(user, {
    fields: [asset.userId],
    references: [user.id],
  }),
  creator: one(user, {
    fields: [asset.createdBy],
    references: [user.id],
  }),
}))

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  user: one(user, {
    fields: [activityLog.userId],
    references: [user.id],
  }),
}))

// Master Data Relations
export const incomeCategoryRelations = relations(incomeCategory, ({ one, many }) => ({
  creator: one(user, {
    fields: [incomeCategory.createdBy],
    references: [user.id],
  }),
  accounts: many(incomeAccount),
}))

export const expenseCategoryRelations = relations(expenseCategory, ({ one, many }) => ({
  creator: one(user, {
    fields: [expenseCategory.createdBy],
    references: [user.id],
  }),
  accounts: many(expenseAccount),
}))

export const incomeAccountRelations = relations(incomeAccount, ({ one }) => ({
  category: one(incomeCategory, {
    fields: [incomeAccount.categoryId],
    references: [incomeCategory.id],
  }),
  creator: one(user, {
    fields: [incomeAccount.createdBy],
    references: [user.id],
  }),
}))

export const expenseAccountRelations = relations(expenseAccount, ({ one }) => ({
  category: one(expenseCategory, {
    fields: [expenseAccount.categoryId],
    references: [expenseCategory.id],
  }),
  creator: one(user, {
    fields: [expenseAccount.createdBy],
    references: [user.id],
  }),
}))
