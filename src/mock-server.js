let counter=0;
var express = require('express');
var server = express();

server.use(express.json())
server.use(express.urlencoded({extended: true}))

server.get('/',(req,res)=>{
  counter++;  
  res.send({
    ...req.query,
    counter
  });
  
  console.log('[GET]',req.body);
})


server.post('/',(req,res)=>{
  counter++;  
  res.send({
    request: req.body,
    counter
  });
  console.log('[POST]', req.body);
})


const port= 3001;
server.use(express.static('.'));
server.listen(port,()=>{
  console.log(`Listening on port ${port}`)
});