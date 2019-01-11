const R = require('ramda')
const Validation = require('folktale/validation')

const { Success, Failure } = Validation

const Chenv = () => {
  const error = (msg) => console.error('Failed: ' + msg)

  const defaults = {
    configsDir: '~/.chenv'
  }

  const run = (origOptions = {}) => {
    const options = R.merge(defaults, origOptions)

    const isValid = validate(options)
    isValid.matchWith({
      Success: ({ value }) => execChanges(options),
      Failure: ({ value }) => error(R.join('; ', value))
    })
  }

  const validate = (options) =>
    Success().concat(validateConfigNamePresent(options))
             .concat(validateEnvNamePresent(options))

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

  const execChanges = (options) => {
    console.log('It works!')
  }

  return {
    run
  }
}

Chenv().run({
  configName: 'pongalo',
  envName: 'dev'
})
