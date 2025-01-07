import { Box, BoxProps } from '@chakra-ui/react'
import React from 'react'

const Divider = (props: BoxProps) => {
  return <Box {...props} border='1px solid' borderColor='border'></Box>
}

export default Divider
