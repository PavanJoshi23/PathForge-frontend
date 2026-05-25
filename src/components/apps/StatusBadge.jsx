import { Badge } from '@/components/ui/badge'
import { APPLICATION_STATUSES, STATUS_VARIANT } from '@/types/application'

export default function StatusBadge({ status }) {
  const label = APPLICATION_STATUSES.find((s) => s.value === status)?.label ?? status
  return <Badge variant={STATUS_VARIANT[status] ?? 'secondary'}>{label}</Badge>
}
