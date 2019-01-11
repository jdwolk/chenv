const R = require('ramda')
const Validation = require('folktale/validation')
const path = require('path')
const fs = require('fs')
const os = require('os')

const { Success, Failure } = Validation

const Chenv = () => {
  const error = (msg) => console.error('Failed: ' + msg)

  const printErrors = (value) => error(R.join('; ', value))

  const expandDir = (filepath) => {
    const pathParts = filepath.split(path.sep);

    if (pathParts[0] === '~') {
      pathParts[0] = os.homedir();
    }
    return path.join(...pathParts);
  }

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
      console.error(err)
      return Failure([`config '${configFilepath}' did not exist`])
    }
  }

  const execChanges = ({ configsDir, configName, envName }) => {
    const configFile = path.join(expandDir(configsDir), configName, envName + '.sh')
    // TODO: make ~/.chenv if it doesn't exist?
    const contents = fs.readFileSync(configFile, 'utf8')
    console.log(contents)
  }

  return {
    run
  }
}

Chenv().run({
  configName: 'pongalo',
  envName: 'dev'
})
