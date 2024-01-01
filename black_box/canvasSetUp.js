const { cvs: liveCVS, ctx: liveCTX } = canvasSetUp('animation-canvas', '2d', 501, 501)
const { cvs: drawCVS, ctx: drawCTX } = canvasSetUp('draw-canvas', '2d', 501, 501)
// const { cvs: backCVS, ctx: backCTX } = canvasSetUp('back-canvas', '2d', 501, 501)

function canvasSetUp (id, context, width, height) {
  const cvs = document.getElementById(id)
  const ctx = cvs.getContext(context)
  cvs.width = width
  cvs.height = height

  return { cvs, ctx }
}
