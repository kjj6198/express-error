# Express Beautiful Error print
print stack trace and beautify message.

**WARN: it's not stable now.**

## Why

There's no middleware do logging when exception occurs. So we always print out all stack trace on error page.
It's little bit difficult to debug or inspect sometimes.

## How to use

1. use it as normal express middleware.

```javascript
const app = require('express')();
const errorBeautify = require('express-error');
app.use(errorBeautify());
```

2. cause some error in your code.
```javascript
app.get('/', function(req, res) {
  res.renders('index');
})
```

3. check if error page show up.

## TODO

- [ ] move function to middleware.
- [ ] customize error page.
- [ ] make interactive REPL more realistic.


<img width="1678" alt="2017-10-31 1 47 38" src="https://user-images.githubusercontent.com/6581081/32209231-3dc9cd18-bdd5-11e7-8e55-86676e1a3bcd.png">

## LICENSE
MIT