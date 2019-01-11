const minimist = require('minimist')
const io = require('socket.io-client')

module.exports = function () {

  let params = minimist(process.argv.slice(2))
  let host = params.host || false
  let name = params.name
  console.log('host', host)
  console.log('name', name)

  let socket = io('http://localhost:3001')

  socket.on('connect', function () {
    console.log('user connected')

  })
  socket.on('event', function (data) {
    console.log('event')
    console.log(data)
  })
  socket.on('broadcast', function (data) {
    console.log('broadcast')
    console.log(data)
  })
  socket.on('disconnect', function () {
    console.log('user disconnect')
  })
}
