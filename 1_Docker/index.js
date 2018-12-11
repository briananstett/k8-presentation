const express = require('express');
const app = express();
const port = process.env.PORT;

app.get('/', (req, res)=>{
  return res.status(200).send("Hello 24G!");
})

app.listen(port, ()=>{
  console.log(`listening on port ${port}`)
})