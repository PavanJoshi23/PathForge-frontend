import { useState } from 'react'
import { Loader2, Wand2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { improveResume } from '@/services/analysis'
import { Button } from '@/components/ui/button'

export default function ResumeImprovementPanel({ resumeId, applicationId }) {
  const [bullet, setBullet] = useState('')
  const [suggestion, setSuggestion] = useState(null)

  const improve = useMutation({
    mutationFn: improveResume,
    onSuccess: (data) => setSuggestion(data),
  })

  const handleImprove = () => {
    improve.mutate({
      resume_id: resumeId,
      application_id: applicationId,
      bullet_text: bullet,
    })
  }

  const handleSkip = () => {
    setSuggestion(null)
  }

  const handleApply = () => {
    if (suggestion?.suggestion) {
      navigator.clipboard?.writeText(suggestion.suggestion)
    }
    setSuggestion(null)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Paste a resume bullet to improve
        </label>
        <textarea
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          rows={3}
          value={bullet}
          onChange={(e) => setBullet(e.target.value)}
          placeholder="e.g. Built REST APIs using Python and Flask…"
        />
      </div>

      {!suggestion && (
        <Button
          size="sm"
          onClick={handleImprove}
          disabled={!bullet.trim() || improve.isPending}
        >
          {improve.isPending ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              Improving…
            </>
          ) : (
            <>
              <Wand2 className="mr-1.5 h-4 w-4" />
              Improve Wording
            </>
          )}
        </Button>
      )}

      {improve.isError && (
        <p className="text-sm text-destructive">
          {improve.error?.response?.data?.detail ?? 'AI service unavailable. Try again later.'}
        </p>
      )}

      {suggestion && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Original</p>
              <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed">
                {suggestion.original}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Suggested</p>
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm leading-relaxed">
                {suggestion.suggestion}
              </div>
            </div>
          </div>

          {suggestion.changes?.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Changes</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                {suggestion.changes.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
            <Button size="sm" variant="outline" onClick={handleSkip}>
              Skip
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
