let createError = require('http-errors')
let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')

let indexRouter = require('./routes/index')
let gamesRouter = require('./routes/games')
let usersRouter = require('./routes/users')

let app = express()

// view engine setup
/*
app.set('views', path.join(__dirname, 'views'))
*/
/*
app.set('view engine', 'ejs')
*/

/*
app.use(logger('dev'))
*/
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
/*
app.use(express.static(path.join(__dirname, 'public')))
*/

app.use('/', indexRouter)
app.use('/games', gamesRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send(req.app.get('env') === 'development' ? err : {})
})

module.exports = app
