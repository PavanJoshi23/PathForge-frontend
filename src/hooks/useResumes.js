import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchResumes, fetchResume, uploadResume, deleteResume } from '@/services/resumes'

export const RESUMES_KEY = 'resumes'

export function useResumes() {
  return useQuery({
    queryKey: [RESUMES_KEY],
    queryFn: fetchResumes,
  })
}

export function useResume(id) {
  return useQuery({
    queryKey: [RESUMES_KEY, id],
    queryFn: () => fetchResume(id),
    enabled: !!id,
  })
}

export function useUploadResume() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ formData, onUploadProgress }) =>
      uploadResume(formData, onUploadProgress),
    onSuccess: () => qc.invalidateQueries({ queryKey: [RESUMES_KEY] }),
  })
}

export function useDeleteResume() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteResume,
    onSuccess: () => qc.invalidateQueries({ queryKey: [RESUMES_KEY] }),
  })
}
