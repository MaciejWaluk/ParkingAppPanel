import { SaasProvider } from '@saas-ui/react'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { routeTree } from './routeTree.gen'
import { extendedTheme } from './theme'
import { Link } from './common/components/Link'
import { authenticationContent } from './utils/authentication'
import 'filepond/dist/filepond.min.css'

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

import { registerPlugin } from 'filepond'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: { authentication: undefined! },
  defaultPreload: 'intent',
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  const authentication = authenticationContent()

  root.render(
    <React.StrictMode>
      <SaasProvider
        linkComponent={Link}
        theme={extendedTheme}
        toastOptions={{ defaultOptions: { position: 'top-right' } }}
      >
        <RouterProvider router={router} context={{ authentication }} />
      </SaasProvider>
    </React.StrictMode>,
  )
}
