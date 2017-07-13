/* globals ga */

function sendEvent (eventAction) {
  if (window.ga) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'gist',
      eventAction: eventAction
      // ,eventLabel: 'event label'
    })
  }
}

export default { sendEvent }
