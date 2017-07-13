/* globals $ */
const debug = require('debug')('static')

function getCurrentBeat () {
  return $('#gist-beat-' + getCurrentBeatNum())
}

function getCurrentBeatNum () {
  var $el = $('.gist-beat:visible')
  var exists = $el.length
  if (exists) {
    var currentBeat = $('.gist-beat:visible').get(0)
    return $(currentBeat).data('origid')
  }
  return 0
}

function getRandTransition () {
  return TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)]
}

function dependencyChecker (deps) {
  deps.forEach(function (dep) {
    var global = window
    var depName = dep
    if (dep.indexOf('$.') === 0) {
      global = window.$
      depName = dep.replace('$.', '')
    }
    if (typeof global[depName] === 'function' || typeof global[depName] === 'object') {
      debug(`### window.${dep} detected`)
    } else {
      debug(`### window.${dep} Not Found`)
    }
  })
}

function getBeatFromTarget (target) {
  debug(target, 'target -> getBeat')
  var $beat = $(target)
  if (!$beat.hasClass('gist-beat')) {
    $beat = $beat.closest('.gist-beat')
    if (!$beat.hasClass('gist-beat')) {
      return null
    }
  }
  return $beat
}

if (!String.prototype.includes) {
  // eslint-disable-next-line no-extend-native
  String.prototype.includes = function (search, start) {
    'use strict'
    if (typeof start !== 'number') {
      start = 0
    }

    if (start + search.length > this.length) {
      return false
    } else {
      return this.indexOf(search, start) !== -1
    }
  }
}

const TRANSITIONS = [
  'transition.slideLeftIn',
  'transition.slideDownIn',
  'transition.slideLeftBigIn',
  'transition.shrinkIn',
  'transition.flipXIn',
  'transition.flipYIn',
  'transition.fadeIn',
  'transition.expandIn'
]

export default {
  TRANSITIONS,
  getBeatFromTarget,
  getRandTransition,
  getCurrentBeat,
  getCurrentBeatNum,
  dependencyChecker
}
