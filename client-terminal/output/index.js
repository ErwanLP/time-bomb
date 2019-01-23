const chalk = require('chalk')
const figlet = require('figlet')
const {table} = require('table')

const card = '░░░░░░░░░' + '\n' + '░░░░░░░░░' +
  '\n' + '░░░░░░░░░' + '\n' + '░░░░░░░░░' + '\n' + '░░░░░░░░░' + '\n' +
  '░░░░░░░░░' + '\n' + '░░░░░░░░░'

let colorLog = (color, msg) => console.log('\n' + chalk[color](msg))
module.exports.log = msg => console.log(msg)
module.exports.logInfo = colorLog.bind(null, 'blue')
module.exports.logSuccess = colorLog.bind(null, 'green')
module.exports.logPlay = colorLog.bind(null, 'yellow')
module.exports.logError = colorLog.bind(null, 'red')

module.exports.figlet = (msg) => {
  return new Promise((resolve, reject) => {
    figlet(msg, (err, data) => {
      if (err) {
        reject(err)
      } else {
        //this.logPlay(data)
        resolve()
      }
    })
  })
}

module.exports.displayVisibleCard = (cards) => {
  if (cards) {
    let res = table([cards], {})
    this.log(res)
  } else {
    this.logPlay('You have no more card')
  }

}

module.exports.displayHiddenCard = (cardsLength) => {
  let hiddenCards = new Array(cardsLength).fill(card)
  if (cardsLength) {
    let res = table([hiddenCards.map((val, i) => i), hiddenCards], {
      columnDefault: {
        width: 16,
        alignment: 'center',
      },
    })
    this.log(res)
  } else {
    this.logPlay('No more card')
  }
  return hiddenCards

}