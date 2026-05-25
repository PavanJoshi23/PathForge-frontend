import { useQuery } from '@tanstack/react-query'
import { fetchDashboardSummary } from '@/services/dashboard'

export const DASHBOARD_KEY = 'dashboard'

export function useDashboardSummary() {
  return useQuery({
    queryKey: [DASHBOARD_KEY],
    queryFn: fetchDashboardSummary,
    staleTime: 30_000,
  })
}
