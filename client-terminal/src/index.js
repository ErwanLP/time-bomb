const minimist = require('minimist')
const io = require('socket.io-client')
const output = require('./output/index')
const Configstore = require('configstore')
const FrontCore = require('front-core')
const pkg = require('./../package.json')
const implementation = require('./terminalImplementation')
require('dotenv').config({path: __dirname + '/./../../.env'})
const conf = new Configstore(pkg.name, {})

module.exports = function () {
  let params = minimist(process.argv.slice(2))
  const bot = !!params.bot
  const save = !!params.save
  const dev = !!params.dev
  const version = !!params.v || !!params.version
  if (save) {
    conf.set('host', params.host)
    conf.set('name', params.name)
  }
  let host, name
  if (dev) {
    host = params.host || 'http://localhost:' +
      (process.env.CUSTOM_PORT || '3000')
    name = params.name
  } else {
    host = params.host || conf.get('host') || 'http://localhost:' +
      (process.env.CUSTOM_PORT || '3000')
    name = params.name || conf.get('name')
  }

  if (version) {
    output.log(pkg.version)
    process.exit()
  }

  output.figlet('Time Bomb', output.logPlay).then(() => {
    if (name === 'YOUR_NAME') {
      output.logError('Your name can not be  : YOUR_NAME')
      process.exit()
    }

    output.logInfo('Connecting to ' + host + ' ...')

    FrontCore({
      host: host,
      name: name,
      bot: bot,
      version: pkg.version,
    }, io, implementation)
  })
}
