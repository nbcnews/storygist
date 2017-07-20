/* globals $ */
import Static from './static'
import Navigation from './navigation'

const $gistModalWrapper = $('.gist-modal-wrapper')
const $gistModalClose = $('.gist-modal-close')

function createIframe (src, beatNum) {
  const html = `<iframe id="beat-modal-${beatNum}" src="${src}" frameborder="0" width="100%" scrolling="yes" allowtransparency="true"></iframe>`
  $gistModalWrapper.append(html)
}

function show (beatNum) {
  $gistModalWrapper.addClass('is-active')
  $('#beat-modal-' + beatNum).show().css({ width: '100%', height: '100%' })
  $gistModalWrapper.show()
}

function close (beatNum) {
  $gistModalWrapper.removeClass('is-active')
  var $beatModal = $('#beat-modal-' + beatNum)
  $beatModal.hide()
  $beatModal.remove()
}

function launchModal (src, beatNum) {
  const _beatNum = beatNum || Static.currentBeatIndex
  const modalExists = $('#beat-modal-' + _beatNum).length
  if (!modalExists) {
    createIframe(src, _beatNum)
  }
  show(_beatNum)
  Navigation.router.navigate(`/beat/${beatNum}/modal`)
}

// init stuff
$gistModalClose.click(function (ev) {
  close(Static.getCurrentBeatNum())
})

export default { launchModal, close }
