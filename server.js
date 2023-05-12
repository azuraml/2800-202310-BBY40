const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3004;

http.createServer((req, res) => {
  fs.readFile(path.join(__dirname, 'app/campy.json'), 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Internal Server Error');
      return;
    }

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Set the response headers
    res.writeHead(200, {'Content-Type': 'text/html'});

    // Create the HTML list
    let htmlList = '<ul>';
    jsonData.forEach((item) => {
      htmlList += `<li><a href="${item.link}">${item.title}</a>`;
      if (item.ed) {
        htmlList += `<span>${item.ed}</span>`;
      }
      htmlList += '</li>';
    });
    htmlList += '</ul>';

    // Send the HTML as the response
    res.end(htmlList);
  });
}).listen(port);

console.log(`Server running on port ${port}`);
