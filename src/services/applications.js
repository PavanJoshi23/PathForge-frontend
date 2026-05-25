import api from './api'

export async function fetchApplications(params = {}) {
  const { data } = await api.get('/applications', { params })
  return data
}

export async function fetchApplication(id) {
  const { data } = await api.get(`/applications/${id}`)
  return data
}

export async function createApplication(payload) {
  const { data } = await api.post('/applications', payload)
  return data
}

export async function updateApplication(id, payload) {
  const { data } = await api.put(`/applications/${id}`, payload)
  return data
}

export async function deleteApplication(id) {
  await api.delete(`/applications/${id}`)
}
