/* globals $ */
import Navigo from 'navigo'
import Static from './static'
import Events from './events'

const router = new Navigo('', true)

let totalBeats = null

function init (ctx) {
  // init stuff
  totalBeats = ctx.totalBeats
  updateGlobalActiveGist(0) // Static.getCurrentBeatNum()
  $(document).keydown(handleKeys)

  router
  .on('/beat/:beatNum', function (params) {
    // console.log('nav-params', params)
    goToBeat(params.beatNum)
  })
  .resolve()
}

function updateGlobalActiveGist (beatNum) {
  // Set classes for active gist
  var $body = $(document.body)

  $('.gist-beat').each(function (gistIndex) {
    if ($body.hasClass('gist-beat-' + gistIndex + '-active')) {
      $body.removeClass('gist-beat-' + gistIndex + '-active')
    }

    if (beatNum === gistIndex) {
      $body.addClass('gist-beat-' + gistIndex + '-active')
    }

    if ($body.hasClass('gist-beat-last-active')) {
      $body.removeClass('gist-beat-last-active')
    }

    if ($('.gist-beat.last').hasClass('active')) {
      $body.addClass('gist-beat-last-active')
    }
  })
}

function goToBeat (beatNum) {
  // console.log('goToBeat:', beatNum)
  // set active class on current beat
  $('.gist-beat').removeClass('active')
  var $beat = $('#gist-beat-' + beatNum)
  $beat.addClass('active')

  // show current beat
  $('.gist-beat').hide()
  $beat.show()

  updateGlobalActiveGist(+beatNum)
  updateProgressBar(+beatNum)
  updateCta(+beatNum)
}

function updateProgressBar (beatNum) {
  for (var i = 0; i < totalBeats; i++) {
    if (i > beatNum) {
      // console.log('opacity 1', i)
      $('#gist-progress #gist-progress-beat-' + (i - 1)).css('opacity', 1)
    } else {
      $('#gist-progress #gist-progress-beat-' + (i - 1)).css('opacity', 0)
    }
  }

  // hide progress-bar on last beat before fin
  if (+beatNum === (totalBeats)) {
    $('#gist-progress').hide()
  } else {
    $('#gist-progress').show()
  }
}

function handleKeys (e) {
  if (!e.key) {
    return
  }

  var $thisBeat = Static.getCurrentBeat()
  var beatNum = $thisBeat.data('origid')

  switch (e.key) {
    case 'ArrowLeft':
      Events.prevBeat(beatNum, $thisBeat)
      break
    case 'ArrowRight':
      Events.nextBeat(beatNum, $thisBeat)
      break
    default: return // exit this handler for other keys
  }
  e.preventDefault() // prevent the default action (scroll / move caret)
}

function updateCta (beatNum) {
  var currentBeat = Static.getCurrentBeat()
  var ctaText = $(currentBeat).data('cta-text')

  if (ctaText) {
    $('#gist-view-story').text(ctaText)
  }
}

function navigateToBeat (beatNum, limit) {
  const _limit = limit || totalBeats
  console.log('nav', beatNum, _limit)
  if (beatNum >= 0 && beatNum <= _limit) {
    router.navigate('/beat/' + beatNum)
  }
}

export default { init, navigateToBeat }
