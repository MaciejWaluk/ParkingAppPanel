import { unitOfTime } from '../lib/types'

export const adjustTimeZone = (dateString: string) => {
  const date = new Date(dateString)
  date.setHours(date.getHours() + 1)
  return date.toISOString()
}

export const getTimeBetweenDates = (startDate: string, endDate: string, unitOfTime: unitOfTime) => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  switch (unitOfTime) {
    case 'hourly':
      return end.getTime() - start.getTime()
    case 'daily':
      return end.getDate() - start.getDate()
    case 'monthly':
      return end.getMonth() - start.getMonth()
  }
}

export const getReservationTime = (date: Date, unitOfTime: unitOfTime) => {
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const days = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const months = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth()
  const stringDate = `${days}.${months}.${date.getFullYear()}`
  return unitOfTime === 'hourly' ? stringDate + `, ${hours}:${minutes}` : stringDate
}

export const calculateMilisecondsDifference = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return end.getTime() - start.getTime()
}

export const isAbleToCancel = (startDate: string, unitOfTime: unitOfTime) => {
  const start = new Date(startDate)
  const now = new Date()
  const timeDifference = start.getTime() - now.getTime()
  const hoursDifference = timeDifference / 1000 / 60 / 60
  switch (unitOfTime) {
    case 'hourly':
      return hoursDifference >= 24
    case 'daily':
      return hoursDifference >= 72
    case 'monthly':
      return hoursDifference >= 24 * 7
  }
}

export const totalCost = (startDate: string, endDate: string, unitOfTime: unitOfTime, price: number) => {
  const hoursDifference = calculateMilisecondsDifference(startDate, endDate) / 1000 / 60 / 60
  switch (unitOfTime) {
    case 'hourly':
      return Math.round(hoursDifference) * price
    case 'daily':
      return Math.round(hoursDifference / 24) * price
    case 'monthly':
      return Math.round(hoursDifference / 24 / 30) * price
  }
}

const months = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
]

export const formatDate = (date: Date) => {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}
