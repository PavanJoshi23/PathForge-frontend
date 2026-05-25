import api from './api'

export async function runMatch({ application_id, resume_id }) {
  const { data } = await api.post('/analysis/match', { application_id, resume_id })
  return data
}

export async function fetchResults(application_id) {
  const { data } = await api.get(`/analysis/${application_id}/results`)
  return data
}

export async function extractSkills(text) {
  const { data } = await api.post('/analysis/extract-skills', { text })
  return data
}

export async function improveResume({ resume_id, application_id, bullet_text }) {
  const { data } = await api.post('/analysis/improve-resume', {
    resume_id,
    application_id,
    bullet_text,
  })
  return data
}
