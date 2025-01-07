import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard_layout/profile/_profile_layout/admin/')({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: `${location.pathname}/users`,
    })
  },
})
