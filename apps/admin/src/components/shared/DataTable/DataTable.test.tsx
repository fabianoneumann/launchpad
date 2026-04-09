import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
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
  it('exibe rodapé quando há dados e várias páginas', () => {
    const onPageChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={data}
        rowCount={25}
        pagination={{ page: 1, pageSize: 10, onPageChange, onPageSizeChange: vi.fn() }}
      />,
    )

    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    expect(screen.getByText('25 resultados')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Próxima página' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled()
  })

  it('exibe rodapé quando há dados e uma única página (rowCount <= pageSize)', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowCount={5}
        pagination={{ page: 1, pageSize: 10, onPageChange: vi.fn(), onPageSizeChange: vi.fn() }}
      />,
    )

    expect(screen.getByText('1 / 1')).toBeInTheDocument()
    expect(screen.getByText('5 resultados')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Itens por página' })).toBeInTheDocument()
  })

  it('não exibe rodapé quando rowCount é 0', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        rowCount={0}
        pagination={{ page: 1, pageSize: 10, onPageChange: vi.fn(), onPageSizeChange: vi.fn() }}
      />,
    )

    expect(screen.queryByRole('combobox', { name: 'Itens por página' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Próxima página' })).not.toBeInTheDocument()
  })

  it('exibe "1 resultado" no singular', () => {
    render(
      <DataTable
        columns={columns}
        data={[data[0]!]}
        rowCount={1}
        pagination={{ page: 1, pageSize: 10, onPageChange: vi.fn(), onPageSizeChange: vi.fn() }}
      />,
    )

    expect(screen.getByText('1 resultado')).toBeInTheDocument()
  })

  it('exibe "2 resultados" no plural', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowCount={2}
        pagination={{ page: 1, pageSize: 10, onPageChange: vi.fn(), onPageSizeChange: vi.fn() }}
      />,
    )

    expect(screen.getByText('2 resultados')).toBeInTheDocument()
  })

  it('chama onPageChange ao clicar em Próxima página', async () => {
    const onPageChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={data}
        rowCount={25}
        pagination={{ page: 1, pageSize: 10, onPageChange, onPageSizeChange: vi.fn() }}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Próxima página' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('chama onPageSizeChange ao alterar o seletor de itens por página', async () => {
    const onPageSizeChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={data}
        rowCount={25}
        pagination={{ page: 1, pageSize: 10, onPageChange: vi.fn(), onPageSizeChange }}
      />,
    )

    fireEvent.click(screen.getByRole('combobox', { name: 'Itens por página' }))
    await waitFor(() => screen.getByRole('option', { name: '50 por página' }))
    fireEvent.click(screen.getByRole('option', { name: '50 por página' }))

    expect(onPageSizeChange).toHaveBeenCalledWith(50)
  })

  it('não renderiza seletor de itens por página sem onPageSizeChange', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowCount={5}
        pagination={{ page: 1, pageSize: 10, onPageChange: vi.fn() }}
      />,
    )

    expect(screen.queryByRole('combobox', { name: 'Itens por página' })).not.toBeInTheDocument()
    expect(screen.getByText('5 resultados')).toBeInTheDocument()
  })
})
