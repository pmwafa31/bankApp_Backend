const express = require('express') //import express 
const cors = require('cors') //import cors
const dataservice = require('./services/dataService') //import dataService
const jwt = require('jsonwebtoken') //import json web token

//create server app using express
const server = express()

//use cors to define origin
server.use(cors({
    origin:'http://localhost:4200'
}))

//to parse json data
server.use(express.json())

//set up port number for server
server.listen(3000,()=>{
    console.log('server started at 3000');
})

//token verify middleware
const jwtMiddleware = (req,res,next) =>{
    //get token from request headers
    const token = req.headers['access-token']
    try{
        //verify token
        const verify_token = jwt.verify(token,'secretjanaseva555')
        req.frmAcno = verify_token.currentAcno
        next()
    }
    catch{
        res.status(401).json({
            message:'please login'
        })
    }
}


//register api call
server.post('/register', (req,res)=>{
    dataservice.register(req.body.uname, req.body.acno, req.body.pswd).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//login api call
server.post('/login', (req,res)=>{
    dataservice.login(req.body.acno, req.body.pswd).then((result)=>{
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})

//balance enquiry api call
server.get('/balance_enquiry/:acno',jwtMiddleware, (req,res)=>{
    dataservice.balanceAmt(req.params.acno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//deposit api call
server.post('/deposit',jwtMiddleware, (req,res)=>{
    dataservice.depositAmount(req.body.acno,req.body.amt).then((result)=>{
        res.status(result.statusCode).json(result)

    })
})

//fund transfer api
server.post('/fund_transfer',jwtMiddleware, (req,res)=>{
    dataservice.transferFund(req,req.body.toAcno,req.body.pswd,req.body.amt).then((result)=>{
        res.status(result.statusCode).json(result)

    })
})

//get transactions api
server.get('/transactions',jwtMiddleware, (req,res)=>{
    dataservice.getTransactions(req).then((result)=>{
        res.status(result.statusCode).json(result)

    })
})

//delete account api 
//balance enquiry api call
server.delete('/delete_account/:acno',jwtMiddleware, (req,res)=>{
    dataservice.deleteAccount(req.params.acno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})