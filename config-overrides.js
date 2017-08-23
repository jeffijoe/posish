const rewireEmotion = require('react-app-rewire-emotion')

module.exports = function (config, env) {
  config = rewireEmotion(config, env)

  // Use Inferno instead of React.
  config.resolve = Object.assign({}, config.resolve, {
    alias: Object.assign({}, config.resolve.alias, {
      'react': 'inferno-compat',
      'react-dom': 'inferno-compat',
      'mobx-react': 'inferno-mobx'
    }),
    modules: [
      ...config.resolve.modules,
      'src'
    ]
  })
  return config
}
