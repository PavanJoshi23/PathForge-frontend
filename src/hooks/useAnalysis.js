import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { runMatch, fetchResults } from '@/services/analysis'

export const ANALYSIS_KEY = 'analysis'

export function useAnalysisResults(applicationId) {
  return useQuery({
    queryKey: [ANALYSIS_KEY, applicationId],
    queryFn: () => fetchResults(applicationId),
    enabled: !!applicationId,
    retry: false,
  })
}

export function useRunMatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: runMatch,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [ANALYSIS_KEY, variables.application_id] })
    },
  })
}
