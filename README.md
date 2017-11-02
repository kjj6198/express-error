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


![2017-11-02 5 59 27](https://user-images.githubusercontent.com/6581081/32320107-ba679d58-bf8a-11e7-9117-9296af4933ea.png)

## LICENSE
MIT