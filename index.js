module.exports = init

var Emitter = require('events').EventEmitter
  , request = require('request')

function init(callback) {
  callback(null, 'googleradio', GoogleRadio)
}

function GoogleRadio(automait, logger, config) {
  Emitter.call(this)
  this.automait = automait
  this.logger = logger
  this.config = config
  this.trackMeta = ''
}

GoogleRadio.prototype = Object.create(Emitter.prototype)

GoogleRadio.prototype.init = function () {
  this.startPolling()
}

GoogleRadio.prototype.startPolling = function () {
  setInterval(function () {
    request(this.config.host + '/random/meta', function (error, response) {
      if (error) return this.logger.error(error)
      if (this.trackMeta !== response.body) {
        this.trackMeta = response.body
        this.emit('trackChange', this.trackMeta)
      }
    }.bind(this))
  }.bind(this), 2000)
}
