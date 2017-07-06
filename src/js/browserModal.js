/* globals jQuery, StoryGist */

;(function ($, sg) {
  sg.Modal = {}

  sg.Modal.createIframe = function (src, beatNum) {
    console.log('createIframe>>', src, beatNum)
    var html = '<iframe id="beat-modal-' + beatNum + '" src="' + src + '" frameborder="0" width="100%" scrolling="yes" allowtransparency="true"></iframe>'
    $('#modal-wrapper').append(html)
  }

  sg.Modal.show = function (beatNum) {
    console.log('show>>', beatNum)
    $('#modal-wrapper').show().css({ width: '100%', height: '100%', position: 'absolute', 'z-index': 999, top: 10, left: 0 })
    $('#beat-modal-' + beatNum).show().css({ width: '100%', height: '100%' })
    $('#modal-wrapper').show()
  }

  sg.Modal.hide = function (beatNum) {
    console.log('hide>>', beatNum)
    $('#modal-wrapper').hide()
    $('#beat-modal-' + beatNum).hide()
  }

  // public
  sg.Modal.launch = function (src, beatNum) {
    var _beatNum = beatNum || sg.Static.currentBeatIndex

    console.log($('#beat-modal-' + _beatNum).get(0), '<<< modal')
    if (!$('#beat-modal-' + _beatNum).get(0)) {
      sg.Modal.createIframe(src, _beatNum)
    }
    sg.Modal.show(_beatNum)
  }

  // init stuff
  $('.js-close').click(function (ev) {
    sg.Modal.hide(sg.Static.currentBeatIndex)
  })
})(jQuery, StoryGist)
