import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RoleBadge } from './RoleBadge'

describe('RoleBadge', () => {
  it('renderiza "Admin" para role ADMIN', () => {
    render(<RoleBadge role="ADMIN" />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('renderiza "Member" para role MEMBER', () => {
    render(<RoleBadge role="MEMBER" />)
    expect(screen.getByText('Member')).toBeInTheDocument()
  })

  it('renderiza "User" para role USER', () => {
    render(<RoleBadge role="USER" />)
    expect(screen.getByText('User')).toBeInTheDocument()
  })
})
