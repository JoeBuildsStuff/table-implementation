import { z } from "zod"

// Validation schema for creating a new record
export const createRecordSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  description: z.string().min(1, "Description is required").max(255, "Description must be less than 255 characters"),
})

// Validation schema for updating a record
export const updateRecordSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  description: z.string().min(1, "Description is required").max(255, "Description must be less than 255 characters"),
})

// Validation schema for bulk operations
export const bulkUpdateSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one ID is required"),
  updates: z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters").optional(),
    description: z.string().min(1, "Description is required").max(255, "Description must be less than 255 characters").optional(),
  }),
})

// Type exports
export type CreateRecordInput = z.infer<typeof createRecordSchema>
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>
export type BulkUpdateInput = z.infer<typeof bulkUpdateSchema>
