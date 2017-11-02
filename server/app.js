const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const util = require('util');
const vm = require('vm');

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '../views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  throw new TypeError('range out of bound. Please check http://kjj6198.github.io for more information.')
});

const padding = (time) => {
  let str = '';
  for (let i = 0; i < time; i++) {
    str += ' ';
  }

  return str;
};

function analzeStack(filepath) {
  const [filename, line, row] = filepath.split(':');
  if (fs.existsSync(filename)) {
    const fileContent = fs.readFileSync(filename);
    const lineStart = +line - 5;
    return {
      filename,
      content: fileContent
        .toString()
        .split('\n')
        .slice(lineStart, +line + 5)
        .map((c, index) => index === 4 
          ? `<span class="linenumber">${lineStart + index + 1}</span> <span class="highlight">${c}</span>\n${padding(row - 1) + '^'}` 
          : `<span class="linenumber">${+lineStart + index + 1}</span> ${c}`)
        .join('\n'),
      line,
      row
    };
  }
  return null;
}

app.use((err, req, res, next) => {
  // console.log(req);
  const [filename, line, row] = err.stack.split('\n')[1].match(/\((.+)\)/)[1].split(':');
  const stacks = err.stack.split('\n').slice(1);

  if (!fs.existsSync(filename)) {
    return res.render({
      error: err.name,
      message: err.message,
      filename,
      line,
      row,
      content: '',
      stacks: stacks.map(msg => msg.replace('at', '').trim())
    });
  }

  const fileContent = fs.readFileSync(filename);

  const lineStart = +line - 5;
  res.render('error', {
    error: err.name,
    message: err.message,
    stack: err.stack,
    filename,
    line,
    row,
    headers: req.headers,
    request: util.format(req),
    params: JSON.stringify(req.params),
    content: fileContent
      .toString()
      .split('\n')
      .slice(+line - 5, +line + 5)
      .map((c, index) => index === 4 ? `<span class="linenumber">${lineStart + index + 1}</span> <span class="highlight">${c}</span>\n${padding(row - 1) + '^'}` : `<span class="linenumber">${+lineStart + index + 1}</span> ${c}`)
      .join('\n'),
    stacks: stacks.map(msg => msg.replace('at', '').trim())
  });

});

app.post('/error/run', (runReq, runRes) => {
  const { script } = runReq.body;

  const debugContext = vm.createContext({
    request: runReq,
    response: runRes,
    util: require('util'),
    Buffer: require('buffer').Buffer,
    stream: require('stream'),
    console: {
      log: util.format
    },
    clear: ''
  });

  try {
    const result = vm.runInContext(script, debugContext);
    return runRes.json({ result });
  } catch (error) {
    return runRes.status(400).json({ error: error.stack });
  }
});

app.post('/error', (errReq, errRes) => {
  errRes.json(analzeStack(errReq.body.path));
});

app.listen(3000);

