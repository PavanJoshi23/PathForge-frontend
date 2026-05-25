import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchApplications,
  fetchApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from '@/services/applications'

export const APPLICATIONS_KEY = 'applications'

export function useApplications(params = {}) {
  return useQuery({
    queryKey: [APPLICATIONS_KEY, params],
    queryFn: () => fetchApplications(params),
  })
}

export function useApplication(id) {
  return useQuery({
    queryKey: [APPLICATIONS_KEY, id],
    queryFn: () => fetchApplication(id),
    enabled: !!id,
  })
}

export function useCreateApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => qc.invalidateQueries({ queryKey: [APPLICATIONS_KEY] }),
  })
}

export function useUpdateApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => updateApplication(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [APPLICATIONS_KEY] }),
  })
}

export function useDeleteApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => qc.invalidateQueries({ queryKey: [APPLICATIONS_KEY] }),
  })
}
