import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateApplication, useUpdateApplication } from '@/hooks/useApplications'
import { useResumes } from '@/hooks/useResumes'
import { APPLICATION_STATUSES } from '@/types/application'

const schema = z
  .object({
    company_name: z.string().min(1, 'Company is required').max(255),
    job_title: z.string().min(1, 'Job title is required').max(255),
    job_description: z.string().optional().nullable(),
    job_link: z.string().max(2048).optional().nullable(),
    application_date: z.string().optional().nullable(),
    status: z.enum(['wishlist', 'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn']),
    follow_up_date: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    salary_min: z.coerce.number().min(0).optional().nullable(),
    salary_max: z.coerce.number().min(0).optional().nullable(),
    resume_id: z.coerce.number().optional().nullable(),
  })
  .refine(
    (d) => !d.salary_min || !d.salary_max || d.salary_max >= d.salary_min,
    { message: 'Salary max must be ≥ salary min', path: ['salary_max'] }
  )

export default function ApplicationForm({ open, onClose, application }) {
  const isEdit = !!application
  const create = useCreateApplication()
  const update = useUpdateApplication()
  const { data: resumesData } = useResumes()
  const resumeOptions = resumesData?.items ?? []

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      company_name: '',
      job_title: '',
      status: 'applied',
      job_description: '',
      job_link: '',
      application_date: '',
      follow_up_date: '',
      notes: '',
      salary_min: '',
      salary_max: '',
      resume_id: null,
    },
  })

  useEffect(() => {
    if (open) {
      reset(
        application
          ? {
              ...application,
              application_date: application.application_date ?? '',
              follow_up_date: application.follow_up_date ?? '',
              salary_min: application.salary_min ?? '',
              salary_max: application.salary_max ?? '',
              resume_id: application.resume_id ?? null,
            }
          : {
              company_name: '',
              job_title: '',
              status: 'applied',
              job_description: '',
              job_link: '',
              application_date: '',
              follow_up_date: '',
              notes: '',
              salary_min: '',
              salary_max: '',
              resume_id: null,
            }
      )
    }
  }, [open, application, reset])

  const statusValue = watch('status')
  const resumeIdValue = watch('resume_id')

  const onSubmit = async (data) => {
    const clean = {
      ...data,
      application_date: data.application_date || null,
      follow_up_date: data.follow_up_date || null,
      salary_min: data.salary_min === '' || data.salary_min == null ? null : Number(data.salary_min),
      salary_max: data.salary_max === '' || data.salary_max == null ? null : Number(data.salary_max),
      job_description: data.job_description || null,
      job_link: data.job_link || null,
      notes: data.notes || null,
      resume_id: data.resume_id ? Number(data.resume_id) : null,
    }
    if (isEdit) {
      await update.mutateAsync({ id: application.id, payload: clean })
    } else {
      await create.mutateAsync(clean)
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Application' : 'Add Application'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="company_name">Company *</Label>
              <Input id="company_name" {...register('company_name')} />
              {errors.company_name && (
                <p className="text-xs text-destructive">{errors.company_name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="job_title">Job Title *</Label>
              <Input id="job_title" {...register('job_title')} />
              {errors.job_title && (
                <p className="text-xs text-destructive">{errors.job_title.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={statusValue} onValueChange={(v) => setValue('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPLICATION_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="job_link">Job Link</Label>
              <Input id="job_link" type="url" {...register('job_link')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="application_date">Application Date</Label>
              <Input id="application_date" type="date" {...register('application_date')} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="follow_up_date">Follow-up Date</Label>
              <Input id="follow_up_date" type="date" {...register('follow_up_date')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="salary_min">Salary Min</Label>
              <Input id="salary_min" type="number" min="0" {...register('salary_min')} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="salary_max">Salary Max</Label>
              <Input id="salary_max" type="number" min="0" {...register('salary_max')} />
              {errors.salary_max && (
                <p className="text-xs text-destructive">{errors.salary_max.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="job_description">Job Description</Label>
            <Textarea
              id="job_description"
              rows={6}
              placeholder="Paste the job description here…"
              {...register('job_description')}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={3} {...register('notes')} />
          </div>

          <div className="space-y-1">
            <Label>Resume</Label>
            <Select
              value={resumeIdValue != null ? String(resumeIdValue) : ''}
              onValueChange={(v) => setValue('resume_id', v === '__none__' ? null : Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="No resume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">No resume</SelectItem>
                {resumeOptions.map((r) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.name}
                    {r.version ? ` (${r.version})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
