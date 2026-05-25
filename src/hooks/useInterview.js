import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { generateInterviewPrep, fetchInterviewPrep } from '@/services/interview'

export const INTERVIEW_KEY = 'interview'

export function useInterviewPrep(applicationId) {
  return useQuery({
    queryKey: [INTERVIEW_KEY, applicationId],
    queryFn: () => fetchInterviewPrep(applicationId),
    enabled: !!applicationId,
    retry: false,
  })
}

export function useGenerateInterviewPrep() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: generateInterviewPrep,
    onSuccess: (_data, variables) => {
      qc.setQueryData([INTERVIEW_KEY, variables.application_id], _data)
    },
  })
}
