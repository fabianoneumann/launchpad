import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable } from './DataTable'
import type { ColumnDef } from '@tanstack/react-table'

type Row = { id: string; name: string }

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Nome' },
]

const data: Row[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
]

describe('DataTable — renderização', () => {
  it('renderiza headers e linhas de dados', () => {
    render(<DataTable columns={columns} data={data} />)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Nome')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('exibe skeleton quando isLoading=true', () => {
    render(<DataTable columns={columns} data={[]} isLoading />)

    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('exibe emptyState customizado quando data está vazia', () => {
    render(<DataTable columns={columns} data={[]} emptyState={<p>Lista vazia</p>} />)

    expect(screen.getByText('Lista vazia')).toBeInTheDocument()
  })
})

describe('DataTable — paginação', () => {
  it('exibe paginação quando rowCount > pageSize', () => {
    const onPageChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={data}
        rowCount={25}
        pagination={{ page: 1, pageSize: 10, onPageChange }}
      />,
    )

    expect(screen.getByText('Página 1 de 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /próxima/i })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled()
  })

  it('não exibe paginação quando rowCount <= pageSize', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowCount={5}
        pagination={{ page: 1, pageSize: 10, onPageChange: vi.fn() }}
      />,
    )

    expect(screen.queryByText(/página/i)).not.toBeInTheDocument()
  })

  it('chama onPageChange ao clicar em Próxima', async () => {
    const onPageChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={data}
        rowCount={25}
        pagination={{ page: 1, pageSize: 10, onPageChange }}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /próxima/i }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
