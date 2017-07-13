/* globals ga */
const debug = require('debug')('tracking')

function sendEvent (eventAction, label) {
  const trackingObj = {
    hitType: 'event',
    eventCategory: 'gist',
    eventAction: eventAction,
    eventLabel: label
  }

  debug(trackingObj)

  if (window.ga) {
    ga('send', trackingObj)
  }
}

export default { sendEvent }
