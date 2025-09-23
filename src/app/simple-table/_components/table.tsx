
import { DataTable } from "@/components/data-table/data-table"
import { parseSearchParams, SearchParams } from "@/lib/data-table"
import { ColumnDef } from "@tanstack/react-table"

import { columns } from "./columns"
import { getRecords } from "../_lib/querries"
import { deleteRecords, createRecord, updateRecord, multiUpdateRecords } from "../_lib/actions"
// import { SimpleAddForm, SimpleEditForm, SimpleMultiEditForm } from "./form-wrapper"

interface DataTableSimpleProps {
  searchParams?: SearchParams
}

export default async function DataTableSimple({ 
  searchParams = {} 
}: DataTableSimpleProps) {
  const { data, count, error } = await getRecords(searchParams)
  const { pagination } = parseSearchParams(searchParams)

  if (error) {
    console.error(error)
  }

  const pageCount = Math.ceil((count ?? 0) / (pagination?.pageSize ?? 10))
  const initialState = {
    ...parseSearchParams(searchParams),
  }

  // Cast the data and actions to match DataTable's expected types
  const tableData = data as unknown as Record<string, unknown>[]
  const tableColumns = columns as ColumnDef<Record<string, unknown>, unknown>[]
  

  return (
    <>
      <DataTable 
        columns={tableColumns} 
        data={tableData} 
        pageCount={pageCount}
        initialState={initialState}
        tableKey="simple-table"
        deleteAction={deleteRecords}
        createAction={createRecord}
        updateActionSingle={updateRecord}
        updateActionMulti={multiUpdateRecords}
        // customAddForm={AddForm}
        // customEditFormSingle={EditFormSingle}
        // customEditFormMulti={EditFormMulti}
      />
    </>
  )
}
