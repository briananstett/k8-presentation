const express = require('express');
const app = express();
const route = require('./middle_ware/mainRoute.js');
const path = require('path');

app.use('/static', express.static(path.join(__dirname, "html/static")));

app.get('/', route);

app.get('/cpu', (req,res,next)=>{
  let x = .0000001;
  for(i = 0; i <= 100000000; i++){
    Math.sqrt(x);
  }
  res.send('OK');
  return 
})

app.get('/logs', (req, res, next) => {
  const information = {
    ip: req.ip,
    verb: req.method,
    path: req.path
  };
  console.log(information);
  return res.json(information)
})

app.listen(3000, () => { console.log("You fixed it! Listening on port 3000") });
