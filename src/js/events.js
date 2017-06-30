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
    $('video').each(function () {
      var videoEl = $(this).get(0)
      self.beatVideoPause(videoEl)
    })
  }

  sg.prototype.goToBeginning = function () {
    // Set all beats to visible (aka go to beginning)
    $('.gist-beat').css('display', 'flex')
  }

  sg.prototype.globalActiveGist = function ($body) {
    // Set classes for active gist
    var $gistBeat = $('.gist-beat')

    $gistBeat.each(function (gistIndex) {
      if ($body.hasClass('gist-beat-' + gistIndex + '-active')) {
        $body.removeClass('gist-beat-' + gistIndex + '-active')
      }

      if ($(this).hasClass('active')) {
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

  sg.prototype.nextBeat = function (beatNum, el) {
    function getRandTransition () {
      return transitions[Math.floor(Math.random() * transitions.length)]
    }
    // Handle behavior to move to next beat
    // A click on the right side of the window
    if ($(el).hasClass('last')) {
      // Do nothing for the final beat
    } else {
      $('.gist-beat').removeClass('active')
      var $nextEl = $(el).next('.gist-beat')

      $nextEl.addClass('active')

      var baseAnimSpeed = 750
      var blurPx = 81

      var transitions = ['transition.slideLeftIn',
        'transition.slideDownIn',
        'transition.slideLeftBigIn',
        'transition.shrinkIn',
        'transition.flipXIn',
        'transition.flipYIn',
        'transition.fadeIn',
        'transition.expandIn']

      if ($nextEl.find('p').length) {
        console.log('HAS A P TAG')
        var split = new SplitType($nextEl.find('p'), {
          split: 'lines, chars',
          position: 'absolute'
        })
        console.log('split', split)
        $nextEl.find('.line')
        .velocity('transition.shrinkIn', {'duration': baseAnimSpeed * 0.6, 'stagger': baseAnimSpeed * 0.05})
      }

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

      if ($nextEl.find('.pullquote').length) {
        console.log('HAS A PULLQUOTE')
        split = new SplitType($nextEl.find('.pullquote'), {
          split: 'lines'
        })
        $nextEl.find('.line')
        .velocity(getRandTransition(), {'duration': baseAnimSpeed, 'stagger': baseAnimSpeed / 2})

        /*
        var fontSize = $nextEl.find('.pullquote').css('font-size')
        $nextEl.find('.pullquote').velocity({'fontSize': fontSize},
          { 'duration': 2000,
            'easing': 'easeInSine',
            'begin': function (el) {
              $(el).css('font-size', '1px')
            }
          })
        */
      }

      var $videoElNext = $nextEl.find('video').get(0)
      this.beatVideoPlay($videoElNext)
    }

    // If this is the last beat before fin
    if (+beatNum === (this.totalBeats - 1)) {
      $('#gist-progress').css('display', 'none')
      $(el).css('display', 'none')
    } else if (+beatNum === +this.totalBeats) {
      // Do nothing
    } else {
      $(el).css('display', 'none')
      $('#gist-progress #gist-progress-beat-' + beatNum).css('opacity', 0)
    }
  }

  sg.prototype.prevBeat = function (beatNum, el) {
    // Handle behavior to move to previous beat
    if ($(el).is('#gist-beat-0')) {
      // Do nothing for the first beat
    } else {
      $('.gist-beat').removeClass('active')
      $(el).prev('.gist-beat').addClass('active')
      var $videoEl = $(el).prev('.gist-beat').find('video').get(0)
      this.beatVideoPlay($videoEl)
    }

    if (+beatNum === (this.totalBeats)) {
      $('#gist-progress').css('display', 'flex')
    }
    $('#gist-progress #gist-progress-beat-' + (beatNum - 1)).css('opacity', 1)
    $(el.previousSibling).css('display', 'flex')
  }

  sg.prototype.viewInStory = function () {
    // Get the current gist beat (the first that's visible)
    var currentBeat = $('.gist-beat:visible')[0]
    // console.log('currentBeat', currentBeat);

    var currentBeatNum = $(currentBeat).attr('data-origid')
    // var currentBeatNum = ($(currentBeat).attr('id').split('-')[2] - 1);
    // console.log('currentBeatNum', currentBeatNum);

    this.beatVideoPauseAll()

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

  sg.prototype.swipeHandler = function (e) {
    // console.log($(e.target), e.type, '>>>>>')
    var $target = $(e.target)
    if (!$target.hasClass('gist-beat')) {
      $target = $target.closest('.gist-beat')
      if (!$target.hasClass('gist-beat')) {
        return
      }
    }

    var beatNum = $target.attr('id').split('-')[2]
    this.beatVideoPauseAll()
    switch (e.type) {
      case 'swipeup':
        this.viewInStory()
        break
      case 'swipeleft':
        this.nextBeat(beatNum, $target)
        break
      case 'swiperight':
        this.prevBeat(beatNum, $target)
        break
      default:
        console.log(e.type)
    }
  }

  sg.prototype.scrollLock = function (e) {
    e.preventDefault()
  }
})(jQuery, StoryGist)
