/* globals jQuery, StoryGist */

;(function ($, sg) {
  sg.Static = {}

  sg.Static.currentBeatIndex = 0

  sg.Static.getCurrentBeat = function () {
    return $('#gist-beat-' + sg.Static.getCurrentBeatNum())
  }

  sg.Static.getCurrentBeatNum = function () {
    var $el = $('.gist-beat:visible')
    var exists = $el.length
    if (exists) {
      var currentBeat = $('.gist-beat:visible').get(0)
      return $(currentBeat).data('origid')
    }
    return 0
  }

  sg.Static.getRandTransition = function () {
    return sg.Static.TRANSITIONS[Math.floor(Math.random() * sg.Static.TRANSITIONS.length)]
  }

  sg.Static.dependencyChecker = function (deps) {
    deps.forEach(function (dep) {
      var global = window
      var depName = dep
      if (dep.indexOf('$.') === 0) {
        global = window.$
        depName = dep.replace('$.', '')
      }
      if (typeof global[depName] === 'function' || typeof global[depName] === 'object') {
        console.log('### window.' + dep, ' detected')
      } else {
        console.warn('### window.' + dep, ' Not Found')
      }
    })
  }

  sg.Static.getBeatFromTarget = function (target) {
    // console.log(target, 'target -> getBeat')
    var $beat = $(target)
    if (!$beat.hasClass('gist-beat')) {
      $beat = $beat.closest('.gist-beat')
      if (!$beat.hasClass('gist-beat')) {
        return null
      }
    }
    return $beat
  }

  sg.Static.TRANSITIONS = [
    'transition.slideLeftIn',
    'transition.slideDownIn',
    'transition.slideLeftBigIn',
    'transition.shrinkIn',
    'transition.flipXIn',
    'transition.flipYIn',
    'transition.fadeIn',
    'transition.expandIn'
  ]
})(jQuery, StoryGist)
