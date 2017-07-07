/* globals jQuery, StoryGist */

;(function ($, sg) {
  sg.Modal = {}

  sg.Modal.createIframe = function (src, beatNum) {
    console.log('createIframe>>', src, beatNum)
    var html = '<iframe id="beat-modal-' + beatNum + '" src="' + src + '" frameborder="0" width="100%" scrolling="yes" allowtransparency="true"></iframe>'
    $('#modal-wrapper').append(html)
  }

  sg.Modal.show = function (beatNum) {
    $('#modal-wrapper').show().css({ width: '100%', height: '100%', position: 'absolute', 'z-index': 999, top: 10, left: 0 })
    $('#beat-modal-' + beatNum).show().css({ width: '100%', height: '100%' })
    $('#modal-wrapper').show()
  }

  sg.Modal.hide = function (beatNum) {
    $('#modal-wrapper').hide()
    $('#beat-modal-' + beatNum).hide()
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
  $('.js-close').click(function (ev) {
    sg.Modal.hide(sg.Static.getCurrentBeatNum())
  })
})(jQuery, StoryGist)
