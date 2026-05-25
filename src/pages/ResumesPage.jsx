import { useRef, useState } from 'react'
import { FileText, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useResumes, useUploadResume, useDeleteResume } from '@/hooks/useResumes'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ResumesPage() {
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadName, setUploadName] = useState('')
  const [uploadVersion, setUploadVersion] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading } = useResumes()
  const uploadMutation = useUploadResume()
  const deleteMutation = useDeleteResume()

  const resumes = data?.items ?? []

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setUploadName(file.name.replace(/\.[^.]+$/, ''))
    setUploadProgress(0)
  }

  async function handleUpload() {
    if (!selectedFile) return
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('name', uploadName || selectedFile.name)
    if (uploadVersion) formData.append('version', uploadVersion)

    try {
      await uploadMutation.mutateAsync({
        formData,
        onUploadProgress: (e) => {
          if (e.total) setUploadProgress(Math.round((e.loaded * 100) / e.total))
        },
      })
      setSelectedFile(null)
      setUploadName('')
      setUploadVersion('')
      setUploadProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      // error shown via mutation state
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Resumes</h1>

      {/* Upload panel */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            {selectedFile ? (
              <p className="text-sm font-medium">
                {selectedFile.name}{' '}
                <span className="text-muted-foreground">({formatSize(selectedFile.size)})</span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click to select a PDF or DOCX resume
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && (
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <input
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="Resume display name"
                />
              </div>
              <div className="w-24 space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Version</label>
                <input
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={uploadVersion}
                  onChange={(e) => setUploadVersion(e.target.value)}
                  placeholder="v1"
                />
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="shrink-0"
              >
                {uploadMutation.isPending
                  ? `Uploading… ${uploadProgress}%`
                  : 'Upload'}
              </Button>
            </div>
          )}

          {uploadMutation.isError && (
            <p className="text-sm text-destructive">
              Upload failed:{' '}
              {uploadMutation.error?.response?.data?.detail ?? 'Unknown error'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Resume list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No resumes yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a PDF or DOCX file to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map((resume) => (
            <Card key={resume.id}>
              <CardContent className="pt-4 pb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{resume.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {resume.original_filename} · {formatDate(resume.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {resume.version && (
                    <Badge variant="secondary">{resume.version}</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete"
                    onClick={() => setDeleteTarget(resume)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              Delete &quot;{deleteTarget?.name}&quot;? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
