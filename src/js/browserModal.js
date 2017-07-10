/* globals jQuery, StoryGist */

;(function ($, sg) {
  sg.Modal = {}

  var $gistModalWrapper = $('.gist-modal-wrapper')
  var $gistModalClose = $('.gist-modal-close')

  sg.Modal.createIframe = function (src, beatNum) {
    console.log('createIframe>>', src, beatNum)
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
