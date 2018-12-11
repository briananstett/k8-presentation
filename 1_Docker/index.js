const express = require('express');
const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  console.log(`Request from ${req.ip}`);
  return res.status(200).send("Hello 24G!");
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})