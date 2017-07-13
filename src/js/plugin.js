/* globals $ */
import StoryGist from './init'

export function init () {
  $.fn.storyGist = function (options) {
    return this.each(function () {
      if (undefined === $(this).data('storyGist')) {
        var plugin = new StoryGist(this, options)
        plugin.init()
        // $(this).data('storyGist', plugin)
      }
    })
  }
}
