/* globals jQuery, StoryGist, Navigo */
// navigation.js
;(function ($, Navigo, sg) {
  sg.Navigation = {}

  sg.Navigation.router = new Navigo('', true)

  sg.Navigation.navigateToBeat = function (beatNum, limit) {
    var _limit = limit || sg.Navigation.totalBeats
    if (beatNum >= 0 && beatNum <= _limit) {
      sg.Navigation.router.navigate('/beat/' + beatNum)
    }
  }

  sg.Navigation.updateGlobalActiveGist = function (beatNum) {
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

  sg.Navigation.goToBeat = function (beatNum) {
    console.log('goToBeat:', beatNum)
    // set active class on current beat
    $('.gist-beat').removeClass('active')
    var $beat = $('#gist-beat-' + beatNum)
    $beat.addClass('active')

    // show current beat
    $('.gist-beat').hide()
    $beat.show()

    sg.Navigation.updateGlobalActiveGist(+beatNum)
    sg.Navigation.updateProgressBar(+beatNum)
  }

  sg.Navigation.updateProgressBar = function (beatNum) {
    for (var i = 0; i < sg.Navigation.totalBeats; i++) {
      if (i > beatNum) {
        // console.log('opacity 1', i)
        $('#gist-progress #gist-progress-beat-' + (i - 1)).css('opacity', 1)
      } else {
        $('#gist-progress #gist-progress-beat-' + (i - 1)).css('opacity', 0)
      }
    }

    // hide progress-bar on last beat before fin
    if (+beatNum === (sg.Navigation.totalBeats)) {
      $('#gist-progress').hide()
    } else {
      $('#gist-progress').show()
    }
  }

  sg.prototype.initNavigation = function () {
    // init stuff
    sg.Navigation.totalBeats = this.totalBeats
    sg.Navigation.$element = $(this.element)
    sg.Navigation.updateGlobalActiveGist(0) // sg.Static.getCurrentBeatNum()

    sg.Navigation.router
    .on('/beat/:beatNum', function (params) {
      // console.log('nav-params', params)
      sg.Navigation.goToBeat(params.beatNum)
    })
    .resolve()
  }
})(jQuery, Navigo, StoryGist)
