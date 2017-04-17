const jsdom = require('jsdom').jsdom

global.document = jsdom('')
global.google = { maps: { Map: class Map {}, InfoWindow: class InfoWindow {} } }
global.window = document.defaultView
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: 'node.js',
}
