//imports cors in  index.js
const cors = require('cors')


//Import express inside index,js

const express = require('express')

//import data service 

const dataService = require('./services/dataService')

//Import jsonwebtoken
const jwt = require('jsonwebtoken')

//create server app using express

const server = express()

//use cors

server.use(cors({
    origin:'http://localhost:4200'
}))

//set up port for server app
server.listen(3000,()=>{
    console.log('server started at 3000');
})

//to parse json data

server.use(express.json())

//application specific middleware
const appMiddleware = (req,res,next)=>{
  console.log('Inside application specific middleware');
  next()
}

server.use(appMiddleware) 
  


//token verify middleware
const jwtmiddleware =(req,res,next)=>{
  console.log('Inside router specific middleware');
  //get token from req headers
  const token = req.headers['access-token']
  console.log(token);

//verify token
try {const data=jwt.verify(token,'shooperaada')
console.log(data);
req.fromAcno = data.currentAcno
console.log('Valid Token');
next()
}
catch{
  console.log('Invalid Token');
  res.status(401).json({
    message:'Please Login!!'
  })
}


}

//get http api call

server.get('/',(req,res)=>{
  res.send('GET METHOD')
})
//POST HTTP API CALL

server.post('/',(req,res)=>{
    res.send('POST METHOD')
  })

  server.put('/',(req,res)=>{
    res.send('PUT METHOD')
  })

  
  server.delete('/',(req,res)=>{
    res.send('DELETE METHOD')
  })

//register api call resolving
  server.post('/register',(req,res)=>{
    console.log('Inside Register Body');
    console.log(req.body);
   //asynchronus
    dataService.register(req.body.uname,req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
      
    })
  })

  //LOGIN api call resolving
  server.post('/login',(req,res)=>{
    console.log('Inside login Body');
    console.log(req.body);
   //asynchronus
    dataService.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
      
    })
  })
   //getBalance api call
   server.get('/getBalance/:acno',jwtmiddleware,(req,res)=>{
    console.log('Inside getBalance Body');
    console.log(req.params.acno);
   //asynchronus
    dataService.getBalance(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
      
    })
  })
   //deposit api call
   server.post('/deposit',jwtmiddleware,(req,res)=>{
    console.log('Inside deposit Body');
    console.log(req.body);
   //asynchronus
    dataService.deposit(req.body.acno,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
      
    })
  })

  //fundTransfer api call
  server.post('/fundTransfer',jwtmiddleware,(req,res)=>{
    console.log('Inside fundTransfer Api');
    console.log(req.body);
   //asynchronus
    dataService.fundTransfer(req,req.body.toAcno,req.body.pswd,req.body.amount)
    .then((result)=>{
      
        res.status(result.statusCode).json(result)
      
    })
  })
  //getAllTransaction api call
  server.get('/all-transactions',jwtmiddleware,(req,res)=>{
    console.log('Inside getAllTransaction Api');
   
   //asynchronus
    dataService.getAllTransaction(req)
    .then((result)=>{
      
        res.status(result.statusCode).json(result)
      
    })
  })

  //delete-account api call


  server.delete('/delete-account/:acno',jwtmiddleware,(req,res)=>{
    console.log('Inside delete-account Body');
    console.log(req.params.acno);
   //asynchronus
    dataService.deleteMyAccount(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
      
    })
  })