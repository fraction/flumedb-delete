const fs = require('fs')
const os = require('os')
const path = require('path')

throw new Error('COMPLETELY UNTESTED, CONTINUE AT YOUR OWN RISK')

const flumePath = path.join(os.homedir(), '.ssb', 'flume')

fs.readdir(flumePath, (err, files) => {
  if (err) throw err
  files.forEach(file => {
    if (!file.startsWith('log')) {
      const filePath = path.join(flumePath, file)
      console.log('deleting', filePath)
      fs.unlinkSync(filePath)
    }
  })
})
