import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  fetchApplications,
  fetchApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../applications'

// Mock the api module (axios instance) rather than raw axios
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

import api from '@/services/api'

const mockApp = {
  id: 1,
  company_name: 'Acme Corp',
  job_title: 'Engineer',
  status: 'applied',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

beforeEach(() => vi.clearAllMocks())

describe('fetchApplications', () => {
  it('calls GET /applications with params', async () => {
    api.get.mockResolvedValue({ data: { items: [mockApp], total: 1 } })
    const result = await fetchApplications({ search: 'acme', status: 'applied' })
    expect(api.get).toHaveBeenCalledWith('/applications', {
      params: { search: 'acme', status: 'applied' },
    })
    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(1)
  })
})

describe('fetchApplication', () => {
  it('calls GET /applications/:id', async () => {
    api.get.mockResolvedValue({ data: mockApp })
    const result = await fetchApplication(1)
    expect(api.get).toHaveBeenCalledWith('/applications/1')
    expect(result.id).toBe(1)
  })
})

describe('createApplication', () => {
  it('calls POST /applications with payload', async () => {
    const payload = { company_name: 'Acme', job_title: 'Dev' }
    api.post.mockResolvedValue({ data: { ...mockApp, ...payload } })
    const result = await createApplication(payload)
    expect(api.post).toHaveBeenCalledWith('/applications', payload)
    expect(result.company_name).toBe('Acme')
  })
})

describe('updateApplication', () => {
  it('calls PUT /applications/:id with payload', async () => {
    const payload = { status: 'interview' }
    api.put.mockResolvedValue({ data: { ...mockApp, ...payload } })
    await updateApplication(1, payload)
    expect(api.put).toHaveBeenCalledWith('/applications/1', payload)
  })
})

describe('deleteApplication', () => {
  it('calls DELETE /applications/:id', async () => {
    api.delete.mockResolvedValue({ data: null })
    await deleteApplication(1)
    expect(api.delete).toHaveBeenCalledWith('/applications/1')
  })
})
