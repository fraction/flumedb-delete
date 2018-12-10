var codec = require('flumecodec')
var flume = require('flumedb')
var log = require('flumelog-offset')
const path = require('path')

const createDb = (file) => flume(log(file, { codec: codec.json }))

const paths = {
  db: path.join(__dirname, 'db'),
  tmp: '/tmp/db'
}
var a = createDb(paths.db)
const messages = [
  { author: 'alice' },
  { author: 'bob' },
  { author: 'carol' }
]

// first we add three messages so we have something to delete
// we're planning on deleting any message where `msg.author` is bob
module.exports = (cb) => {
  a.append(messages[0], function (err, seq) {
    if (err) return cb(err)
    a.append(messages[1], function (err, seq) {
      if (err) return cb(err)
      a.append(messages[2], function (err, seq) {
        if (err) return cb(err)
        cb(null, a)
      })
    })
  })
}
