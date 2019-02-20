'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://192.168.1.25:11003"'// 宪亮
  // API_ROOT: '"http://192.168.1.92:11003"'// 云汉
})
