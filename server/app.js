const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '../views'));


app.get('/music/:name', (req, res) => {
  const stream = fs.createReadStream(__dirname + '/music/01.痛快的哀艷.mp3');
  
  stream
    .pipe(res)
    .on('finish', res.end)

});

app.get('/', (req, res) => {
  res.renders('index');
})

app.use((err, req, res, next) => {
  // console.log(req);
  const [filename, line, row] = err.stack.split('\n')[1].match(/\((.+)\)/)[1].split(':');
  const stacks = err.stack.split('\n').slice(2);
  const fileContent = fs.readFileSync(filename);
  
  console.log(filename, line, row);
  
  res.render('error', { 
    error: err.name,
    message: err.message,
    stack: err.stack,
    filename,
    line,
    row,
    content: fileContent.toString().split('\n').slice(+line - 5, +line + 5).join('\n'),
    stacks: stacks.map(msg => msg.replace('at', '').trim())
  });
})

app.listen(3000);

