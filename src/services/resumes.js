import api from './api'

export async function fetchResumes() {
  const { data } = await api.get('/resumes')
  return data
}

export async function fetchResume(id) {
  const { data } = await api.get(`/resumes/${id}`)
  return data
}

export async function uploadResume(formData, onUploadProgress) {
  const { data } = await api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
  return data
}

export async function deleteResume(id) {
  await api.delete(`/resumes/${id}`)
}
