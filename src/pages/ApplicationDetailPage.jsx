import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Trash2, Pencil, AlertTriangle } from 'lucide-react'
import { useApplication, useUpdateApplication, useDeleteApplication } from '@/hooks/useApplications'
import { useResume } from '@/hooks/useResumes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import StatusBadge from '@/components/apps/StatusBadge'
import ApplicationForm from '@/components/apps/ApplicationForm'
import AnalysisPanel from '@/components/analysis/AnalysisPanel'
import { APPLICATION_STATUSES } from '@/types/application'

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm">{children ?? <span className="text-muted-foreground">—</span>}</div>
    </div>
  )
}

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: app, isLoading } = useApplication(Number(id))
  const updateMutation = useUpdateApplication()
  const deleteMutation = useDeleteApplication()

  const { data: linkedResume } = useResume(app?.resume_id)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleStatusChange = (status) => {
    updateMutation.mutate({ id: app.id, payload: { status } })
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(app.id)
    navigate('/applications')
  }

  const isPastFollowUp =
    app?.follow_up_date && new Date(app.follow_up_date) < new Date()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!app) return null

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link
          to="/applications"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          aria-label="Back to applications"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold">{app.company_name}</h1>
        <p className="text-lg text-muted-foreground">{app.job_title}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={app.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-48">
              <SelectValue>
                <StatusBadge status={app.status} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {APPLICATION_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <Field label="Applied">
            {app.application_date}
          </Field>
          <Field label="Follow-up Date">
            {app.follow_up_date ? (
              <span className="flex items-center gap-1">
                {app.follow_up_date}
                {isPastFollowUp && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" aria-label="Overdue" />
                )}
              </span>
            ) : null}
          </Field>
          <Field label="Salary">
            {(app.salary_min || app.salary_max) &&
              `${app.salary_min ?? '?'} – ${app.salary_max ?? '?'}`}
          </Field>
          <Field label="Job Link">
            {app.job_link && (
              <a
                href={app.job_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                View posting <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </Field>
          <Field label="Resume">
            {linkedResume ? (
              <Link
                to={`/resumes`}
                className="text-primary hover:underline"
              >
                {linkedResume.name}
              </Link>
            ) : null}
          </Field>
        </CardContent>
      </Card>

      {app.job_description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{app.job_description}</p>
          </CardContent>
        </Card>
      )}

      {app.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{app.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">ATS Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalysisPanel
            applicationId={app.id}
            resumeId={app.resume_id}
            hasJD={!!app.job_description}
          />
        </CardContent>
      </Card>

      <ApplicationForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        application={app}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
            <DialogDescription>
              Remove <strong>{app.company_name} — {app.job_title}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
