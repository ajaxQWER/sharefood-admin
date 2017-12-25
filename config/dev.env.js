var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_URL: '"//127.0.0.1:8080"',
  BASE_URL: '"//api.test.gongxiangdiancan.com"',
  UPLOAD_URL: '"//uploads.test.gongxiangdiancan.com"'
})
