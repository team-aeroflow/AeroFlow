const execSync = require('child_process').execSync

// console.log('starting child process 2')
process.on('message', data => {
  console.log('child 2 got message', data)
  const { path, name } = data
  execSync(`cd ${path} && touch ${name}`, { encoding: 'utf-8' })
  // execSync(`cd ${path} && npx create-react-app ${name}`, {  encoding: 'utf-8' })
  // execSync(`cd ${path}/${name} && npm install --save-dev yo @tanawat/generator-redux-plus`, { encoding: 'utf-8' })
  process.send('create success')
})

// console.log('waiting for messages in child process 2...')

