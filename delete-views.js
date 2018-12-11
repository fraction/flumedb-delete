const fs = require('fs')
const os = require('os')
const path = require('path')
const rimraf = require('rimraf')

const flumePath = path.join(os.homedir(), '.ssb', 'flume')

fs.readdir(flumePath, (err, files) => {
  if (err) throw err
  files.forEach(file => {
    if (!file.startsWith('log')) {
      const filePath = path.join(flumePath, file)
      console.log('deleting', filePath)
      rimraf.sync(filePath)
    }
  })
})
