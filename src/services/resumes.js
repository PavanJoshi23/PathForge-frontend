import axios from 'axios'

export async function fetchResumes() {
  const { data } = await axios.get('/resumes')
  return data
}

export async function fetchResume(id) {
  const { data } = await axios.get(`/resumes/${id}`)
  return data
}

export async function uploadResume(formData, onUploadProgress) {
  const { data } = await axios.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
  return data
}

export async function deleteResume(id) {
  await axios.delete(`/resumes/${id}`)
}
