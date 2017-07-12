/* globals jQuery */

// jQuery Storygist
// A jQuery plugin to quickly create story gists
// Release Versions: https://github.com/nbcnews/storygist/releases
// Github: https://github.com/nbcnews/storygist
// License: The MIT License (MIT)
// by EJ Fox, Max Peterson, and Ian Rose

// options.js
;(function ($) {
  function StoryGist (element, options) {
    var encodedShareURL = encodeURIComponent(window.location.href)
    // Define icons to be used in final beat
    var facebookIcon = '<svg version="1.1" x="0" y="0" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">\n<title>Facebook Logo</title>\n<desc>Share on Facebook</desc>\n<path d="M17 1H3C1.9 1 1 1.9 1 3v14c0 1.1 0.9 2 2 2h7v-7H8V9.53h2V7.48c0-2.16 1.21-3.68 3.77-3.68l1.8 0v2.61h-1.2C13.38 6.4 13 7.14 13 7.84v1.69h2.57L15 12h-2v7h4c1.1 0 2-0.9 2-2V3C19 1.9 18.1 1 17 1z"></path>\n</svg>'
    var twitterIcon = '<svg version="1.1" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">\n<title>Twitter Logo</title>\n <desc>Share on Twitter</desc>\n <path d="M17.316 6.246c0.008 0.2 0 0.3 0 0.488c0 4.99-3.797 10.742-10.74 10.742c-2.133 0-4.116-0.625-5.787-1.697 c0.296 0 0.6 0.1 0.9 0.053c1.77 0 3.397-0.604 4.688-1.615c-1.651-0.031-3.046-1.121-3.526-2.621 c0.23 0 0.5 0.1 0.7 0.066c0.345 0 0.679-0.045 0.995-0.131c-1.727-0.348-3.028-1.873-3.028-3.703c0-0.016 0-0.031 0-0.047 c0.509 0.3 1.1 0.5 1.7 0.473c-1.013-0.678-1.68-1.832-1.68-3.143c0-0.691 0.186-1.34 0.512-1.898 C3.942 5.5 6.7 7 9.9 7.158C9.798 6.9 9.8 6.6 9.8 6.297c0-2.084 1.689-3.773 3.774-3.773 c1.086 0 2.1 0.5 2.8 1.191c0.859-0.17 1.667-0.484 2.397-0.916c-0.282 0.881-0.881 1.621-1.66 2.1 c0.764-0.092 1.49-0.293 2.168-0.594C18.694 5.1 18.1 5.7 17.3 6.246z"></path>\n</svg>'
    var mailIcon = '<svg version="1.1" x="0" y="0" viewBox="0 0 20 20" xml:space="preserve">\n<title>Email Icon</title>\n<desc>Email page link</desc>\n<path d="M1.57 5.29c0.49 0.26 7.25 3.89 7.5 4.03C9.33 9.45 9.65 9.51 9.98 9.51c0.33 0 0.65-0.06 0.91-0.2s7.01-3.77 7.5-4.03C18.88 5.02 19.34 4 18.44 4H1.52C0.62 4 1.09 5.02 1.57 5.29zM18.61 7.49c-0.56 0.29-7.39 3.85-7.73 4.03s-0.58 0.2-0.91 0.2 -0.57-0.02-0.91-0.2S1.94 7.78 1.39 7.49C1 7.28 1 7.52 1 7.71S1 15 1 15c0 0.42 0.57 1 1 1h16c0.43 0 1-0.58 1-1 0 0 0-7.11 0-7.29S19 7.29 18.61 7.49z"></path>\n</svg>'
    var goToIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">\n<path d="M0.685,10h2.372V9.795c0.108-4.434,3.724-7.996,8.169-7.996c4.515,0,8.174,3.672,8.174,8.201s-3.659,8.199-8.174,8.199\n\tc-1.898,0-3.645-0.65-5.033-1.738l1.406-1.504c1.016,0.748,2.27,1.193,3.627,1.193c3.386,0,6.131-2.754,6.131-6.15\n\tc0-3.396-2.745-6.15-6.131-6.15c-3.317,0-6.018,2.643-6.125,5.945V10h2.672l-3.494,3.894L0.685,10z"/>\n</svg>'
    var prevIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" xml:space="preserve"> <polygon points="352,115.4 331.3,96 160,256 331.3,416 352,396.7 201.5,256 "/> </svg>'
    var nextIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"> <polygon points="160,115.4 180.7,96 352,256 180.7,416 160,396.7 310.5,256 "/> </svg>'

    // TODO: replace with templates
    var finalBeatHTML = '<div class="gist-beat-container"><!--Entypo pictograms by Daniel Bruce — www.entypo.com--><div class="gist-beat-row"><h4>Share</h4><ul class="gist-share"><li><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + encodedShareURL + '">' + facebookIcon + '</a></li><li><a target="_blank" href="https://twitter.com/intent/tweet?url=' + encodedShareURL + '">' + twitterIcon + '</a></li><li><a target="_blank" href="mailto:?body=' + encodedShareURL + '">' + mailIcon + '</a></li></ul></div><div class="gist-beat-row"><h4 class="go-to-beginning">Go to the beginning</h4><ul></li><a class="go-to-beginning" href="/#/beat/0">' + goToIcon + '</li></ul></div></div>'
    var pagerHTML = '<div class="gist-pager"><button class="gist-pager__btn gist-pager__btn--prev" aria-label="previous">' + prevIcon + '</button> <button class="gist-pager__btn gist-pager__btn--next" aria-label="next">' + nextIcon + '</button></div>'

    var defaults = {
      beatSelector: '[data-sg]',
      contentParent: 'main',
      initWidth: 640,
      animate: false,
      onboard: true,
      callToAction: 'View in full story ↓',
      pager: {
        html: pagerHTML
      },
      finalBeat: {
        raw: null,
        html: finalBeatHTML,
        type: 'DIV'
      }
    }

    this.element = element
    this.$els = {} // NOTE: used for caching elements
    this.settings = $.extend({}, defaults, options)
  }

  window.StoryGist = StoryGist // export to window for use in modules
})(jQuery)

/* globals jQuery, StoryGist */

;(function ($, sg) {
  sg.Static = {}

  sg.Static.currentBeatIndex = 0

  sg.Static.getCurrentBeat = function () {
    return $('#gist-beat-' + sg.Static.getCurrentBeatNum())
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
    // console.log('goToBeat:', beatNum)
    // set active class on current beat
    $('.gist-beat').removeClass('active')
    var $beat = $('#gist-beat-' + beatNum)
    $beat.addClass('active')

    // show current beat
    $('.gist-beat').hide()
    $beat.show()

    sg.Navigation.updateGlobalActiveGist(+beatNum)
    sg.Navigation.updateProgressBar(+beatNum)
    sg.Navigation.updateCta(+beatNum)
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

  sg.Navigation.handleKeys = function (e) {
    if (!e.key) {
      return
    }

    var $thisBeat = sg.Static.getCurrentBeat()
    var beatNum = $thisBeat.data('origid')

    switch (e.key) {
      case 'ArrowLeft':
        this.prevBeat(beatNum, $thisBeat)
        break
      case 'ArrowRight':
        this.nextBeat(beatNum, $thisBeat)
        break
      default: return // exit this handler for other keys
    }
    e.preventDefault() // prevent the default action (scroll / move caret)
  }

  sg.Navigation.updateCta = function (beatNum) {
    var currentBeat = sg.Static.getCurrentBeat()
    var ctaText = $(currentBeat).data('cta-text')

    if (ctaText) {
      $('#gist-view-story').text(ctaText)
    }
  }

  sg.prototype.initNavigation = function () {
    // init stuff
    sg.Navigation.totalBeats = this.totalBeats
    sg.Navigation.$element = $(this.element)
    sg.Navigation.updateGlobalActiveGist(0) // sg.Static.getCurrentBeatNum()
    $(document).keydown(sg.Navigation.handleKeys.bind(this))

    sg.Navigation.router
    .on('/beat/:beatNum', function (params) {
      // console.log('nav-params', params)
      sg.Navigation.goToBeat(params.beatNum)
    })
    .resolve()
  }
})(jQuery, Navigo, StoryGist)

/* globals jQuery, StoryGist */

;(function ($, sg) {
  sg.Modal = {}

  var $gistModalWrapper = $('.gist-modal-wrapper')
  var $gistModalClose = $('.gist-modal-close')

  sg.Modal.createIframe = function (src, beatNum) {
    // console.log('createIframe>>', src, beatNum)
    var html = '<iframe id="beat-modal-' + beatNum + '" src="' + src + '" frameborder="0" width="100%" scrolling="yes" allowtransparency="true"></iframe>'
    $gistModalWrapper.append(html)
  }

  sg.Modal.show = function (beatNum) {
    $gistModalWrapper.addClass('is-active')
    $('#beat-modal-' + beatNum).show().css({ width: '100%', height: '100%' })
    $gistModalWrapper.show()
  }

  sg.Modal.close = function (beatNum) {
    $gistModalWrapper.removeClass('is-active')
    var $beatModal = $('#beat-modal-' + beatNum)
    $beatModal.hide()
    $beatModal.remove()
  }

  // method on StoryGist(), so it can access 'this'
  sg.prototype.launchModal = function (src, beatNum) {
    var _beatNum = beatNum || sg.Static.currentBeatIndex
    var modalExists = $('#beat-modal-' + _beatNum).length
    if (!modalExists) {
      sg.Modal.createIframe(src, _beatNum)
    }
    sg.Modal.show(_beatNum)
  }

  // init stuff
  $gistModalClose.click(function (ev) {
    sg.Modal.close(sg.Static.getCurrentBeatNum())
  })
})(jQuery, StoryGist)

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

/* globals jQuery, StoryGist, Hammer */
// init.js
;(function ($, sg) {
  // called in plugin.js
  sg.prototype.init = function () {
    var self = this
    // check dependencies

    var $body = $(self.element) // TODO: add to $els object
    // var $loading = $('<div id="loading-screen"></div>')
    // $body.prepend($loading)

    sg.Static.dependencyChecker(['jQuery', 'Hammer', 'Navigo', 'SplitType', 'videojs', '$.Velocity', 'lazySizes'])

    if ($(window).width() <= self.settings.initWidth) {
      var parsedGistEls = []
      var $originalStoryContent = $(self.settings.contentParent)
      var gistEls = $(self.settings.beatSelector)

      // Make the element our storygist beats will live in
      $body.prepend('<div id="gist-body"></div>')

      if (self.settings.onboard === true) {
        // Create the first div with explainer
        var $onboardDiv = $('<div class="gist-onboard-container"><p>You\'re viewing the <strong>Gist</strong> of this story. The Gist gives you a visual summary of the story.</p><div class="gist-onboard-ui-container"><div class="gist-onboard-ui-left"><div class="gist-onboard-ui-text"> <p>← <strong>Tap</strong> to go <strong>backward</strong> in Gist</p></div></div><div class="gist-onboard-ui-right"><div class="gist-onboard-ui-text"><p><strong>Tap</strong> to go <br /> <strong>forward</strong> in Gist →</div></div></div><div class="gist-onboard-ui-text gist-onboard-ui-text-cta animated infinite bounce">Scroll to enter Gist <br />↓</p></div></div>')
        $body.prepend($onboardDiv)
      }
      var $gistBody = $('#gist-body')

      // Hide the element that held the original content
      $originalStoryContent.css('display', 'none')
      $body.addClass('gist-active')

      gistEls.each(function (i, el) {
        // Create a new object for our beat
        var beat = {
          raw: el,
          html: el.outerHTML, // The HTML inside the beat
          type: el.nodeName, // The beat's element (p, h2, etc..)
          id: i,
          ctaUrl: '',
          ctaText: 'View Story'
        }

        if ($(el).data('cta-url')) {
          beat.ctaUrl = $(el).data('cta-url')
        }

        if ($(el).data('cta-text')) {
          beat.ctaText = $(el).data('cta-text')
        }

        // If the beat has a preceding element, add it's type to the object
        if (el.previousElementSibling != null) {
          beat.prevtype = el.previousElementSibling.nodeName
        }

        // If the beat is a paragraph, do some special logic
        if (beat.type.toLowerCase() === 'p' && beat.prevtype !== undefined) {
          if (beat.prevtype.toLowerCase() === 'h2' ||
              beat.prevtype.toLowerCase() === 'figure') {
            // Only add p elements preceded by h2 or figure
            parsedGistEls.push(beat)
          }
        } else {
          // If it isn't, just push it to the gist beats
          parsedGistEls.push(beat)
        }
      })

      parsedGistEls.push(self.settings.finalBeat)

      // Empty the page of old content
      $gistBody.append('<button id="gist-view-story">' + self.settings.callToAction + '</button>')

      $('#gist-view-story').click(function () {
        // View beat in story when 'view in story' CTA is clicked
        window.removeEventListener('touchmove', self.scrollLock)
        self.viewInStory()
      })

      self.totalBeats = +(parsedGistEls.length - 1)

      // Create element to hold navbar
      $gistBody.append('<div id="gist-progress"></div>')
      var $pager = $(self.settings.pager.html)

      $pager.find('.gist-pager__btn--next').on('click', function () {
        var el = sg.Static.getCurrentBeat()
        var beatNum = sg.Static.getCurrentBeatNum()
        self.nextBeat(beatNum, el)
      })

      $pager.find('.gist-pager__btn--prev').on('click', function () {
        var el = sg.Static.getCurrentBeat()
        var beatNum = sg.Static.getCurrentBeatNum()
        self.prevBeat(beatNum, el)
      })

      $gistBody.append($pager)

      // Write the beats back to the page
      parsedGistEls.forEach(function (el, i) {
        if (el.onBoard === true) {
          $gistBody.append('<div id="gist-beat-' + i + '" class="gist-beat gist-beat-onboard" style="z-index:' + (self.totalBeats - i) + ';">' + el.html + '</div>')
        } else {
          $gistBody.append('<div id="gist-beat-' + i + '" class="gist-beat" data-cta-url="' + el.ctaUrl + '" data-cta-text="' + el.ctaText + '" data-origid="' + i + '"  style="z-index:' + (self.totalBeats - i) + ';">' + el.html + '</div>')
        }

        // Create progress bar
        if (+i !== +self.totalBeats) {
          $('#gist-progress').append('<div id="gist-progress-beat-' + i + '" class="gist-progress-beat inactive" style="flex: 1;"></div>')
        }
      })

      var $initBeat = $('#gist-beat-0')

      $('.go-to-beginning').click(function () {
        $('#gist-progress').css('display', 'flex')
        $('.gist-progress-beat').removeClass('inactive')
        $('.gist-progress-beat').css('opacity', 1)
        $('.gist-beat.last').removeClass('active')
        $initBeat.addClass('active')
        self.goToBeginning()
      })

      $initBeat.addClass('active')
      $('.gist-beat').click(self.clickBeat.bind(self))
      $('.gist-beat:last-of-type').addClass('last')

      // Changes videos in beats to have a unique ID. Allows play() and pause() to work.
      $('.gist-beat').each(function (i) {
        var videoEl = $(this).find('video')
        var videoJsEl = $(this).find('.video-js')
        var videoElId = $(videoEl).attr('id')
        var videoJsElId = $(videoJsEl).attr('id')

        if (videoElId !== undefined) {
          $(videoEl).attr('id', videoElId + '-gist-beat')
        }

        if (videoJsElId !== undefined) {
          $(videoJsEl).attr('id', videoJsElId + '-gist-beat')
        }
      })

      // TODO: move to events.js
      window.addEventListener('scroll', function scrollListener () {
        if (window.pageYOffset >= $gistBody.offset().top) {
          if ($onboardDiv) {
            $onboardDiv.remove()
          }
          window.removeEventListener('scroll', scrollListener)
          window.addEventListener('touchmove', self.scrollLock)
        }
      })

      window.addEventListener('orientationchange', self.onOrientationChange)
      self.onOrientationChange()
      self.initHammer()
      self.initNavigation()

      // $loading.animate({opacity: 0, duration: 500})
      // $loading.remove()
    }
  }

  sg.prototype.initHammer = function () {
    var self = this
    // ++++ Swiping via Hammer.js
    if (typeof window.Hammer === 'function') {
      $('.gist-beat').each(function (index, beat) {
        // console.log('Hammer init:', index)
        var hammer = new Hammer(beat)
        hammer.on('swipe', self.swipeBeat.bind(self))
        hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL }) // enables 'Swipe Up'
      })
    }
  }
})(jQuery, StoryGist)

/* globals jQuery, StoryGist */
// plugin.js
;(function ($) {
  $.fn.storyGist = function (options) {
    return this.each(function () {
      if (undefined === $(this).data('storyGist')) {
        var plugin = new StoryGist(this, options)
        plugin.init()
        // $(this).data('storyGist', plugin)
      }
    })
  }
})(jQuery)
