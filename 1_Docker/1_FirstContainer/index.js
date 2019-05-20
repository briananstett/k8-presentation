const express = require('express');
const app = express();
const port = process.env.PORT | 3000
const path =require('path');

app.use('/images', express.static(path.join(__dirname, 'images')))

app.get('/', (req, res) => {
  // We can view logs of a container with - docker logs <container name|id>
  console.log(`Request from ${req.ip}`);
  return res.status(200).sendFile(__dirname + '/index.html');
})


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})