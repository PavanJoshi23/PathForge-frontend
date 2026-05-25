/**
 * @typedef {'wishlist'|'applied'|'screening'|'interview'|'offer'|'rejected'|'withdrawn'} ApplicationStatus
 */

/**
 * @typedef {Object} Application
 * @property {number} id
 * @property {string} company_name
 * @property {string} job_title
 * @property {string|null} job_description
 * @property {string|null} job_link
 * @property {string|null} application_date
 * @property {ApplicationStatus} status
 * @property {string|null} follow_up_date
 * @property {string|null} notes
 * @property {number|null} salary_min
 * @property {number|null} salary_max
 * @property {number|null} resume_id
 * @property {string} created_at
 * @property {string} updated_at
 */

export const APPLICATION_STATUSES = [
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'applied', label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
]

export const STATUS_VARIANT = {
  wishlist: 'secondary',
  applied: 'info',
  screening: 'info',
  interview: 'warning',
  offer: 'success',
  rejected: 'destructive',
  withdrawn: 'secondary',
}
