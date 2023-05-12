const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

http.createServer((req, res) => {
  // Read the campy.json file
  fs.readFile(path.join(__dirname, 'campy.json'), 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Internal Server Error');
      return;
    }

    // Set the response headers
    res.writeHead(200, {'Content-Type': 'application/json'});

    // Send the JSON data as the response
    res.end(data);
  });
}).listen(port);

console.log(`Server running on port ${port}`);

const campyList = document.querySelector("#campy-list");

fetch("campy.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((item) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.link;
      link.textContent = item.title;
      listItem.appendChild(link);
      campyList.appendChild(listItem);
    });
  });
