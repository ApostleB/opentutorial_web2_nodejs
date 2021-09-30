var folder = './data'
let fs = require('fs');

fs.readdir(folder, (err, files) => {
  files.forEach((file) => {
    console.log(file);
  });
});
