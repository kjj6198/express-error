const fs = require('fs');

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

function configureErrorHandler(config) {

  return function errorHandler(err, req, res, next) {
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
        content: fileContent
          .toString()
          .split('\n')
          .slice(+line - 5, +line + 5)
          .map((c, index) => index === 4 ? `<span class="linenumber">${lineStart + index + 1}</span> <span class="highlight">${c}</span>\n${padding(row - 1) + '^'}` : `<span class="linenumber">${+lineStart + index + 1}</span> ${c}`)
          .join('\n'),
        stacks: stacks.map(msg => msg.replace('at', '').trim())
      });
    
      app.post('/error', (errReq, errRes) => {
        errRes.json(analzeStack(errReq.body.path));
      });
  }
}
