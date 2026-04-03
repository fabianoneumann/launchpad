import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '../src/mocks/node'

// Recharts' ResponsiveContainer uses ResizeObserver, which is not available in jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Radix UI Select calls scrollIntoView on mount, which is not implemented in jsdom
Element.prototype.scrollIntoView = () => {}

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
