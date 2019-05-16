const child = require('child_process')

process.on('message', data => {
  // console.log('child 2 got message', data)
  const { name, projectPath } = data.arg
  const createCommand = 'yarn yo @tanawat/redux-plus:create-state'
  child.execSync(`cd ${projectPath} && yes | ${createCommand} ${name}`, { stdio: 'inherit', encoding: 'utf-8' })
  // const r = child.spawnSync(`cd ${projectPath}`)
  // console.log(r.stdout.toString())
  // console.log(r.stderr.toString())
  // process.send('kuay')
})