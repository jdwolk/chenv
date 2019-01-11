const path = require('path')
const os = require('os')

const Utils = () => {
  const error = (msg) => console.error('Failed: ' + msg)
  const log = console.log

  const expandDir = (filepath) => {
    const pathParts = filepath.split(path.sep);

    if (pathParts[0] === '~') {
      pathParts[0] = os.homedir();
    }
    return path.join(...pathParts);
  }

  return {
    expandDir,
    error,
    log,
  }
}

module.exports = Utils()
