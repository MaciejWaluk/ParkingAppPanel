import { Box, BoxProps, HStack, Text } from '@chakra-ui/react'
import React from 'react'

type TagProps = {
  label: string
  size?: 'small' | 'large'
  LeftIcon?: React.ReactNode
} & BoxProps

const styles = {
  small: {
    box: {
      paddingY: '4px',
      paddingX: '8px',
    },
    text: {
      fontSize: '12px',
    },
  },
  large: {
    box: {
      paddingY: '6px',
      paddingX: '14px',
    },
    text: {
      fontSize: '14px',
    },
  },
}

export const Tag = ({ label, size = 'small', LeftIcon, ...props }: TagProps) => {
  return (
    <HStack
      bgColor='content'
      borderRadius='radiusL'
      border='1px solid'
      borderColor='primary'
      {...styles[size].box}
      {...props}
    >
      {LeftIcon}
      <Text {...styles[size].text} color='primary'>
        {label}
      </Text>
    </HStack>
  )
}
