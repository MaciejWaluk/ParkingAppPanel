import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import supabase from '../../../../../../lib/supabase'
import { Database } from '../../../../../../../database.types'
import { formatDate } from '../../../../../../utils/time'
import Divider from '../../../../../../common/components/Divider'
import { tagsObject, typeMap } from '../../../../../../lib/consts'
import { Tag } from '../../../../../../common/components/Tag'

export const Route = createFileRoute('/_dashboard_layout/profile/_profile_layout/admin/_admin_layout/parkings')({
  component: ParkingsComponent,
})

type ParkingProposalListing = Database['public']['Tables']['parking_proposals']['Row']

function ParkingsComponent() {
  const [parkings, setParkings] = useState<ParkingProposalListing[]>([])
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentParking, setCurrentParking] = useState<ParkingProposalListing>()
  useEffect(() => {
    async function getParkings() {
      const { data, error } = await supabase.from('parking_proposals').select()
      if (data || !error) {
        setParkings(data)
      } else {
        toast({
          status: 'error',
          title: 'Nowe parkingi',
          description: 'Wystąpił błąd przy pobieraniu listy parkingów',
        })
      }
    }
    getParkings()
  }, [toast])

  const handleAccept = async () => {
    if (currentParking) {
      const { error: insertingError } = await supabase.from('parkings').insert(currentParking)
      if (insertingError) {
        toast({
          status: 'error',
          title: 'Akceptacja parkingu',
          description: 'Wystąpił błąd przy akceptacji parkingu',
        })
        return
      }
      const { error: deletingError } = await supabase.from('parking_proposals').delete().eq('id', currentParking.id)
      if (deletingError) {
        toast({
          status: 'error',
          title: 'Akceptacja parkingu',
          description: 'Wystąpił błąd przy akceptacji parkingu',
        })
        return
      }
      const updatedArray = parkings.filter((p) => p.id !== currentParking.id)
      setParkings(updatedArray)
      toast({
        status: 'success',
        title: 'Akceptacja parkingu',
        description: 'Zaakceptowano parking',
        isClosable: true,
      })
      onClose()
    }
  }
  const handleReject = async () => {
    if (currentParking) {
      const { error: deletingError } = await supabase.from('parking_proposals').delete().eq('id', currentParking.id)
      if (deletingError) {
        toast({
          status: 'error',
          title: 'Odrzucenie parkingu',
          description: 'Wystąpił błąd przy odrzucaniu parkingu',
        })
        return
      }
      const updatedArray = parkings.filter((p) => p.id !== currentParking.id)
      setParkings(updatedArray)
      toast({
        status: 'success',
        title: 'Odrzucenie parkingu',
        description: 'Odrzucono parking',
        isClosable: true,
      })
      onClose()
    }
  }

  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Nazwa</Th>
              <Th>Adres</Th>
              <Th>Data zgłoszenia</Th>
              <Th textAlign='right'>Akcje</Th>
            </Tr>
          </Thead>
          <Tbody>
            {parkings.map((parking) => (
              <Tr key={parking.id}>
                <Td>{parking.name}</Td>
                <Td>{parking.address}</Td>
                <Td>{formatDate(new Date(parking.created_at))}</Td>
                <Td>
                  <HStack justifyContent='flex-end'>
                    <Button
                      onClick={() => {
                        setCurrentParking(parking)
                        onOpen()
                      }}
                    >
                      Szczegóły
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minWidth='fit-content' height='fit-content'>
          <ModalHeader fontSize='32px'>Nowy parking</ModalHeader>
          <ModalBody>
            <Divider marginBottom='20px' />
            <HStack gap='40px' alignItems='flex-start'>
              <Box>
                <Image
                  borderRadius='radiusM'
                  src={currentParking?.imageUrl}
                  objectFit='scale-down'
                  alt='Zdjęcie dodawanego parkingu'
                />
              </Box>
              <VStack gap='10px' width='100%' alignItems='stretch'>
                <HStack justifyContent='space-between'>
                  <Text fontSize='14px' fontWeight='700'>
                    Nazwa:
                  </Text>
                  <Text fontSize='14px'>{currentParking?.name}</Text>
                </HStack>
                <HStack justifyContent='space-between'>
                  <Text fontSize='14px' fontWeight='700'>
                    Adres:
                  </Text>
                  <Text fontSize='14px'>{currentParking?.address}</Text>
                </HStack>
                <HStack justifyContent='space-between'>
                  <Text fontSize='14px' fontWeight='700'>
                    Typ:
                  </Text>
                  <Text fontSize='14px'>{typeMap[currentParking?.unitOfTime as keyof typeof typeMap]}</Text>
                </HStack>{' '}
                <HStack justifyContent='space-between'>
                  <Text fontSize='14px' fontWeight='700'>
                    Data zgłoszenia:
                  </Text>
                  <Text fontSize='14px'>{formatDate(new Date(currentParking?.created_at!))}</Text>
                </HStack>
                <Divider marginY='10px' />
                {currentParking?.unitOfTime === 'hourly' && (
                  <HStack justifyContent='space-between'>
                    <Text fontSize='14px' fontWeight='700'>
                      Godziny otwarcia:
                    </Text>
                    <Text fontSize='14px'>{currentParking.openHours}</Text>
                  </HStack>
                )}
                <HStack justifyContent='space-between'>
                  <Text fontSize='14px' fontWeight='700'>
                    {`Cena za ${currentParking?.unitOfTime === 'hourly' ? 'godzinę:' : currentParking?.unitOfTime === 'daily' ? 'dzień:' : 'miesiąc:'}`}
                  </Text>
                  <Text fontSize='14px'>{currentParking?.price} zł</Text>
                </HStack>
                <HStack justifyContent='space-between'>
                  <Text fontSize='14px' fontWeight='700'>
                    Miejsca zwykłe:
                  </Text>
                  <Text fontSize='14px'>{currentParking?.regularSpots} szt.</Text>
                </HStack>
                <HStack justifyContent='space-between'>
                  <Text fontSize='14px' fontWeight='700'>
                    Miejsca powiększone:
                  </Text>
                  <Text fontSize='14px'>{currentParking?.biggerSpots} szt.</Text>
                </HStack>
                <HStack justifyContent='space-between'>
                  <Text fontSize='14px' fontWeight='700'>
                    Miejsca dla osób niepełnosprawnych:
                  </Text>
                  <Text fontSize='14px'>{currentParking?.disabledSpots} szt.</Text>
                </HStack>
                <Divider marginY='10px' />
                <HStack justifyContent='space-between' alignItems='flex-start'>
                  <Text fontSize='14px' fontWeight='700' maxWidth='30%'>
                    Oznaczenia:
                  </Text>
                  <HStack flexWrap='wrap' justifyContent='flex-end' maxWidth='70%' height='auto'>
                    {currentParking &&
                      currentParking.tags &&
                      (currentParking?.tags as string[]).map((tag, index) => (
                        <Tag key={index} label={tagsObject[tag as keyof typeof tagsObject]} />
                      ))}
                  </HStack>
                </HStack>
                <Divider marginY='10px' />
                <HStack justifyContent='space-between' alignItems='flex-start'>
                  <Text fontSize='14px' fontWeight='700' maxWidth='30%'>
                    Przydatne informacje:
                  </Text>
                  <VStack alignItems='flex-end' maxWidth='70%' height='auto'>
                    {currentParking &&
                      currentParking.usefullInfo &&
                      (currentParking?.usefullInfo as string[]).map((info, index) => (
                        <Text as='i' fontSize='14px' key={index}>
                          {info}
                        </Text>
                      ))}
                  </VStack>
                </HStack>
              </VStack>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <HStack gap='10px'>
              <Button variant='ghost' onClick={onClose}>
                Zamknij
              </Button>
              <Button onClick={handleAccept}>Zaakceptuj</Button>
              <Button variant='danger' onClick={handleReject}>
                Odrzuć
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
