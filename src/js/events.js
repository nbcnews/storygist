/* globals SplitType, $ */
import Static from './static'
import Navigation from './navigation'
import Modal from './browserModal'
import Tracking from './tracking'

const debug = require('debug')('events')

let settings = null
let element = null
let totalBeats = null

function init (ctx) {
  totalBeats = ctx.totalBeats
  element = ctx.element
  settings = ctx.settings
  debug('element:', element)
}

function beatVideoPlay (videoEl) {
  if (videoEl) {
    videoEl.play()

    Tracking.sendEvent('videoStart')
  }
}

function beatVideoPause (videoEl) {
  if (videoEl) {
    videoEl.pause()
    Tracking.sendEvent('videoPause')
  }
}

function beatVideoPauseAll (videoEl) {
  $('video').each(function (idx, el) {
    beatVideoPause(el)
  })
}

function goToBeginning () {
  // Set all beats to visible (aka go to beginning)
  $('.gist-beat').css('display', 'flex')

  Tracking.sendEvent('goToBeginning')
}

function pauseBeats () {
  beatVideoPauseAll()
}

function nextBeat (beatNum, el) {
  // Handle behavior to move to next beat
  // A click on the right side of the window
  debug('>> Next', beatNum)

  Tracking.sendEvent('nextBeat', beatNum)
  pauseBeats()

  if ($(el).hasClass('last')) {
    // Do nothing for the final beat
  } else {
    var $nextEl = $(el).next('.gist-beat')
    var baseAnimSpeed = 750
    var blurPx = 81

    if (window.SplitType && $nextEl.find('.js-text-block').length && settings.animate) {
      debug('Animate Textblock')
      var splitTextBlock = new SplitType('.js-text-block')
      splitTextBlock.split({
        split: 'lines',
        position: 'relative'
      })

      $.Velocity(splitTextBlock.lines, Static.TRANSITIONS[3], {duration: baseAnimSpeed * 0.6, stagger: baseAnimSpeed * 0.05})
    }

    if (settings.animate) {
      $nextEl.find('figure img')
      // .css('margin-bottom', -800)
      .velocity({
        'blur': 0
        // 'margin-bottom': 0,
      },
        { 'duration': baseAnimSpeed,
          'begin': function (el) {
            $nextEl.find('figure figcaption').css('opacity', 0)
            $(el).css('-webkit-filter', 'blur(' + blurPx + 'px)')
          },
          'complete': function (el) {
            $nextEl.find('figure figcaption')
            .velocity('transition.slideLeftIn', {'duration': baseAnimSpeed * 1.75})
          }
        })

      $nextEl.find('figure.media')
      .velocity({ 'blur': 0 },
        { 'duration': baseAnimSpeed,
          'begin': function (el) {
            $(el).css('-webkit-filter', 'blur(' + blurPx + 'px)')
          }
        })

      if (window.SplitType && $nextEl.find('.pullquote').length) {
        // debug('Animate PULLQUOTE')
        var splitPullQuote = new SplitType($nextEl.find('.pullquote'), {
          split: 'lines'
        })

        $.Velocity(splitPullQuote.lines, Static.getRandTransition(), {'duration': baseAnimSpeed, 'stagger': baseAnimSpeed / 2})
      }
    }

    var $videoElNext = $nextEl.find('video').get(0)
    beatVideoPlay($videoElNext)
  }

  Navigation.navigateToBeat(+beatNum + 1, +totalBeats)
}

function prevBeat (beatNum, el) {
  Tracking.sendEvent('prevBeat', beatNum)

  debug('>> Prev', beatNum)
  pauseBeats()
  // Handle behavior to move to previous beat
  if ($(el).is('#gist-beat-0')) {
    // Do nothing for the first beat
  } else {
    var $videoEl = $(el).prev('.gist-beat').find('video').get(0)
    beatVideoPlay($videoEl)
  }

  Navigation.navigateToBeat(+beatNum - 1)
}

function viewInStory () {
  Tracking.sendEvent('ctaClicked')
  // Get the current gist beat (the first that's visible)
  var currentBeat = Static.getCurrentBeat()
  var currentBeatNum = $(currentBeat).data('origid')
  var ctaURL = $(currentBeat).data('cta-url')
  debug('viewInStory(), ctaURL:', ctaURL, this)
  // pause any videos, animations, etc
  pauseBeats()

  if (ctaURL) {
    debug('Do browser CTA thing:', currentBeatNum, ctaURL)
    if ($(window).width() >= 1200) {
      // On desktop follow link, don't open modal
      // Also check if it's amp, if so, don't use the amp URL on desktop
      var ampString = '/amp/'
      if (ctaURL.includes(ampString)) {
        // Hack the URL to show the non-amp version
        // by supplying a category that doesn't exist but isn't /amp/
        ctaURL = ctaURL.replace(ampString, '/gist/')
      }
      window.open(ctaURL, '_self')
      Tracking.sendEvent('ctaClicked-windowopen')
    } else {
      Modal.launchModal(ctaURL, currentBeatNum)
      Tracking.sendEvent('ctaClicked-modalactivated')
    }
  } else {
    // Hide the storygist
    // $('#gist-body').css('display', 'none')
    // $(element).toggleClass('gist-active')

    // Show all the original story elements
    // $(settings.contentParent).css('display', 'block')
    // $('.site-header').css('display', 'block')
    // $('.progress').css('display', 'block')
    //
    // // // Find the original element that corresponds with the current beat
    // var scrollToEl = $(`${settings.contentParent} ${settings.beatSelector}:eq(${currentBeatNum})`)
    // debug('scrollToEl:', scrollToEl)
    // // // Scroll to that element
    // $('html, body').animate({
    //   scrollTop: (scrollToEl.offset().top - 80)
    // }, 2000)
  }
}

function swipeBeat (e) {
  var $thisBeat = Static.getCurrentBeat()
  var beatNum = $thisBeat.attr('id').split('-')[2]
  switch (e.direction) {
    case 8: // DIRECTION_UP
      viewInStory()
      Tracking.sendEvent('beatSwiped-up')
      break
    case 2: // DIRECTION_LEFT
      nextBeat(beatNum, $thisBeat)
      Tracking.sendEvent('beatSwiped-left')
      break
    case 4: // DIRECTION_RIGHT
      prevBeat(beatNum, $thisBeat)
      Tracking.sendEvent('beatSwiped-right')
      break
    default:
      debug(e.type, e.direction)
  }
}

function clickBeat (e) {
  Tracking.sendEvent('beatClicked')
  // Get this beat's number from it's ID
  var $thisBeat = Static.getCurrentBeat()
  var beatNum = $thisBeat.data('origid')

  // Get pagewidth and mouse position
  // Which we use to determine whether to go prev/next
  // var pageWidth = $(window).width()
  var pageWidth = $thisBeat.width()
  var posX = $thisBeat.position().left
  var clickX = e.pageX - posX

  // debug('click target el', $(e.target)[0].tagName)

  var targetTag = $(e.target)[0].tagName
  if (!targetTag.match('INPUT|BUTTON|A')) {
    // If it's the last beat
    if (clickX > (pageWidth / 2.5)) {
      // A click on the right side of the window
      nextBeat(beatNum, $thisBeat)
    } else {
      prevBeat(beatNum, $thisBeat)
    };
  }
}

function scrollLock (e) {
  e.preventDefault()
}

function onOrientationChange () {
  var angle = window.orientation
  if (window.screen && window.screen.orientation) {
    angle = window.screen.orientation.angle
  }

  var orientation = Math.abs(angle) === 90 ? 'landscape' : 'portrait'
  if (Math.abs(angle) === 270) { // secondary landscape
    orientation = 'landscape'
  }
  var $orientationSelector = $('body')

  if (orientation === 'portrait') {
    $orientationSelector.addClass('gist-portrait').removeClass('gist-landscape')
  }

  if (orientation === 'landscape') {
    Tracking.sendEvent('landscape-orientation')
    $orientationSelector.addClass('gist-landscape').removeClass('gist-portrait')
  }
}

// TODO: reduce amount of exported functions
export default {
  init,
  onOrientationChange,
  scrollLock,
  viewInStory,
  swipeBeat,
  prevBeat,
  nextBeat,
  goToBeginning,
  clickBeat
}
