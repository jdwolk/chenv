const R = require('ramda')
const fs = require('fs')
const path = require('path')
const Utils = require('./utils')

const { expandDir, log } = Utils

const Whichenv = () => {
  const defaults = {
    configsDir: '~/.chenv'
  }

  const run = (origOptions = {}) => {
    const options = R.merge(defaults, origOptions)
    const { configsDir, configName } = options

    const envFile = path.join(expandDir(configsDir), configName, '.currentEnv')
    const envName = fs.readFileSync(envFile, 'utf8')
    log(envName)
  }

  return {
    run
  }
}

Whichenv().run({
  configName: process.argv[2]
})
