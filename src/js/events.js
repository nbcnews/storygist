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

  sg.prototype.pauseBeats = function () {
    this.beatVideoPauseAll()
  }

  sg.prototype.nextBeat = function (beatNum, el) {
    sg.Static.currentBeatIndex++
    console.log('next>>', sg.Static.currentBeatIndex)

    function getRandTransition () {
      return sg.Static.TRANSITIONS[Math.floor(Math.random() * sg.Static.TRANSITIONS.length)]
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

      if (window.SplitType && $nextEl.find('.js-text-block').length) {
        console.log('Animate Textblock')
        var splitTextBlock = new SplitType('.js-text-block')
        splitTextBlock.split({
          split: 'lines',
          position: 'relative'
        })

        $.Velocity(splitTextBlock.lines, sg.Static.TRANSITIONS[3], {duration: baseAnimSpeed * 0.6, stagger: baseAnimSpeed * 0.05})
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

      if (window.SplitType && $nextEl.find('.pullquote').length) {
        console.log('Animate PULLQUOTE')
        var splitPullQuote = new SplitType($nextEl.find('.pullquote'), {
          split: 'lines'
        })

        $.Velocity(splitPullQuote.lines, getRandTransition(), {'duration': baseAnimSpeed, 'stagger': baseAnimSpeed / 2})

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
    if (sg.Static.currentBeatIndex > 0) {
      sg.Static.currentBeatIndex--
    }
    console.log('<<prev', sg.Static.currentBeatIndex)

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
    $('#gist-beat-' + (beatNum - 1)).css('display', 'flex')
  }

  sg.prototype.viewInStory = function () {
    // Get the current gist beat (the first that's visible)
    var currentBeat = $('.gist-beat:visible')[0]
    // console.log('currentBeat', currentBeat);

    var currentBeatNum = $(currentBeat).attr('data-origid')
    // var currentBeatNum = ($(currentBeat).attr('id').split('-')[2] - 1);
    // console.log('currentBeatNum', currentBeatNum);

    if ($(currentBeat).attr('data-cta-url')) {
      console.log('Do browser CTA thing')
    } else {
      this.pauseBeats()

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

  // Handle behavior for next/prev on beats
  sg.prototype.swipeBeat = function (e) {
    this.pauseBeats()
    var $thisBeat = sg.Static.getBeatFromTarget(e.target)
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
        console.log(e.type, e.direction)
    }
    this.globalActiveGist($(this.element))
  }

  sg.prototype.clickBeat = function (e) {
    console.log(sg.Static.getCurrentBeat(), 'currentBeat')

    this.pauseBeats()
    // Get this beat's number from it's ID
    var $thisBeat = sg.Static.getBeatFromTarget(e.target)
    var beatNum = $thisBeat.attr('id').split('-')[2]

    // Get pagewidth and mouse position
    // Which we use to determine whether to go prev/next
    var pageWidth = $(window).width()
    var posX = $thisBeat.position().left
    var clickX = e.pageX - posX

    // If it's the last beat
    if (clickX > (pageWidth / 2.5)) {
      // A click on the right side of the window
      this.nextBeat(beatNum, $thisBeat)
    } else {
      this.prevBeat(beatNum, $thisBeat)
    };
    this.globalActiveGist($(this.element))
  }

  sg.prototype.scrollLock = function (e) {
    e.preventDefault()
  }
})(jQuery, StoryGist)
