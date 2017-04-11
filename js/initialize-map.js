import DEFAULT_MAP_OPTIONS from './config/map'

export default () => new google.maps.Map(document.getElementById('map'), DEFAULT_MAP_OPTIONS)
