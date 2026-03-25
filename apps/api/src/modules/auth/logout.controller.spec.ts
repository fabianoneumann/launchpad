import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logoutController } from './logout.controller'

const mockExecute = vi.fn().mockResolvedValue(undefined)

vi.mock('@/shared/factories/make-logout-service', () => ({
  makeLogoutService: () => ({ execute: mockExecute }),
}))

describe('logoutController', () => {
  const clearCookieMock = vi.fn().mockReturnThis()
  const statusMock = vi.fn().mockReturnThis()
  const sendMock = vi.fn().mockReturnThis()

  const mockRequest = {
    user: { sub: 'user-id-123', role: 'USER' as const, tokenVersion: 0 },
  } as Parameters<typeof logoutController>[0]

  const mockReply = {
    clearCookie: clearCookieMock,
    status: statusMock,
    send: sendMock,
  } as unknown as Parameters<typeof logoutController>[1]

  beforeEach(() => {
    vi.clearAllMocks()
    clearCookieMock.mockReturnThis()
    statusMock.mockReturnThis()
    sendMock.mockReturnThis()
  })

  it('should call logout service with the correct user id', async () => {
    await logoutController(mockRequest, mockReply)

    expect(mockExecute).toHaveBeenCalledWith({ userId: 'user-id-123' })
  })

  it('should clear the refresh token cookie and return 204', async () => {
    await logoutController(mockRequest, mockReply)

    expect(clearCookieMock).toHaveBeenCalledWith('refreshToken', { path: '/' })
    expect(statusMock).toHaveBeenCalledWith(204)
    expect(sendMock).toHaveBeenCalled()
  })
})
