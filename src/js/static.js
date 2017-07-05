/* globals jQuery, StoryGist */

;(function ($, sg) {
  sg.Static = {}

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
})(jQuery, StoryGist)
