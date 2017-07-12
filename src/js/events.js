/* globals SplitType, jQuery, StoryGist */
// events.js
;(function ($, sg) {
  sg.prototype.beatVideoPlay = function (videoEl) {
    if (videoEl) { videoEl.play() }
  }

  sg.prototype.beatVideoPause = function (videoEl) {
    if (videoEl) { videoEl.pause() }
  }

  sg.prototype.beatVideoPauseAll = function (videoEl) {
    var self = this
    $('video').each(function (idx, el) {
      self.beatVideoPause(el)
    })
  }

  sg.prototype.goToBeginning = function () {
    // Set all beats to visible (aka go to beginning)
    $('.gist-beat').css('display', 'flex')
  }

  sg.prototype.pauseBeats = function () {
    this.beatVideoPauseAll()
  }

  sg.prototype.nextBeat = function (beatNum, el) {
    // Handle behavior to move to next beat
    // A click on the right side of the window
    // console.log('>> Next', beatNum)
    this.pauseBeats()

    if ($(el).hasClass('last')) {
      // Do nothing for the final beat
    } else {
      var $nextEl = $(el).next('.gist-beat')
      var baseAnimSpeed = 750
      var blurPx = 81

      if (window.SplitType && $nextEl.find('.js-text-block').length && this.settings.animate) {
        // console.log('Animate Textblock')
        var splitTextBlock = new SplitType('.js-text-block')
        splitTextBlock.split({
          split: 'lines',
          position: 'relative'
        })

        $.Velocity(splitTextBlock.lines, sg.Static.TRANSITIONS[3], {duration: baseAnimSpeed * 0.6, stagger: baseAnimSpeed * 0.05})
      }

      if (this.settings.animate) {
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
          // console.log('Animate PULLQUOTE')
          var splitPullQuote = new SplitType($nextEl.find('.pullquote'), {
            split: 'lines'
          })

          $.Velocity(splitPullQuote.lines, sg.Static.getRandTransition(), {'duration': baseAnimSpeed, 'stagger': baseAnimSpeed / 2})
        }
      }

      var $videoElNext = $nextEl.find('video').get(0)
      this.beatVideoPlay($videoElNext)
    }

    sg.Navigation.navigateToBeat(+beatNum + 1, +this.totalBeats)
  }

  sg.prototype.prevBeat = function (beatNum, el) {
    // console.log('>> Prev', beatNum)
    this.pauseBeats()
    // Handle behavior to move to previous beat
    if ($(el).is('#gist-beat-0')) {
      // Do nothing for the first beat
    } else {
      var $videoEl = $(el).prev('.gist-beat').find('video').get(0)
      this.beatVideoPlay($videoEl)
    }

    sg.Navigation.navigateToBeat(+beatNum - 1)
  }

  sg.prototype.viewInStory = function () {
    // Get the current gist beat (the first that's visible)
    var currentBeat = sg.Static.getCurrentBeat()
    var currentBeatNum = $(currentBeat).data('origid')
    var ctaURL = $(currentBeat).data('cta-url')

    // pause any videos, animations, etc
    this.pauseBeats()

    if (ctaURL) {
      // console.log('Do browser CTA thing:', currentBeatNum, ctaURL)
      // console.log($(window).width())
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
      } else {
        this.launchModal(ctaURL, currentBeatNum)
      }
    } else {
      // Hide the storygist
      $('#gist-body').css('display', 'none')
      $(this.element).toggleClass('gist-active')

      // Show all the original story elements
      $(this.settings.contentParent).css('display', 'block')
      $('.site-header').css('display', 'block')
      $('.progress').css('display', 'block')

      // Find the original element that corresponds with the current beat
      var scrollToEl = $(this.settings.contentParent + ' ' + this.settings.beatSelector + ':eq(' + currentBeatNum + ')')

      // Scroll to that element
      $('html, body').animate({
        scrollTop: (scrollToEl.offset().top - 80)
      }, 2000)
    }
  }

  sg.prototype.swipeBeat = function (e) {
    var $thisBeat = sg.Static.getCurrentBeat()
    var beatNum = $thisBeat.attr('id').split('-')[2]
    switch (e.direction) {
      case 8: // DIRECTION_UP
        this.viewInStory()
        break
      case 2: // DIRECTION_LEFT
        this.nextBeat(beatNum, $thisBeat)
        break
      case 4: // DIRECTION_RIGHT
        this.prevBeat(beatNum, $thisBeat)
        break
      default:
        // console.log(e.type, e.direction)
    }
  }

  sg.prototype.clickBeat = function (e) {
    // Get this beat's number from it's ID
    var $thisBeat = sg.Static.getCurrentBeat()
    var beatNum = $thisBeat.data('origid')

    // Get pagewidth and mouse position
    // Which we use to determine whether to go prev/next
    // var pageWidth = $(window).width()
    var pageWidth = $thisBeat.width()
    var posX = $thisBeat.position().left
    var clickX = e.pageX - posX

    // console.log('click target el', $(e.target)[0].tagName)

    if ($(e.target)[0].tagName !== 'INPUT' && $(e.target)[0].tagName !== 'BUTTON') {
      // If it's the last beat
      if (clickX > (pageWidth / 2.5)) {
        // A click on the right side of the window
        this.nextBeat(beatNum, $thisBeat)
      } else {
        this.prevBeat(beatNum, $thisBeat)
      };
    }
  }

  sg.prototype.scrollLock = function (e) {
    e.preventDefault()
  }

  sg.prototype.onOrientationChange = function () {
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
      $orientationSelector.addClass('gist-landscape').removeClass('gist-portrait')
    }
  }
})(jQuery, StoryGist)
