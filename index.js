#!/usr/bin/env node

var codec = require('flumecodec')
var drain = require('pull-stream/sinks/drain')
var flume = require('flumedb')
var log = require('flumelog-offset')
var pull = require('pull-stream')
const path = require('path')
const mv = require('mv')

const paths = {
  db: path.join(__dirname, 'db'),
  tmp: '/tmp/db'
}

const createDb = (file) => flume(log(file, {codec: codec.json}))
// a is the original log
var a = createDb(paths.db)
// b is our secondary temporary log
var b = createDb(paths.tmp)

// define function to exclude content (e.g. check `msg.value.author`)
const shouldDelete = msg => msg.author === 'bob'

// for each message, either ignore (delete) or add to new log
const onEachMessage = (msg) => {
  if (shouldDelete(msg)) {
    console.log('deleted:', msg)
  } else {
    b.append(msg, function (err, seq) {
      if (err) throw err
      console.log('kept:   ', msg)
    })
  }
}

// once all of the non-deleted messages are added to the second db, we replace a with b
const onDone = () => {
  // overwrite the real db with the temporary db
  mv(paths.tmp, paths.db, function (err) {
    if (err) throw err

    console.log('done')
  })
}

const messages = [
  {author: 'alice'},
  {author: 'bob'},
  {author: 'carol'}
]

// first we add three messages so we have something to delete
// we're planning on deleting any message where `msg.author` is bob
a.append(messages[0], function (err, seq) {
  if (err) throw err
  console.log('added:  ', messages[0])
  a.append(messages[1], function (err, seq) {
    if (err) throw err
    console.log('added:  ', messages[1])
    a.append(messages[2], function (err, seq) {
      if (err) throw err
      console.log('added:  ', messages[2])

      // now that we've added content to the first database, we want to add it to the second
      pull(
        // we start a pull stream, ignoring the sequence numbers
        a.stream({ seqs: false }),
        // now we add the messages from the first db to the second db
        drain(onEachMessage, onDone)
      )
    })
  })
})
