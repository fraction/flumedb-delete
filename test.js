#!/usr/bin/env node

const create = require('./lib/create')
const del = require('./lib/delete')

create((err, db) => {
  if (err) throw err

  del({ db }, (err) => {
    if (err) throw err
    console.log('one message from bob should be deleted')
  })
})
