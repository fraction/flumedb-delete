#!/usr/bin/env node
  
var MemLog = require('flumelog-memory')
var pull = require('pull-stream')
var drain = require('pull-stream/sinks/drain')
var Flume = require('flumedb')

// a is the original log
var a = Flume(MemLog())
// b is our secondary temporary log
var b = Flume(MemLog())

// define function to exclude content (e.g. check `msg.value.author`)
const shouldDelete = msg => msg.author === 'bob'

// for each message, either ignore (delete) or add to new log
const onEachMessage = (msg) => {
  if (shouldDelete(msg)) {
    console.log('deleted:', msg)
  } else {
    b.append(msg, function (err, seq) {
    console.log('kept:   ', msg)
    })
  }
}

// once all of the non-deleted messages are added to the second db, we replace a with b
const onDone = () => {
  a = b
  delete b
}

// first we add three messages so we have something to delete
// we're planning on deleting any message where `msg.author` is bob
a.append({author: 'alice'}, function (err, seq) {
  a.append({author: 'bob'}, function (err, seq) {
    a.append({author: 'carol'}, function (err, seq) {

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
