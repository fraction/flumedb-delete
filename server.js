var Server = require('ssb-server')
var config = require('ssb-config')

// add plugins
Server
  .use(require('ssb-server/plugins/onion'))
  .use(require('ssb-server/plugins/unix-socket'))
  .use(require('ssb-server/plugins/no-auth'))
  .use(require('ssb-server/plugins/plugins'))
  .use(require('ssb-server/plugins/master'))
  .use(require('ssb-replicate'))
  .use(require('ssb-gossip'))
  .use(require('ssb-friends'))
  .use(require('./plugin'))

Server(config)
