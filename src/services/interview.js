import api from './api'

export async function generateInterviewPrep({ application_id }) {
  const { data } = await api.post('/interview/generate', { application_id })
  return data
}

export async function fetchInterviewPrep(application_id) {
  const { data } = await api.get(`/interview/${application_id}/prep`)
  return data
}
