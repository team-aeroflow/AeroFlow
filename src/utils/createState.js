const execSync = require('child_process').execSync

process.on('message', data => {
  execSync(`ls`, { encoding: 'utf-8' })
  process.send('kuay')
})