import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import React from 'react'

type NoParkingsFoundModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const NoParkingsFoundModal = ({ isOpen, onClose }: NoParkingsFoundModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Brak parkingów</ModalHeader>
        <ModalBody>
          <Text fontSize='14px'>
            Brak dostępnych parkingów w danym terminie w podanej odległości. Powiększ maksymalną odległość lub zmień
            miejsce docelowe
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>OK</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
