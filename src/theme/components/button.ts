import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  borderRadius: 'radiusL',
  border: '2px solid',
})

const solid = defineStyle({
  bgColor: 'primary',
  borderColor: 'primary',
  color: 'content',
  _hover: {
    bgColor: 'secondary',
  },
})

const ghost = defineStyle({
  bgColor: 'backgroundSecondary',
  color: 'primary',
  _hover: {
    bgColor: 'primary',
    color: 'content',
  },
})

const danger = defineStyle({
  bgColor: '#FF0000',
  borderColor: '#FF0000',
  color: 'content',
  _hover: {
    bgColor: '#FF3333',
    color: 'content',
  },
})

const small = defineStyle({
  paddingX: '15px',
  paddingY: '8px',
  fontSize: '12px',
  fontWeight: '400',
})

const large = defineStyle({
  paddingX: '20px',
  paddingY: '10px',
  fontSize: '14px',
  fontWeight: '400',
})

export const Button = defineStyleConfig({
  baseStyle,
  variants: { solid, ghost, danger },
  sizes: { small, large },
  defaultProps: { size: 'large', variant: 'solid' },
})
