const combine = require('depject')
const patchcore = require('patchcore')
const mutant = require('mutant')
const codec = require('flumecodec')
const flume = require('flumedb')
const log = require('flumelog-offset')
const del = require('./delete')
const os = require('os')
const path = require('path')

const api = combine([patchcore])

// using [0] to emulate depject's "first"
const id = api.keys.sync.id[0]()
const blockedById = api.contact.obs.blocking[0](id)

const createDb = (file) => flume(log(file, { codec: codec.json }))
const homedir = os.homedir()
const file = path.join(homedir, '.ssb/flume/log.offset')
const db = createDb(file)

// Input: list of IDs
// Output: function that checks whether message was authored by any ID in list
const createComparator = (feedList) => (msg) => feedList.includes(msg.value.author)

let isInitialValue = true // HACK: see todo regarding skipping initial value
let haveBlockList = false // HACK: see todo regarding skipping initial value

mutant.watch(blockedById, (blockList) => {
  if (isInitialValue) {
    // TODO: How should the initial value be skipped?
    // The docs mention `value((v) => {})` but I'm not sure how to use that.
    isInitialValue = false
    console.log('loading block list, this requires sbot running with up-to-date indexes')
    setTimeout(() => {
      if (haveBlockList === false) {
        console.log('sorry this is taking so long :/')
        console.log('if sbot is running, it may still be indexing')
        console.log('if sbot is done indexing, file a bug!')
      }
    }, 8 * 1000)
  } else {
    haveBlockList = true
    console.log('block list:', blockList)
    const compare = createComparator(blockList)
    del({ db, compare, file }, (err) => {
      if (err) throw err
      console.log('you should probably delete your views next')
      process.exit() // HACK: There must be a better way to release this observable.
    })
  }
})
