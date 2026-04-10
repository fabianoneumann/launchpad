'use no memo'

import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ReactNode } from 'react'

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const

const DEFAULT_PAGE_SIZE = 20

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  isLoading?: boolean
  rowCount?: number
  pagination?: {
    page: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange?: (size: number) => void
  }
  rowClassName?: (row: T) => string
  emptyState?: ReactNode
}

function formatResultCount(total: number): string {
  return total === 1 ? '1 resultado' : `${total} resultados`
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
  const pageSize = pagination?.pageSize ?? DEFAULT_PAGE_SIZE

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount,
    state: {
      pagination: {
        pageIndex: (pagination?.page ?? 1) - 1,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({
              pageIndex: (pagination?.page ?? 1) - 1,
              pageSize,
            })
          : updater
      pagination?.onPageChange(next.pageIndex + 1)
    },
  })

  const showPagination = pagination !== undefined && rowCount !== undefined && rowCount > 0

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

      {showPagination && pagination && (
        <div className="mt-4 grid grid-cols-3 items-center gap-2 px-1">
          <div className="flex justify-start min-w-0">
            {pagination.onPageSizeChange ? (
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(v) => pagination.onPageSizeChange?.(Number(v))}
              >
                <SelectTrigger
                  size="sm"
                  className="w-auto min-w-12 justify-between"
                  aria-label="Itens por página"
                >
                  <SelectValue>
                    <span className="tabular-nums">{pagination.pageSize}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} por página
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>

          <div className="flex items-center justify-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              aria-label="Página anterior"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-14 text-center text-sm text-muted-foreground tabular-nums">
              {pagination.page} / {table.getPageCount()}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              aria-label="Próxima página"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-right text-sm text-muted-foreground">{formatResultCount(rowCount)}</p>
        </div>
      )}
    </div>
  )
}
