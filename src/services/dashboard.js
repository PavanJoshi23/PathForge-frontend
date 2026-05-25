import axios from 'axios'

export async function fetchDashboardSummary() {
  const { data } = await axios.get('/dashboard/summary')
  return data
}
