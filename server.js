const express = require('express')
const path = require('path')
let fs = require('fs')
const app = express()
const port = 3000

app.get('/', (req, res) => res.sendFile('index.html', {root: __dirname }))

app.get('/papaya.jpg', function(req, res) {

  res.sendFile('papaya.jpg', {root: __dirname });

})

app.get('/currentreport.txt', function(req, res) {

  var usersFilePath = path.join(__dirname, 'localdb/currentreport.json');

  var readable = fs.createReadStream(usersFilePath);
  readable.pipe(res);

  //res.end(JSON.stringify({ a: 1 }, null, 3));

  //res.sendFile('localdb/currentreport.json', {root: __dirname });

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
