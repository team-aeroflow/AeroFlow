// async function sendMultipleMails(mails) {
//   let sendMails = 0;
//   // logic for
//   // sending multiple mails
//   return sendMails;
// }
// // receive message from master process
// process.on('message', async (message) => {
//   const numberOfMailsSend = await sendMultipleMails(1);
//   console.log(message)
//   // send response to master process
//   process.send(JSON.stringify(message));
// });

const execSync = require('child_process').execSync

// console.log('starting child process 2')
process.on('message', data => {
  console.log('child 2 got message', data)
  const { path, name } = data
  // const cli = execSync(`cd ${path} && touch ${name}`, { encoding: 'utf-8' })
  execSync(`cd ${path} && npx create-react-app ${name}`, { stdio: 'inherit', encoding: 'utf-8' })
  // execSync(`cd ${path}/${name} && npm install --save-dev yo @tanawat/generator-redux-plus`, { encoding: 'utf-8' })
  process.send('create success')
})

// console.log('waiting for messages in child process 2...')

