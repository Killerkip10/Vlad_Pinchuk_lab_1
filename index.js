const express = require('express');
const readline = require('readline');
const  request = require('request');
const fs = require('fs');

let messageAmount = 0;
const app = express();

app.use(express.static('./public'));

app.listen(3001, () => console.log('Server was started on 3001'));

const trackMessages = () => {
  setInterval(async () => {
    request('http://localhost:3002/messages.json', (err, response, body) => {
      if (err) {
        return;
      }
      const messages = JSON.parse(response.body);

      if (messageAmount === messages.length) {
        return;
      }

      messageAmount = messages.length;
      
     messages.forEach(({ message }) => console.log(message));
    });
  }, 2000);
};

const readMessage = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('', (message) => {
    rl.close();
    fs.readFile('./public/messages.json', (erorr, data) => {
      const messages = JSON.parse(data);
      messages.push({ message });
      fs.writeFileSync('./public/messages.json', JSON.stringify(messages));
      readMessage();
    });
  });
};

trackMessages();
readMessage();