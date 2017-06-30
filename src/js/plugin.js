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
