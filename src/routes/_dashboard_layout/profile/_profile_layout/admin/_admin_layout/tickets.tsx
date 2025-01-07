import { createFileRoute } from '@tanstack/react-router'
import {
  Button,
  Checkbox,
  HStack,
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
import { useEffect, useState } from 'react'
import supabase from '../../../../../../lib/supabase'
import { Database } from '../../../../../../../database.types'
import { formatDate } from '../../../../../../utils/time'
import Divider from '../../../../../../common/components/Divider'

export const Route = createFileRoute('/_dashboard_layout/profile/_profile_layout/admin/_admin_layout/tickets')({
  component: TicketsComponent,
})

type TicketsListing = Database['public']['Tables']['tickets']['Row'] & {
  user_info: Database['public']['Tables']['profiles']['Row']
}

const apiURL = import.meta.env.VITE_EXPRESSJS_API_URL

function TicketsComponent() {
  const [tickets, setTickets] = useState<TicketsListing[]>([])
  const [shouldRefetch, setShouldRefetch] = useState(true)
  const [onlyUnresolved, setOnlyUnresolved] = useState(true)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentTicket, setCurrentTicket] = useState<TicketsListing>()
  const [currentResponseToTicket, setCurrentResponseToTicket] = useState('')
  useEffect(() => {
    async function getTickets() {
      if (shouldRefetch) {
        const { data, error } = await supabase.rpc('get_tickets_with_user')
        if (data || !error) {
          const tickets: TicketsListing[] = data.map((ticket) => ({
            ...ticket,
            user_info: ticket.user_info as Database['public']['Tables']['profiles']['Row'],
          }))
          setTickets(tickets)
        } else {
          toast({
            status: 'error',
            title: 'Lista zgłoszeń',
            description: 'Wystąpił błąd przy pobieraniu zgłoszeń',
          })
        }
        setShouldRefetch(false)
      }
    }
    getTickets()
  }, [shouldRefetch, toast])

  const handleSend = async () => {
    if (currentResponseToTicket === '') {
      return
    } else {
      const { data } = await supabase.auth.admin.getUserById(currentTicket?.userId as string)
      // const { data: functionResponse, error: functionError } = await supabase.functions.invoke('resend', {
      //   body: {
      //     to: data.user?.email,
      //     subject: `RE: ${currentTicket?.user_info.name} - ${currentTicket?.title}`,
      //     html: `<p>${currentResponseToTicket}</p>`,
      //   },
      // })

      fetch(`${apiURL}/send_email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.user?.email,
          subject: `RE: ${currentTicket?.user_info.name} - ${currentTicket?.title}`,
          html: `<p>${currentResponseToTicket}</p>`,
        }),
      }).catch((e) => console.log(e))
      const { error: updateError } = await supabase
        .from('tickets')
        .update({
          isResolved: true,
        })
        .eq('id', currentTicket?.id!)
      setShouldRefetch(true)
      if (updateError) {
        console.log(updateError)
      }
      onClose()
    }
  }
  return (
    <VStack width='100%'>
      <label style={{ alignSelf: 'flex-end' }}>
        <input
          type='checkbox'
          onChange={(e) => {
            setOnlyUnresolved(e.target.checked)
          }}
          defaultChecked={true}
          style={{ marginRight: '10px' }}
        />
        Pokaż tylko nierozwiązane
      </label>
      <TableContainer width='100%'>
        <Table>
          <Thead>
            <Tr>
              <Th>Użytkownik</Th>
              <Th>Typ zgłoszenia</Th>
              <Th>Data zgłoszenia</Th>
              <Th>Tytuł</Th>
              <Th textAlign='right'>Akcje</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tickets
              .filter((ticket) => {
                if (onlyUnresolved) {
                  return !ticket.isResolved
                } else {
                  return true
                }
              })
              .map((ticket) => (
                <Tr key={ticket.id}>
                  <Td>{ticket.user_info.name}</Td>
                  <Td>{ticket.type}</Td>
                  <Td>{formatDate(new Date(ticket.created_at))}</Td>
                  <Td>{ticket.title}</Td>
                  <Td>
                    <HStack justifyContent='flex-end'>
                      <Button
                        onClick={() => {
                          setCurrentTicket(ticket)
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
        <ModalContent>
          <ModalHeader>Zgłoszenie</ModalHeader>
          <ModalBody>
            <VStack gap='10px' width='100%' alignItems='stretch'>
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Nazwa użytkownika
                </Text>
                <Text fontSize='14px'>{currentTicket?.user_info.login}</Text>
              </HStack>
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Typ zgłoszenia
                </Text>
                <Text fontSize='14px'>{currentTicket?.type}</Text>
              </HStack>{' '}
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Status:
                </Text>
                <Text fontSize='14px'>{currentTicket?.isResolved ? 'Rozwiązane' : 'Nierozwiązane'}</Text>
              </HStack>
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Tytuł:
                </Text>
                <Text fontSize='14px'>{currentTicket?.title}</Text>
              </HStack>
              <Divider marginY='10px' />
              <VStack alignSelf='flex-start' alignItems='flex-start'>
                <Text fontSize='14px' fontWeight='700'>
                  Treść zgłoszenia
                </Text>
                <Text fontSize='14px'>{currentTicket?.description}</Text>
              </VStack>
              <Divider marginY={'10px'} />
              <Textarea
                placeholder={'Odpowiedź'}
                isDisabled={currentTicket?.isResolved}
                value={currentResponseToTicket}
                onChange={(e) => setCurrentResponseToTicket(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack gap='10px'>
              <Button variant='ghost' onClick={onClose}>
                Zamknij
              </Button>
              {!currentTicket?.isResolved && <Button onClick={handleSend}>Odpowiedz</Button>}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}
