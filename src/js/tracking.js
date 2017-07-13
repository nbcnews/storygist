/* globals ga */

function sendEvent (eventAction) {
  ga('send', {
    hitType: 'event',
    eventCategory: 'gist',
    eventAction: eventAction
    // ,eventLabel: 'event label'
  })
}

export default { sendEvent }
