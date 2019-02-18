const execSync = require('child_process').execSync

// console.log('starting child process 2')
process.on('message', data => {
  console.log('child 2 got message', data)
  const { path, name } = data
  // execSync(`cd ${path} && touch ${name}`, { encoding: 'utf-8' })
  execSync(`cd ${path} && npx create-react-app ${name}`, { stdio: 'inherit', encoding: 'utf-8' })
  execSync(`cd ${path}/${name} && yarn add --dev yo @tanawat/generator-redux-plus && yarn yo @tanawat/redux-plus:init --install`, { stdio: 'inherit', encoding: 'utf-8' })
  // execSync(`cd ${path}/${name} && yarn yo @tanawat/redux-plus:init --install`, { stdio: 'inherit', encoding: 'utf-8' })
  process.send('create success')
})

// console.log('waiting for messages in child process 2...')

