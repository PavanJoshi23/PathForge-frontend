import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import {
  fetchApplications,
  fetchApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../applications'

vi.mock('axios')

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
    axios.get.mockResolvedValue({ data: { items: [mockApp], total: 1 } })
    const result = await fetchApplications({ search: 'acme', status: 'applied' })
    expect(axios.get).toHaveBeenCalledWith('/applications', {
      params: { search: 'acme', status: 'applied' },
    })
    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(1)
  })
})

describe('fetchApplication', () => {
  it('calls GET /applications/:id', async () => {
    axios.get.mockResolvedValue({ data: mockApp })
    const result = await fetchApplication(1)
    expect(axios.get).toHaveBeenCalledWith('/applications/1')
    expect(result.id).toBe(1)
  })
})

describe('createApplication', () => {
  it('calls POST /applications with payload', async () => {
    const payload = { company_name: 'Acme', job_title: 'Dev' }
    axios.post.mockResolvedValue({ data: { ...mockApp, ...payload } })
    const result = await createApplication(payload)
    expect(axios.post).toHaveBeenCalledWith('/applications', payload)
    expect(result.company_name).toBe('Acme')
  })
})

describe('updateApplication', () => {
  it('calls PUT /applications/:id with payload', async () => {
    const payload = { status: 'interview' }
    axios.put.mockResolvedValue({ data: { ...mockApp, ...payload } })
    await updateApplication(1, payload)
    expect(axios.put).toHaveBeenCalledWith('/applications/1', payload)
  })
})

describe('deleteApplication', () => {
  it('calls DELETE /applications/:id', async () => {
    axios.delete.mockResolvedValue({ data: null })
    await deleteApplication(1)
    expect(axios.delete).toHaveBeenCalledWith('/applications/1')
  })
})
