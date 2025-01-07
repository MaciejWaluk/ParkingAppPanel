import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_dashboard_layout/profile/_profile_layout/notifications',
)({
  component: () => <div>Hello /profile/notifications!</div>,
})
