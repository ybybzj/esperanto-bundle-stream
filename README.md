#module for create a readable stream of a esperanto bundle
##Usage
```js
  var esperantoStream = require('esperanto-bundle-stream');
  esperantoStream({
    base:'src',
    entry:'index.js', //required
    sourceMap: true, //default false, and only support 'inline' mode
    type: 'umd', //type: 'umd', 'cjs', 'amd', 'concat'(selfExecute)
    .... // refer to 'esperanto' official document
  }).pipe(process.stdout);
```