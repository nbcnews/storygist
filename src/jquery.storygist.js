/* globals jQuery SplitType */

// jQuery Storygist
// A jQuery plugin to quickly create story gists
// Release Versions: https://github.com/nbcnews/storygist/releases
// Github: https://github.com/nbcnews/storygist
// License: The MIT License (MIT)
// by EJ Fox, Max Peterson, and Ian Rose

(function ($) {
  $.StoryGist = function (element, options) {
    var shareURL = window.location.href
    var encodedShareURL = encodeURIComponent(shareURL)

    // Define icons to be used in final beat
    var facebookIcon = '<svg version="1.1" x="0" y="0" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">\n<title>Facebook Logo</title>\n<desc>Share on Facebook</desc>\n<path d="M17 1H3C1.9 1 1 1.9 1 3v14c0 1.1 0.9 2 2 2h7v-7H8V9.53h2V7.48c0-2.16 1.21-3.68 3.77-3.68l1.8 0v2.61h-1.2C13.38 6.4 13 7.14 13 7.84v1.69h2.57L15 12h-2v7h4c1.1 0 2-0.9 2-2V3C19 1.9 18.1 1 17 1z"></path>\n</svg>'
    var twitterIcon = '<svg version="1.1" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">\n<title>Twitter Logo</title>\n <desc>Share on Twitter</desc>\n <path d="M17.316 6.246c0.008 0.2 0 0.3 0 0.488c0 4.99-3.797 10.742-10.74 10.742c-2.133 0-4.116-0.625-5.787-1.697 c0.296 0 0.6 0.1 0.9 0.053c1.77 0 3.397-0.604 4.688-1.615c-1.651-0.031-3.046-1.121-3.526-2.621 c0.23 0 0.5 0.1 0.7 0.066c0.345 0 0.679-0.045 0.995-0.131c-1.727-0.348-3.028-1.873-3.028-3.703c0-0.016 0-0.031 0-0.047 c0.509 0.3 1.1 0.5 1.7 0.473c-1.013-0.678-1.68-1.832-1.68-3.143c0-0.691 0.186-1.34 0.512-1.898 C3.942 5.5 6.7 7 9.9 7.158C9.798 6.9 9.8 6.6 9.8 6.297c0-2.084 1.689-3.773 3.774-3.773 c1.086 0 2.1 0.5 2.8 1.191c0.859-0.17 1.667-0.484 2.397-0.916c-0.282 0.881-0.881 1.621-1.66 2.1 c0.764-0.092 1.49-0.293 2.168-0.594C18.694 5.1 18.1 5.7 17.3 6.246z"></path>\n</svg>'
    var mailIcon = '<svg version="1.1" x="0" y="0" viewBox="0 0 20 20" xml:space="preserve">\n<title>Email Icon</title>\n<desc>Email page link</desc>\n<path d="M1.57 5.29c0.49 0.26 7.25 3.89 7.5 4.03C9.33 9.45 9.65 9.51 9.98 9.51c0.33 0 0.65-0.06 0.91-0.2s7.01-3.77 7.5-4.03C18.88 5.02 19.34 4 18.44 4H1.52C0.62 4 1.09 5.02 1.57 5.29zM18.61 7.49c-0.56 0.29-7.39 3.85-7.73 4.03s-0.58 0.2-0.91 0.2 -0.57-0.02-0.91-0.2S1.94 7.78 1.39 7.49C1 7.28 1 7.52 1 7.71S1 15 1 15c0 0.42 0.57 1 1 1h16c0.43 0 1-0.58 1-1 0 0 0-7.11 0-7.29S19 7.29 18.61 7.49z"></path>\n</svg>'
    var goToIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">\n<path d="M0.685,10h2.372V9.795c0.108-4.434,3.724-7.996,8.169-7.996c4.515,0,8.174,3.672,8.174,8.201s-3.659,8.199-8.174,8.199\n\tc-1.898,0-3.645-0.65-5.033-1.738l1.406-1.504c1.016,0.748,2.27,1.193,3.627,1.193c3.386,0,6.131-2.754,6.131-6.15\n\tc0-3.396-2.745-6.15-6.131-6.15c-3.317,0-6.018,2.643-6.125,5.945V10h2.672l-3.494,3.894L0.685,10z"/>\n</svg>'

    var defaults = {
      beatSelector: '[data-sg]',
      contentParent: 'main',
      initWidth: 640,
      finalBeat: {
        'raw': null,
        'html': '<div class="gist-beat-container"><!--Entypo pictograms by Daniel Bruce — www.entypo.com--><div class="gist-beat-row"><h4>Share</h4><ul class="gist-share"><li><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + encodedShareURL + '">' + facebookIcon + '</a></li><li><a target="_blank" href="https://twitter.com/intent/tweet?url=' + encodedShareURL + '">' + twitterIcon + '</a></li><li><a target="_blank" href="mailto:?body=' + encodedShareURL + '">' + mailIcon + '</a></li></ul></div><div class="gist-beat-row"><h4 class="go-to-beginning">Go to the beginning</h4><ul></li><a class="go-to-beginning" href="#">' + goToIcon + '</li></ul></div></div>',
        'type': 'DIV'
      }
    }

    var plugin = this
    plugin.settings = {}

    var $body = $(element)

    plugin.beatVideoPlay = function (videoEl) {
      if (videoEl) { videoEl.play() }
    }

    plugin.beatVideoPause = function (videoEl) {
      if (videoEl) { videoEl.pause() }
    }

    plugin.beatVideoPauseAll = function (videoEl) {
      $('video').each(function () {
        var videoEl = $(this).get(0)
        plugin.beatVideoPause(videoEl)
      })
    }

    plugin.goToBeginning = function () {
      // Set all beats to visible (aka go to beginning)
      $('.gist-beat').css('display', 'flex')
    }

    plugin.globalActiveGist = function ($body) {
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

    plugin.nextBeat = function (beatNum, el) {
      // Handle behavior to move to next beat
      // A click on the right side of the window
      if ($(el).hasClass('last')) {
        // Do nothing for the final beat
      } else {
        $('.gist-beat').removeClass('active')
        var $nextEl = $(el).next('.gist-beat')

        $nextEl.addClass('active')

        if ($nextEl.find('p').length) {
          console.log('HAS A P TAG')
          var split = new SplitType($nextEl.find('p'), {
            split: 'lines, chars',
            position: 'absolute'
          })
          console.log('split', split)
          $nextEl.find('.line')
          .velocity('transition.shrinkIn', {'duration': 800, 'stagger': 18})
        }

        $nextEl.find('figure').velocity({'blur': 0},
          { 'duration': 1000,
            'begin': function (el) {
              $(el).css('-webkit-filter', 'blur(91px)')
            }
          })

        if ($nextEl.find('.pullquote').length) {
          console.log('HAS A PULLQUOTE')
          split = new SplitType($nextEl.find('.pullquote'), {
            split: 'lines'
          })
          $nextEl.find('.line')
          .velocity('transition.slideLeftIn', {'duration': 800, 'stagger': 400})

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
        plugin.beatVideoPlay($videoElNext)
      }

      // If this is the last beat before fin
      if (+beatNum === (plugin.totalBeats - 1)) {
        $('#gist-progress').css('display', 'none')
        $(el).css('display', 'none')
      } else if (+beatNum === +plugin.totalBeats) {
        // Do nothing
      } else {
        $(el).css('display', 'none')
        $('#gist-progress #gist-progress-beat-' + beatNum).css('opacity', 0)
      }
    }

    plugin.prevBeat = function (beatNum, el) {
      // Handle behavior to move to previous beat
      if ($(el).is('#gist-beat-0')) {
        // Do nothing for the first beat
      } else {
        $('.gist-beat').removeClass('active')
        $(el).prev('.gist-beat').addClass('active')
        var $videoEl = $(el).prev('.gist-beat').find('video').get(0)
        plugin.beatVideoPlay($videoEl)
      }

      if (+beatNum === (plugin.totalBeats)) {
        $('#gist-progress').css('display', 'flex')
      }
      $('#gist-progress #gist-progress-beat-' + (beatNum - 1)).css('opacity', 1)
      $(el.previousSibling).css('display', 'flex')
    }

    plugin.viewInStory = function () {
      // Get the current gist beat (the first that's visible)
      var currentBeat = $('.gist-beat:visible')[0]
      // console.log('currentBeat', currentBeat);

      var currentBeatNum = $(currentBeat).attr('data-origid')
      // var currentBeatNum = ($(currentBeat).attr('id').split('-')[2] - 1);
      // console.log('currentBeatNum', currentBeatNum);

      plugin.beatVideoPauseAll()

      // Hide the storygist
      $('#gist-body').css('display', 'none')
      $body.toggleClass('gist-active')

      // Show all the original story elements
      $(plugin.settings.contentParent).css('display', 'block')
      $('.site-header').css('display', 'block')
      $('.progress').css('display', 'block')

      // Find the original element that corresponds with the current beat
      var scrollToEl = $(plugin.settings.contentParent + ' ' + plugin.settings.beatSelector + ':eq(' + currentBeatNum + ')')

      // Scroll to that element
      $('html, body').animate({
        scrollTop: (scrollToEl.offset().top - 80)
      }, 2000)
    }

    plugin.scrollLock = function (e) {
      e.preventDefault()
    }

    plugin.init = function () {
      plugin.settings = $.extend({}, defaults, options)
      // console.log('Storygist init', $(window).width(), plugin.settings.initWidth)
      if ($(window).width() <= plugin.settings.initWidth) {
        var $body = $('body')
        var parsedGistEls = []
        var $originalStoryContent = $(plugin.settings.contentParent)
        var gistEls = $(plugin.settings.beatSelector)
        // console.log('Storygist loaded, beatSelector: ', plugin.settings.beatSelector)

        // Make the element our storygist beats will live in
        $body.prepend('<div id="gist-body"></div>')

        // Create the first div with explainer
        var $onboardDiv = $('<div class="gist-onboard-container"><p>This story has an optional <strong>Gist</strong> view. Gist gives you the overall story quickly with the option at any time to drop into the full story.</p><div class="gist-onboard-ui-container"><div class="gist-onboard-ui-left"><div class="gist-onboard-ui-text">← Tap Previous</div></div><div class="gist-onboard-ui-right"><div class="gist-onboard-ui-text">Tap Next →</div></div></div><div class="gist-onboard-ui-text gist-onboard-ui-text-cta animated infinite bounce">Scroll to Start ↓</div></div>')
        $body.prepend($onboardDiv)
        var $gistBody = $('#gist-body')

        // Hide the element that held the original content
        $originalStoryContent.css('display', 'none')
        $body.addClass('gist-active')

        gistEls.each(function (i, el) {
          // Create a new object for our beat
          var beat = {
            'raw': el,
            'html': el.outerHTML, // The HTML inside the beat
            'type': el.nodeName, // The beat's element (p, h2, etc..)
            'id': i
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

        parsedGistEls.push(plugin.settings.finalBeat)

        // Empty the page of old content
        $gistBody.append('<button id="gist-view-story">View in Story ↓</button>')

        $('#gist-view-story').click(function () {
          // View beat in story when 'view in story' CTA is clicked
          window.removeEventListener('touchmove', plugin.scrollLock)
          plugin.viewInStory()
        })

        plugin.totalBeats = +(parsedGistEls.length - 1)

        // Create element to hold navbar
        $gistBody.append('<div id="gist-progress"></div>')

        // Write the beats back to the page
        parsedGistEls.forEach(function (el, i) {
          if (el.onBoard === true) {
            $gistBody.append('<div id="gist-beat-' + i + '" class="gist-beat gist-beat-onboard" style="z-index:' + (plugin.totalBeats - i) + ';">' + el.html + '</div>')
          } else {
            $gistBody.append('<div id="gist-beat-' + i + '" class="gist-beat" data-origid="' + el.id + '"  style="z-index:' + (plugin.totalBeats - i) + ';">' + el.html + '</div>')
          }

          // Create progress bar
          if (+i !== +plugin.totalBeats) {
            $('#gist-progress').append('<div id="gist-progress-beat-' + i + '" class="gist-progress-beat inactive" style="flex: 1;"></div>')
          }
        })

        // #TODO revisit swiping
        // $('.gist-beat').hammer().bind('swipe', function (ev) {
        //   var beatNum = $(ev.target).attr('id').split('-')[2];
        //   plugin.beatVideoPauseAll();
        //   if (ev.gesture.offsetDirection === 2) {
        //     // Swipe left
        //     plugin.nextBeat(beatNum, ev.target);
        //   } else if (ev.gesture.offsetDirection === 4) {
        //     // Swipe right
        //     plugin.prevBeat(beatNum, ev.target);
        //   } else if (ev.gesture.offsetDirection === 8) {
        //     // Swipe up
        //     //plugin.viewInStory();
        //   }
        // });

        var $initBeat = $('#gist-beat-0')

        $('.go-to-beginning').click(function () {
          $('#gist-progress').css('display', 'flex')
          $('.gist-progress-beat').removeClass('inactive')
          $('.gist-progress-beat').css('opacity', 1)
          $('.gist-beat.last').removeClass('active')
          $initBeat.addClass('active')

          plugin.goToBeginning()
        })

        $initBeat.addClass('active')

        // Handle behavior for next/prev on beats
        $('.gist-beat').click(function (e) {
          // Get this beat's number from it's ID
          var beatNum = $(this).attr('id').split('-')[2]

          // Get pagewidth and mouse position
          // Which we use to determine whether to go prev/next
          var pageWidth = $(window).width()
          var posX = $(this).position().left
          var clickX = e.pageX - posX

          plugin.beatVideoPauseAll()

          // If it's the last beat
          if (clickX > (pageWidth / 2.5)) {
            // A click on the right side of the window
            plugin.nextBeat(beatNum, this)
          } else {
            plugin.prevBeat(beatNum, this)
          };
          plugin.globalActiveGist($body)
        })

        $('.gist-beat:last-of-type').addClass('last')

        plugin.globalActiveGist($body)

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

        window.addEventListener('scroll', function scrollListener () {
          if (window.pageYOffset >= $gistBody.offset().top) {
            $onboardDiv.remove()
            window.removeEventListener('scroll', scrollListener)
            window.addEventListener('touchmove', plugin.scrollLock)
          }
        })
      }
    }

    // UP AND AT 'EM
    plugin.init()
  }

  $.fn.storyGist = function (options) {
    return this.each(function () {
      if (undefined === $(this).data('storyGist')) {
        var plugin = new $.StoryGist(this, options)
        $(this).data('storyGist', plugin)
      }
    })
  }
})(jQuery)
