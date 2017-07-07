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

    var prevIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve"> <path d="M13.891,17.418c0.268,0.272,0.268,0.709,0,0.979c-0.268,0.27-0.701,0.271-0.969,0l-7.83-7.908 c-0.268-0.27-0.268-0.707,0-0.979l7.83-7.908c0.268-0.27,0.701-0.27,0.969,0c0.268,0.271,0.268,0.709,0,0.979L6.75,10L13.891,17.418 z"/> </svg>'

    var nextIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve"> <path d="M13.25,10L6.109,2.58c-0.268-0.27-0.268-0.707,0-0.979c0.268-0.27,0.701-0.27,0.969,0l7.83,7.908 c0.268,0.271,0.268,0.709,0,0.979l-7.83,7.908c-0.268,0.271-0.701,0.27-0.969,0c-0.268-0.269-0.268-0.707,0-0.979L13.25,10z"/> </svg>'

    var defaults = {
      beatSelector: '[data-sg]',
      contentParent: 'main',
      initWidth: 640,
      animate: false,
      onboard: true,
      callToAction: 'View in full story ↓',
      pager: {
        html: '<div class="gist-pager"><button class="gist-pager__btn gist-pager__btn--prev" aria-label="previous">' + prevIcon + '</button> <button class="gist-pager__btn gist-pager__btn--next" aria-label="next">' + nextIcon + '</button></div>'
      },
      finalBeat: {
        raw: null,
        html: '<div class="gist-beat-container"><!--Entypo pictograms by Daniel Bruce — www.entypo.com--><div class="gist-beat-row"><h4>Share</h4><ul class="gist-share"><li><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + encodedShareURL + '">' + facebookIcon + '</a></li><li><a target="_blank" href="https://twitter.com/intent/tweet?url=' + encodedShareURL + '">' + twitterIcon + '</a></li><li><a target="_blank" href="mailto:?body=' + encodedShareURL + '">' + mailIcon + '</a></li></ul></div><div class="gist-beat-row"><h4 class="go-to-beginning">Go to the beginning</h4><ul></li><a class="go-to-beginning" href="#">' + goToIcon + '</li></ul></div></div>',
        type: 'DIV'
      }
    }

    this.element = element
    this.$els = {} // NOTE: used for caching elements
    this.settings = $.extend({}, defaults, options)
  }

  window.StoryGist = StoryGist // export to window for use in modules
})(jQuery)
