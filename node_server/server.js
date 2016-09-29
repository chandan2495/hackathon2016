var express = require('express');
var app = express();

app.get('/hello', function (req, res) {
  res.send('Server is live');
});

app.listen(3000, function () {
  console.log('Server running on port 3000!');
});