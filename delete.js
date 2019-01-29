var pull = require('pull-stream')
var drain = require('pull-stream/sinks/drain')
var codec = require('flumecodec')
var flume = require('flumedb')
var log = require('flumelog-offset')
const path = require('path')
const mv = require('mv')

const paths = {
  db: path.join(__dirname, 'db'),
  tmp: '/tmp/db' + Math.random()
}

const createDb = (file) => flume(log(file, { codec: codec.json }))
// a is the original log
// b is our secondary temporary log
var b = createDb(paths.tmp)

// define function to exclude content (e.g. check `msg.value.author`)
const shouldDelete = msg => msg.author === 'bob'

// once all of the non-deleted messages are added to the second db, we replace a with b

module.exports = (obj, cb) => {
  let { db, compare, file } = obj

  compare = compare || shouldDelete

  // for each message, either ignore (delete) or add to new log
  const onEachMessage = item => {
    const msg = item.value

    if (compare(msg)) {
      console.log('deleting:', item)
      db.del(item.seq, (err) => {
        if (err) throw err
        console.log('deleted!')
      })
    }
  }

  pull(
    // we start a pull stream, ignoring the sequence numbers
    db.stream({ seqs: true }),
    // now we add the messages from the first db to the second db
    drain(onEachMessage)
  )
}
