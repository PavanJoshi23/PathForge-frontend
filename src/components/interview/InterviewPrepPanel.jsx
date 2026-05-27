import { useState } from 'react'
import { Loader2, RefreshCw, Zap } from 'lucide-react'
import { useInterviewPrep, useGenerateInterviewPrep } from '@/hooks/useInterview'
import { Button } from '@/components/ui/button'

export default function InterviewPrepPanel({ applicationId, hasJD }) {
  const { data: prep, isLoading } = useInterviewPrep(hasJD ? applicationId : null)
  const generate = useGenerateInterviewPrep()
  const isGenerating = generate.isPending
  const generateError = generate.error

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading…
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {prep?.from_cache && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            From cache
          </span>
        )}
        <div className="ml-auto">
          <Button
            size="sm"
            onClick={() => generate.mutate({ application_id: applicationId })}
            disabled={isGenerating || !hasJD}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : prep ? (
              <>
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Regenerate
              </>
            ) : (
              <>
                <Zap className="mr-1.5 h-4 w-4" />
                Generate Interview Prep
              </>
            )}
          </Button>
        </div>
      </div>

      {isGenerating && (
        <p className="text-sm text-muted-foreground">Generating… this may take a minute.</p>
      )}

      {generateError && !isGenerating && (
        <p className="text-sm text-destructive">
          {generateError.response?.data?.detail ?? 'Generation failed. Is the AI service running?'}
        </p>
      )}

      {!prep && !isGenerating && (
        <p className="text-sm text-muted-foreground">
          {hasJD
            ? 'No prep generated yet. Click "Generate Interview Prep" to start.'
            : 'Add a job description to enable AI interview prep.'}
        </p>
      )}

      {prep?.topics?.length > 0 && (
        <ul className="space-y-2">
          {prep.topics.map((topic, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              {topic}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
