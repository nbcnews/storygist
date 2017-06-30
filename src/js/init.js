/* globals jQuery, StoryGist */
// init.js
;(function ($, sg) {
  // called in plugin.js
  sg.prototype.init = function () {
    var self = this
    var $body = $(self.element) // TODO: add to $els object

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

      parsedGistEls.push(self.settings.finalBeat)

      // Empty the page of old content
      $gistBody.append('<button id="gist-view-story">View in full story ↓</button>')

      $('#gist-view-story').click(function () {
        // View beat in story when 'view in story' CTA is clicked
        window.removeEventListener('touchmove', self.scrollLock)
        self.viewInStory()
      })

      self.totalBeats = +(parsedGistEls.length - 1)

      // Create element to hold navbar
      $gistBody.append('<div id="gist-progress"></div>')

      // Write the beats back to the page
      parsedGistEls.forEach(function (el, i) {
        if (el.onBoard === true) {
          $gistBody.append('<div id="gist-beat-' + i + '" class="gist-beat gist-beat-onboard" style="z-index:' + (self.totalBeats - i) + ';">' + el.html + '</div>')
        } else {
          $gistBody.append('<div id="gist-beat-' + i + '" class="gist-beat" data-origid="' + el.id + '"  style="z-index:' + (self.totalBeats - i) + ';">' + el.html + '</div>')
        }

        // Create progress bar
        if (+i !== +self.totalBeats) {
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

        self.goToBeginning()
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

        self.beatVideoPauseAll()

        // If it's the last beat
        if (clickX > (pageWidth / 2.5)) {
          // A click on the right side of the window
          self.nextBeat(beatNum, this)
        } else {
          self.prevBeat(beatNum, this)
        };
        self.globalActiveGist($body)
      })

      $('.gist-beat:last-of-type').addClass('last')

      self.globalActiveGist($body)

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
          if ($onboardDiv) {
            $onboardDiv.remove()
          }
          window.removeEventListener('scroll', scrollListener)
          window.addEventListener('touchmove', self.scrollLock)
        }
      })
    }
  }
})(jQuery, StoryGist)
