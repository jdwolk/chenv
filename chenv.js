const R = require('ramda')
const Validation = require('folktale/validation')
const path = require('path')
const fs = require('fs')
const os = require('os')
const shell = require('shelljs')
const Utils = require('./utils')

const { Success, Failure } = Validation
const { expandDir, error, log } = Utils

const Chenv = () => {
  const printErrors = (value) => error(R.join('; ', value))


  const defaults = {
    configsDir: '~/.chenv'
  }

  const run = (origOptions = {}) => {
    const options = R.merge(defaults, origOptions)

    const isValid = validate(options)
    isValid.matchWith({
      Success: ({ value }) => execChanges(options),
      Failure: ({ value }) => printErrors(value)
    })
  }

  const validate = (options) =>
    Success().concat(validateConfigNamePresent(options))
             .concat(validateEnvNamePresent(options))
             .concat(validateConfigFilePresent(options))

  const validateObjectPresence = R.curry((key, message, object) => {
    const value = object[key]

    return value ? Success(object) : Failure(message)
  })

  const validateConfigNamePresent =
    validateObjectPresence(
      'configName',
      [`you must include a config name`]
    )

  const validateEnvNamePresent =
    validateObjectPresence(
      'envName',
      [`you must include an environment name`]
    )

  const validateConfigFilePresent = ({ configsDir, configName, envName }) => {
    const configFilepath = path.join(expandDir(configsDir), configName, envName + '.sh')
    try {
      fs.statSync(configFilepath)
      return Success(configFilepath)
    }
    catch (err) {
      return Failure([`config '${configFilepath}' did not exist`])
    }
  }

  const execChanges = ({ configsDir, configName, envName }) => {
    const configFile = path.join(expandDir(configsDir), configName, envName + '.sh')
    const envFile = path.join(expandDir(configsDir), configName, '.currentEnv')
    fs.writeFileSync(envFile, envName)
    // TODO: make ~/.chenv if it doesn't exist?
    log(`Changing ${configName} config to ${envName} (${configFile})`)
    shell.exec(configFile)
    log('Done!')
  }

  return {
    run
  }
}

Chenv().run({
  configName: process.argv[2],
  envName: process.argv[3]
})

