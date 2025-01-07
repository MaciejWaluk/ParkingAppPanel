export const getMapFromCoords = (long: number, lat: number) => {
  const zoom = '15.25'

  const baseUrl = 'https://api.mapbox.com/styles/v1'
  const username = 'mapbox'
  const styleId = 'streets-v12'
  const size = `600x300`
  const marker = `pin-s-p+0a61c9(${long},${lat})`
  return `${baseUrl}/${username}/${styleId}/static/${marker}/${long},${lat},${zoom},0,0/${size}?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_KEY}`
}
