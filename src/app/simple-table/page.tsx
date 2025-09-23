import DataTableSimple from "./_components/table"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  return (
    <main className="p-1">
      <DataTableSimple searchParams={params} />
    </main>
  )
}