#!/usr/bin/env node

const create = require('./create')
const del = require('./delete')

create((err, db) => {
  if (err) throw err

  del({ db }, (err) => {
    if (err) throw err
    console.log('done with operation')
  })
})
