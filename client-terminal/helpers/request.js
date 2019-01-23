const request = require('request')

module.exports = {
  post: (url, params) => {
    return new Promise((resolve, reject) => {
      request.post({url: url, form: params},
        (err, httpResponse, body) => {
          if (err) {
            console.error(err)
            try {
              let p = JSON.parse(err)
              reject(p)
            } catch (e) {
              reject(err)
            }
          } else {
            resolve(JSON.parse(body))
          }
        })
    })
  },
  get: (url, params) => {
    return new Promise((resolve, reject) => {
      request.get({url: url},
        (err, httpResponse, body) => {
          if (err) {
            console.error(err)
            try {
              let p = JSON.parse(err)
              reject(p)
            } catch (e) {
              reject(err)
            }
          } else {
            resolve(JSON.parse(body))
          }
        })
    })
  },
}