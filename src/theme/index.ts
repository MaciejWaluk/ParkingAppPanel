import { extendTheme } from '@chakra-ui/react'
import { colors } from './colors'
import components from './components'
import { radii } from './radii'
import { theme as baseTheme } from '@saas-ui/react'

export const extendedTheme = extendTheme(baseTheme, {
  colors,
  radii,
  components,
})
