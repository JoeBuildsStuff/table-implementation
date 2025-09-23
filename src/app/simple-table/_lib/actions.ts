"use server"

import { revalidatePath } from "next/cache"
import { createRecordSchema, updateRecordSchema, bulkUpdateSchema, type CreateRecordInput, type UpdateRecordInput } from "./validations"
import { addRecord, updateRecordById, updateMultipleRecords, deleteRecordsByIds } from "./data"

// Create a new record
export async function createRecord(input: CreateRecordInput) {
  try {
    const validatedInput = createRecordSchema.parse(input)
    
    const newRecord = addRecord({
      title: validatedInput.title,
      description: validatedInput.description,
    })
    
    revalidatePath("/simple-table")
    
    return { success: true, data: newRecord }
  } catch (error) {
    console.error("Error creating record:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create record" 
    }
  }
}

// Update a single record
export async function updateRecord(id: string, data: Partial<UpdateRecordInput>) {
  try {
    // Create the full input object for validation
    const input = {
      id,
      title: data.title || "",
      description: data.description || "",
    }
    
    const validatedInput = updateRecordSchema.parse(input)
    
    const updatedRecord = updateRecordById(validatedInput.id, {
      title: validatedInput.title,
      description: validatedInput.description,
    })
    
    if (!updatedRecord) {
      return { success: false, error: "Record not found" }
    }
    
    revalidatePath("/simple-table")
    
    return { success: true, data: updatedRecord }
  } catch (error) {
    console.error("Error updating record:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update record" 
    }
  }
}

// Update multiple records
export async function multiUpdateRecords(ids: string[], data: Partial<UpdateRecordInput>) {
  try {
    // Create the full input object for validation
    const input = {
      ids,
      updates: {
        title: data.title,
        description: data.description,
      }
    }
    
    const validatedInput = bulkUpdateSchema.parse(input)
    
    const updatedRecords = updateMultipleRecords(validatedInput.ids, {
      ...validatedInput.updates,
    })
    
    revalidatePath("/simple-table")
    
    return { success: true, data: updatedRecords }
  } catch (error) {
    console.error("Error updating records:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update records" 
    }
  }
}

// Delete records
export async function deleteRecords(ids: string[]) {
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { success: false, error: "No IDs provided" }
    }
    
    const deletedRecords = deleteRecordsByIds(ids)
    
    revalidatePath("/simple-table")
    
    return { success: true, data: deletedRecords }
  } catch (error) {
    console.error("Error deleting records:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete records" 
    }
  }
}
