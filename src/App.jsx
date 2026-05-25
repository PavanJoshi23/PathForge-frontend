import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppLayout from '@/layouts/AppLayout'
import ApplicationsPage from '@/pages/ApplicationsPage'
import ApplicationDetailPage from '@/pages/ApplicationDetailPage'
import ResumesPage from '@/pages/ResumesPage'
import AnalysisPage from '@/pages/AnalysisPage'
import InterviewPage from '@/pages/InterviewPage'
import DashboardPage from '@/pages/DashboardPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/applications" replace />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />
            <Route path="/resumes" element={<ResumesPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
