var express = require('express');
var app = express();

app.get('/', function (req, res) {
  //   res.send('hello ');
  //   res.send(' world');
  res.write('hello');
  res.write('<br>dodo');
  res.end();
});


module.exports = function () {
  app.listen(9091);

  console.log('server on 9091');
};