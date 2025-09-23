import { SearchParams } from "@/lib/data-table"
import { getAllRecords, type Record } from "./data"

export async function getRecords(searchParams: SearchParams = {}) {
  try {
    // Parse search parameters
    const page = parseInt(searchParams.page as string) || 1
    const pageSize = parseInt(searchParams.pageSize as string) || 10
    const sort = searchParams.sort as string
    const filters = searchParams.filters as string

    let filteredData = [...getAllRecords()]

    // Apply filters if provided
    if (filters) {
      try {
        const parsedFilters = JSON.parse(decodeURIComponent(filters))
        filteredData = applyFilters(filteredData, parsedFilters)
      } catch (error) {
        console.error("Error parsing filters:", error)
      }
    }

    // Apply sorting if provided
    if (sort) {
      filteredData = applySorting(filteredData, sort)
    }

    // Calculate pagination
    const totalCount = filteredData.length
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = filteredData.slice(startIndex, endIndex)

    return {
      data: paginatedData,
      count: totalCount,
      error: null
    }
  } catch (error) {
    console.error("Error fetching records:", error)
    return {
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

function applyFilters(data: Record[], filters: Array<{id: string; value: unknown; operator: string}>) {
  return data.filter(record => {
    return filters.every(filter => {
      const { id, value, operator } = filter
      const recordValue = record[id as keyof typeof record]

      switch (operator) {
        case "iLike":
          return typeof recordValue === "string" && 
                 recordValue.toLowerCase().includes((value as string).toLowerCase())
        case "eq":
          return recordValue === value
        case "ne":
          return recordValue !== value
        case "isEmpty":
          return recordValue === null || recordValue === undefined || recordValue === ""
        case "isNotEmpty":
          return recordValue !== null && recordValue !== undefined && recordValue !== ""
        default:
          return true
      }
    })
  })
}

function applySorting(data: Record[], sort: string) {
  const sortParts = sort.split(',')
  
  return [...data].sort((a, b) => {
    for (const sortPart of sortParts) {
      const [columnId, direction] = sortPart.split(':')
      const aValue = a[columnId as keyof typeof a]
      const bValue = b[columnId as keyof typeof b]
      
      let comparison = 0
      
      if (aValue < bValue) comparison = -1
      else if (aValue > bValue) comparison = 1
      
      if (direction === 'desc') comparison *= -1
      
      if (comparison !== 0) return comparison
    }
    return 0
  })
}
