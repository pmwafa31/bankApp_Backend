const db = require('./db')
const jwt = require('jsonwebtoken') //import json web token
//register
const register =(uname,acno,pswd)=>{
    console.log(uname)
    //check acno is in mongodb
    return db.User.findOne({acno}).then((data)=>{
        if(data){
            //acno already exist
            return {
                statusCode:403,//due to user error
                message:'Account already exist!!'
            }
        }
        else{
            //to add new user
            const newUser = new db.User({
                name:uname,
                acno:acno,
                password:pswd,
                balance:0,
                transactions:[]
            })
            //to save new user in mongoDB
            newUser.save()
            console.log(newUser);
            return {
                statusCode:200,
                message:'Registration successful'
            }
        }
    })
}

//login
const login =(acno,pswd)=>{
    //check acno and pswd in mongodb
    return db.User.findOne({
        acno:acno,
        password:pswd
    }).then((result)=>{
        if(result){
            //generate token    
            const token = jwt.sign({currentAcno:acno},'secretjanaseva555')
            console.log(result)
            return {
                statusCode:200,
                message:'Login successful!!',
                username:result.name,
                currentAcno:acno,
                token
            }
        }
        else{
            return {
                statusCode:404,
                message:'Invalid credentials!!'
            }
        }
    })
}

//to get balance
const balanceAmt =(acno)=>{
    return db.User.findOne({acno}).then((data)=>{
        if(data){
            return{
                statusCode:200,
                balance:data.balance
            }
        }
        else{
            return{
                statusCode:404,
                message:'Invalid account'
            }
        }
    })

}

//to deposit amount in own account
const depositAmount =(acno,amt)=>{
    let amount = Number(amt)
    return db.User.findOne({acno}).then((data)=>{
        if(data){
            data.balance += amount
            data.transactions.push({
                type:"CREDIT",
                fromAcno:acno,
                toAcno:acno,
                amount
            })
            data.save()
            return{
                statusCode:200,
                balance:data.balance,
                message:`Rs. ${amount} successfully deposited`
            }
        }
        else{
            return{
                statusCode:404,
                message:'Invalid account'
            }
        }
    })

}

const transferFund = (req,toAcno,pswd,amt)=>{
    let amount = Number(amt)
    let fromAcno = req.frmAcno
    return db.User.findOne({
        acno:fromAcno,
        password:pswd
    }).then((data)=>{
        if(data){
            let fromAcnoBalance = data.balance
            if(fromAcnoBalance>=amount){
                data.balance = fromAcnoBalance - amount
                data.transactions.push({
                    type:"DEBIT",
                    fromAcno,
                    toAcno,
                    amount
                })
                return db.User.findOne({acno:toAcno}).then(result=>{
                    if(fromAcno == toAcno){
                        return{
                            statusCode:401,
                            message:"Permission denied due to own account transfer"
                        }
                    }
                    if(result){
                        result.balance += amount
                        result.transactions.push({
                            type:"CREDIT",
                            fromAcno,
                            toAcno,
                            amount
                        })
                        result.save()
                        data.save()
                        return{
                            statusCode:200,
                            message:"Successfully transfered"
                        }
                    }
                    else{
                        return{
                            statusCode:401,
                            message:"Invalid credit Account number"
                        }
                    }
                })
            }
            else{
                return{
                    statusCode:403,
                    message:"Insufficient balance"
                }
            }
        }
        else{
            return{
                statusCode:404,
                message:'Invalid debit account number/password'
            }
        }
    })
}
//get all transactions
const getTransactions =(req)=>{
    let acno = req.frmAcno
    return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            return {
                statusCode:200,
                transaction:result.transactions
            }
        }
        else{
            return {
                statusCode:401,
                message:"Invalid Account number"
            }
        }
    })
}

//to delete account
const deleteAccount =(acno)=>{
    return db.User.deleteOne({acno}).then((data)=>{
        if(data){

            return{
                statusCode:200,
                message:"Account deleted successfully"
            }
        }
        else{
            return{
                statusCode:404,
                message:'Invalid account'
            }
        }
    })

}

//export
module.exports = {
    register,
    login,
    balanceAmt,
    depositAmount,
    transferFund,
    getTransactions,
    deleteAccount
}