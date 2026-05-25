import { useState } from 'react'
import { Loader2, RefreshCw, Zap } from 'lucide-react'
import { useAnalysisResults, useRunMatch } from '@/hooks/useAnalysis'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function ScoreGauge({ score }) {
  const color =
    score >= 70 ? 'text-green-600' : score >= 40 ? 'text-yellow-500' : 'text-red-500'
  const ring =
    score >= 70 ? 'border-green-500' : score >= 40 ? 'border-yellow-400' : 'border-red-400'

  return (
    <div
      className={`flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 ${ring}`}
      aria-label={`ATS score: ${score}`}
    >
      <span className={`text-3xl font-bold ${color}`}>{score}</span>
      <span className="text-xs text-muted-foreground">/ 100</span>
    </div>
  )
}

function CategoryBar({ label, value }) {
  const color =
    value >= 70 ? 'bg-green-500' : value >= 40 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function KeywordChips({ keywords, variant }) {
  if (!keywords?.length) return <p className="text-xs text-muted-foreground">None</p>
  const cls =
    variant === 'matched'
      ? 'bg-green-100 text-green-800 border border-green-200'
      : 'bg-red-100 text-red-800 border border-red-200'
  return (
    <div className="flex flex-wrap gap-1.5">
      {keywords.map((kw) => (
        <span key={kw} className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
          {kw}
        </span>
      ))}
    </div>
  )
}

export default function AnalysisPanel({ applicationId, resumeId, hasJD }) {
  const canRun = hasJD && resumeId
  const { data: results, isLoading: loadingResults, error } = useAnalysisResults(
    canRun ? applicationId : null,
  )
  const runMatch = useRunMatch()
  const isRunning = runMatch.isPending

  const handleRun = () => {
    runMatch.mutate({ application_id: applicationId, resume_id: resumeId })
  }

  if (loadingResults) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading results…
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {!hasJD && 'Add a job description to enable analysis.'}
          {hasJD && !resumeId && 'Link a resume to enable analysis.'}
          {canRun && !results && 'No analysis yet. Click "Run Analysis" to start.'}
        </p>
        {canRun && (
          <Button
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Analysing…
              </>
            ) : results ? (
              <>
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Re-run Analysis
              </>
            ) : (
              <>
                <Zap className="mr-1.5 h-4 w-4" />
                Run Analysis
              </>
            )}
          </Button>
        )}
      </div>

      {error && !results && (
        <p className="text-sm text-muted-foreground">
          No results yet — run analysis to see your ATS score.
        </p>
      )}

      {results && (
        <div className="space-y-4">
          {/* Score + breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">ATS Score</CardTitle>
            </CardHeader>
            <CardContent className="flex items-start gap-8">
              <ScoreGauge score={results.match_score} />
              <div className="flex-1 space-y-3">
                <CategoryBar label="Skills Match (40%)" value={results.score_breakdown.skills} />
                <CategoryBar label="Experience Match (30%)" value={results.score_breakdown.experience} />
                <CategoryBar label="Keyword Coverage (20%)" value={results.score_breakdown.keyword_coverage} />
                <CategoryBar label="Education Match (10%)" value={results.score_breakdown.education} />
              </div>
            </CardContent>
          </Card>

          {/* Matched / Missing keywords */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Matched Keywords
                  <Badge variant="secondary" className="ml-2">
                    {results.matching_keywords.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KeywordChips keywords={results.matching_keywords} variant="matched" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Missing Keywords
                  <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700">
                    {results.missing_keywords.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KeywordChips keywords={results.missing_keywords} variant="missing" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
