import { useState } from 'react'
import { Loader2, RefreshCw, Zap } from 'lucide-react'
import { useInterviewPrep, useGenerateInterviewPrep } from '@/hooks/useInterview'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
}

function TechnicalTopicCard({ topic, priority, why }) {
  const cls = PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium
  return (
    <div className="rounded-lg border p-3 space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">{topic}</span>
        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>
          {priority}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{why}</p>
    </div>
  )
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      {label}
    </button>
  )
}

const TABS = ['Technical Topics', 'Behavioral Questions', 'Coding Topics', 'Study Roadmap']

export default function InterviewPrepPanel({ applicationId, hasJD }) {
  const [activeTab, setActiveTab] = useState('Technical Topics')
  const { data: prep, isLoading } = useInterviewPrep(hasJD ? applicationId : null)
  const generate = useGenerateInterviewPrep()
  const isGenerating = generate.isPending

  const handleGenerate = () => {
    generate.mutate({ application_id: applicationId })
  }

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
        <div className="flex items-center gap-2">
          {prep?.from_cache && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              From cache
            </span>
          )}
        </div>
        <Button
          size="sm"
          onClick={handleGenerate}
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

      {isGenerating && (
        <p className="text-sm text-muted-foreground">
          Generating… this may take up to 2 minutes.
        </p>
      )}

      {!prep && !isGenerating && (
        <p className="text-sm text-muted-foreground">
          {hasJD
            ? 'No prep generated yet. Click "Generate Interview Prep" to start.'
            : 'Add a job description to enable AI interview prep.'}
        </p>
      )}

      {prep && (
        <div className="space-y-3">
          <div className="flex gap-1 flex-wrap">
            {TABS.map((tab) => (
              <TabButton
                key={tab}
                label={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>

          {activeTab === 'Technical Topics' && (
            <div className="space-y-2">
              {prep.technical_topics?.length ? (
                prep.technical_topics.map((t, i) => (
                  <TechnicalTopicCard key={i} {...t} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No topics generated.</p>
              )}
            </div>
          )}

          {activeTab === 'Behavioral Questions' && (
            <ul className="space-y-2">
              {prep.behavioral_questions?.length ? (
                prep.behavioral_questions.map((q, i) => (
                  <li key={i} className="text-sm rounded-lg border p-3">{q}</li>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">None generated.</p>
              )}
            </ul>
          )}

          {activeTab === 'Coding Topics' && (
            <div className="flex flex-wrap gap-2">
              {prep.coding_topics?.length ? (
                prep.coding_topics.map((t, i) => (
                  <span
                    key={i}
                    className="rounded-full border px-3 py-1 text-xs font-medium bg-muted"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">None generated.</p>
              )}
            </div>
          )}

          {activeTab === 'Study Roadmap' && (
            <div className="space-y-3">
              {prep.study_roadmap?.length ? (
                prep.study_roadmap.map((week, i) => (
                  <div key={i} className="rounded-lg border p-3 space-y-1">
                    <p className="text-sm font-medium">Week {week.week}: {week.focus}</p>
                    {week.resources?.length > 0 && (
                      <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                        {week.resources.map((r, j) => <li key={j}>{r}</li>)}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">None generated.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
