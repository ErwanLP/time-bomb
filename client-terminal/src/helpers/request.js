const request = require('./../helpers/request')

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
            try {
              let p = JSON.parse(body)
              resolve(p)
            } catch (e) {
              resolve(body)
            }
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
            try {
              let p = JSON.parse(body)
              resolve(p)
            } catch (e) {
              resolve(body)
            }
          }
        })
    })
  },
}