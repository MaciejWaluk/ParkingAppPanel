import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_dashboard_layout/profile/_profile_layout/agreements',
)({
  component: () => <div>Hello /profile/agreements!</div>,
})
