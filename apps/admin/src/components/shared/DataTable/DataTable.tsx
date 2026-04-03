'use no memo'

import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { TableSkeleton } from '@/components/shared/LoadingSkeleton'
import type { ReactNode } from 'react'

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  isLoading?: boolean
  rowCount?: number
  pagination?: {
    page: number
    pageSize: number
    onPageChange: (page: number) => void
  }
  rowClassName?: (row: T) => string
  emptyState?: ReactNode
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  rowCount,
  pagination,
  rowClassName,
  emptyState,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount,
    state: {
      pagination: {
        pageIndex: (pagination?.page ?? 1) - 1,
        pageSize: pagination?.pageSize ?? 10,
      },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({
              pageIndex: (pagination?.page ?? 1) - 1,
              pageSize: pagination?.pageSize ?? 10,
            })
          : updater
      pagination?.onPageChange(next.pageIndex + 1)
    },
  })

  const showPagination = pagination && rowCount !== undefined && rowCount > pagination.pageSize

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-4">
                  <TableSkeleton rows={pagination?.pageSize ?? 5} cols={columns.length} />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  {emptyState ?? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      Nenhum resultado encontrado.
                    </p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className={rowClassName?.(row.original)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-muted-foreground">
            Página {pagination.page} de {table.getPageCount()}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={!table.getCanNextPage()}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
