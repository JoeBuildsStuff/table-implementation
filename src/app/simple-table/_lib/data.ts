// Mock data store for the simple table
export interface Record {
  id: string
  title: string
  description: string
  created_at: string
  updated_at: string
}

// Initial mock data
export const mockData: Record[] = [
  {
    id: "1",
    title: "Getting Started with React",
    description: "This is a description of the Getting Started with React",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2", 
    title: "Advanced TypeScript Patterns",
    description: "This is a description of the Advanced TypeScript Patterns",
    created_at: "2024-01-16T14:20:00Z",
    updated_at: "2024-01-17T09:15:00Z",
  },
  {
    id: "3",
    title: "Building Scalable APIs",
    description: "This is a description of the Building Scalable APIs",
    created_at: "2024-01-18T16:45:00Z", 
    updated_at: "2024-01-18T16:45:00Z",
  },
]

// Helper functions to manage the data
export function addRecord(record: Omit<Record, 'id' | 'created_at' | 'updated_at'>): Record {
  const newRecord: Record = {
    id: (mockData.length + 1).toString(),
    ...record,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockData.push(newRecord)
  return newRecord
}

export function updateRecordById(id: string, updates: Partial<Omit<Record, 'id' | 'created_at'>>): Record | null {
  const recordIndex = mockData.findIndex(record => record.id === id)
  if (recordIndex === -1) {
    return null
  }
  
  mockData[recordIndex] = {
    ...mockData[recordIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  
  return mockData[recordIndex]
}

export function updateMultipleRecords(ids: string[], updates: Partial<Omit<Record, 'id' | 'created_at'>>): Record[] {
  const updatedRecords: Record[] = []
  
  for (const id of ids) {
    const recordIndex = mockData.findIndex(record => record.id === id)
    if (recordIndex !== -1) {
      mockData[recordIndex] = {
        ...mockData[recordIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      updatedRecords.push(mockData[recordIndex])
    }
  }
  
  return updatedRecords
}

export function deleteRecordsByIds(ids: string[]): Record[] {
  const deletedRecords: Record[] = []
  
  for (const id of ids) {
    const recordIndex = mockData.findIndex(record => record.id === id)
    if (recordIndex !== -1) {
      deletedRecords.push(mockData[recordIndex])
      mockData.splice(recordIndex, 1)
    }
  }
  
  return deletedRecords
}

export function getAllRecords(): Record[] {
  return [...mockData]
}
