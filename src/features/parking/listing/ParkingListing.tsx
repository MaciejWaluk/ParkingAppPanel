import { Box, Collapse, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import {
  useParkingComparison,
  useParkingDetailsStore,
  useParkingListingStore,
  useParkingReservationStore,
} from '../../../state/store'
import { ParkingDetails } from './ParkingDetails'
import { ParkingReservation } from './ParkingReservation'
import { ParkingSearchForm } from './ParkingSearchForm'
import { ParkingList } from './ParkingList'
import { unitOfTimesArray } from '../../../lib/consts'
import { unitOfTime } from '../../../lib/types'

type ParkingListingProps = {
  setCurrentTab: React.Dispatch<React.SetStateAction<unitOfTime>>
}

export const ParkingListing = ({ setCurrentTab }: ParkingListingProps) => {
  const parkingDetailsSelected = useParkingDetailsStore((state) => state.parking)
  const parkingReservationSelected = useParkingReservationStore((state) => state.parking)
  const parkings = useParkingListingStore((state) => state.parkings)
  const setComparedParkings = useParkingComparison((state) => state.setComparedParkings)
  const isComparisonEnabled = useParkingComparison((state) => state.isComparisonEnabled)
  const comparedParkings = useParkingComparison((state) => state.comparedParkings)

  const handleTabChange = async (unitOfTime: unitOfTime) => {
    setCurrentTab(unitOfTime)
  }

  return (
    <Box height='100%'>
      {parkingDetailsSelected && <ParkingDetails zIndex={2} data={parkingDetailsSelected} height='100%' />}
      {parkingReservationSelected && <ParkingReservation zIndex={3} data={parkingReservationSelected} height='100%' />}
      <Tabs
        onChange={(index) => {
          handleTabChange(unitOfTimesArray[index])
          setComparedParkings([])
        }}
        width='100%'
        height='100%'
        display={parkingDetailsSelected || parkingReservationSelected ? 'none' : 'block'}
      >
        <TabList justifyContent='space-between' height='5%'>
          <Tab>Godziny</Tab>
          <Tab>Dni</Tab>
          <Tab>Miesiące</Tab>
        </TabList>
        <TabPanels height='95%'>
          <TabPanel height='100%' overflowY='scroll'>
            <VStack alignItems='stretch' gap='30px'>
              <Collapse in={!isComparisonEnabled} animateOpacity>
                <ParkingSearchForm unitOfTime='hourly' />
              </Collapse>
              <ParkingList
                data={
                  isComparisonEnabled ? comparedParkings : parkings.filter((parking) => parking.unitOfTime === 'hourly')
                }
              />
            </VStack>
          </TabPanel>
          <TabPanel height='100%' overflowY='scroll'>
            <VStack alignItems='stretch' gap='30px'>
              <Collapse in={!isComparisonEnabled} animateOpacity>
                <ParkingSearchForm unitOfTime='daily' />
              </Collapse>
              <ParkingList
                data={
                  isComparisonEnabled ? comparedParkings : parkings.filter((parking) => parking.unitOfTime === 'daily')
                }
              />
            </VStack>
          </TabPanel>
          <TabPanel height='100%' overflowY='scroll'>
            <VStack alignItems='stretch' gap='30px'>
              <Collapse in={!isComparisonEnabled} animateOpacity>
                <ParkingSearchForm unitOfTime='monthly' />
              </Collapse>
              <ParkingList
                data={
                  isComparisonEnabled
                    ? comparedParkings
                    : parkings.filter((parking) => parking.unitOfTime === 'monthly')
                }
              />
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      {/*)}*/}
    </Box>
  )
}
