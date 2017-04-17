import DEFAULT_MAP_OPTIONS from 'config/map'

export const mapInstance = new google.maps.Map(document.getElementById('map'), DEFAULT_MAP_OPTIONS)

export default () => mapInstance
