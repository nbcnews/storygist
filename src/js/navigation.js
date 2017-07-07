/* globals jQuery, StoryGist, Navigo */
// navigation.js
;(function ($, Navigo, sg) {
  sg.Navigation = {}

  sg.Navigation.router = new Navigo('', true)

  sg.Navigation.navigateToBeat = function (beatNum, limit) {
    var _limit = limit || 99
    if (beatNum >= 0 && beatNum <= _limit) {
      sg.Navigation.router.navigate('/beat/' + beatNum)
    }
  }

  sg.Navigation.goToBeat = function (beatNum) {
    console.log('GOTO:', beatNum)
    /// $('.gist-beat').removeClass('active')
    $('.gist-beat').hide()
    var $beat = $('#gist-beat-' + beatNum)
    $beat.show()

    // update progress bar
    // $beat.css('display', 'none')
    // $('#gist-progress #gist-progress-beat-' + beatNum).css('opacity', 0)
  }

  sg.prototype.initNavigation = function () {
    // init stuff
    sg.Navigation.router
    .on('/beat/:beatNum', function (params) {
      console.log(params)
      sg.Navigation.goToBeat(params.beatNum)
    })
    .resolve()
  }
})(jQuery, Navigo, StoryGist)
