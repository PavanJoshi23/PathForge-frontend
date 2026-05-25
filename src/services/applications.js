import axios from 'axios'

export async function fetchApplications(params = {}) {
  const { data } = await axios.get('/applications', { params })
  return data
}

export async function fetchApplication(id) {
  const { data } = await axios.get(`/applications/${id}`)
  return data
}

export async function createApplication(payload) {
  const { data } = await axios.post('/applications', payload)
  return data
}

export async function updateApplication(id, payload) {
  const { data } = await axios.put(`/applications/${id}`, payload)
  return data
}

export async function deleteApplication(id) {
  await axios.delete(`/applications/${id}`)
}
