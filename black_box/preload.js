/* global Image */

console.log('^^^^^^^^^^^^^^^^^^^^^^^^')

const cowPic = getPicture('black_box/cow_sprite.png')
const turtlePic = getPicture('black_box/turtle_sprite.png')
const berryPic = getPicture('black_box/strawberry_sprite.png')
const crossPic = getPicture('black_box/cross_sprite.png')

function getPicture (path) {
  const pic = new Image()
  pic.src = path
  return pic
}

console.log('1) preload.js\tis ready')
