const codec = require('flumecodec')
const flume = require('flumedb')
const log = require('flumelog-offset')
const del = require('./delete')
const os = require('os')
const path = require('path')

const createDb = (file) => flume(log(file, { codec: codec.json }))
const homedir = os.homedir()
const file = path.join(homedir, '.ssb/flume/log.offset')
const db = createDb(file)

const ref = require('ssb-ref')
const yargs = require('yargs').argv

const compare = msg => {
  // ONLY RETURN TRUE WHEN MESSAGE SHOULD BE DELETED
  if (ref.isFeed(yargs.id)) {
    return msg.value.author === yargs.id
  } else {
    return msg.value.author === '@+rMXLy1md42gvbBq+6l6rp95/drh6QyACO1ZZMMnWI0=.ed25519' 
  }
}

del({ db, compare, file }, (err) => {
  if (err) throw err
  console.log('done with operation')
})
