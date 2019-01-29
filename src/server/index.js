const fs = require('fs-extra')
const path = require('path')

var express = require('express')
var bodyParser = require('body-parser')
var app = express()

const execSync = require('child_process').execSync

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.post('/create', function (req, res, next) {
  const name = req.body.name
  console.log(name)
  execSync(`touch ${name}.txt`, { encoding: 'utf-8' })
})

app.listen(3003, function () {
  console.log('Aeroflow: Example app listening on port 3003!')
})