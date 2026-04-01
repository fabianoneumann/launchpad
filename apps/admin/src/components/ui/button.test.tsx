import { render, screen } from '@testing-library/react'
import { Button } from './button'

test('renders button with label', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
})
