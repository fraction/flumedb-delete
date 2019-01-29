var pull = require('pull-stream')
var drain = require('pull-stream/sinks/drain')

// define function to exclude content (e.g. check `msg.value.author`)
const shouldDelete = msg => msg && msg.author === 'bob'

// once all of the non-deleted messages are added to the second db, we replace a with b

const deleteList = []

module.exports = (obj, cb) => {
  let { db, compare } = obj

  compare = compare || shouldDelete

  // for each message, either ignore (delete) or add to new log
  const onEachMessage = item => {
    const msg = item.value

    if (compare(msg)) {
      deleteList.push(item.seq)
    }
  }

  pull(
    // we start a pull stream, ignoring the sequence numbers
    db.stream({ seqs: true }),
    // now we add the messages from the first db to the second db
    drain(onEachMessage, (err) => {
      if (err) throw err
      db.del(deleteList, cb)
    })
  )
}
