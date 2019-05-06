var ndjson = require('ndjson')
let fs = require('fs')

let file_location = "./localdb/currentreport.json";

fs.createReadStream(file_location)
  .pipe(ndjson.parse())
  .on('data', function(obj) {
    // obj is a javascript object

    console.log(obj)

  })
