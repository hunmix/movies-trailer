
// const speck = (str) => (target) => console.log(str)
// const speak = str => (target, propety, discriptor) => {console.log(str)}
const { speak } = require('./speak')
class Boy{
  @speak('haha')
  run () {
    console.log('run')
  }
}
// function speak(str) {
//   return (target, propety, discriptor) => {
//     console.log(propety)
//   }
// }
const boy = new Boy()
boy.run()