//import db.js
const db = require("./db");
//import jsonwebtoken
const jwt = require("jsonwebtoken");

//register
const register = (uname, acno, pswd) => {
  //check acno is in mongodb- db.users.findOne()
  return db.User.findOne({
    acno,
  }).then((result) => {
    console.log(result);
    if (result) {
      //acno already exist
      return {
        statusCode: 403,
        message: "Account Already Exist!!!",
      };
    } else {
      //to add new user
      const newUser = new db.User({
        username: uname,
        acno,
        password: pswd,
        balance: 0,
        transaction: [],
      });
      /// to save new user in mongodb use save()
      newUser.save();
      return {
        statusCode: 200,
        message: "Registeration Successfully..",
      };
    }
  });
};
//login
const login = (acno, pswd) => {
  console.log("Inside Login Function Body");
  //check acno,pswd in mongoDb
  return db.User.findOne({
    acno,
    password: pswd,
  }).then((result) => {
    if (result) {
      //generate token
      const token = jwt.sign(
        {
          currentAcno: acno,
        },
        "shooperaada"
      );

      return {
        statusCode: 200,
        message: "login Successfully..",
        username: result.username,
        currentAcno: acno,
        token,
      };
    } else {
      return {
        statusCode: 404,
        message: "Account / Password Invalid",
      };
    }
  });
};
//getBalance
const getBalance = (acno) => {
  //check acno in mongoDb
  return db.User.findOne({
    acno,
  }).then((result) => {
    if (result) {
      return { statusCode: 200, balance: result.balance };
    } else {
      return {
        statusCode: 404,
        message: "Account Invalid",
      };
    }
  });
};
//deposit
const deposit = (acno, amt) => {
  let amount = Number(amt);
  return db.User.findOne({
    acno,
  }).then((result) => {
    if (result) {
      //acno is present db
      result.balance += amount;
      //transaction history key
      result.transaction.push({
        type: "CREDIT",
        fromAcno: acno,
        toAcno: acno,
        amount
      });
      //to update in mongoDB
      result.save();
      return {
        statusCode: 200,
        message: `${amount} successfully deposited...`,
      };
    } else {
      return {
        statusCode: 404,
        message: "Account Invalid",
      };
    }
  });
};

//fund transfer
const fundTransfer = (req, toAcno, pswd, amt) => {
  let amount = Number(amt);
  let fromAcno = req.fromAcno;
  console.log(fromAcno);
  return db.User.findOne({
    acno: fromAcno,
    password: pswd,
  }).then((result) => {
    console.log(result);
    if (fromAcno == toAcno) {
      return {
        statusCode: 401,
        message: "Permission Denied due to own account fund transfer!!! ",
      };
    }
    if (result) {
      //debit account details
      let fromAcnoBalance = result.balance;
      if (fromAcnoBalance >= amount) {
        result.balance = fromAcnoBalance - amount;
        //credit account details
        return db.User.findOne({
          acno: toAcno,
        }).then((creditdata) => {
          if (creditdata) {
            creditdata.balance += amount;
            //transaction history key
            creditdata.transaction.push({
              type: "CREDIT",
              fromAcno,
              toAcno,
              amount
            });
            creditdata.save();
            //TRANSACTON HISTORY
            result.transaction.push({
                type: "DEBIT",
                fromAcno,
                toAcno,
                amount

            })
            result.save();
            return {
              statusCode: 200,
              message: "Amount Transfer Sccessfully",
            };
          } else {
            return {
              statusCode: 401,
              message: "Invalid credit Account number",
            };
          }
        });
      } else {
        return {
          statusCode: 403,
          message: "Insufficient Balance",
        };
      }
    } else {
      return {
        statusCode: 401,
        message: "Invalid Debit Account Number Password",
      };
    }
  });
}
 const getAllTransaction = (req)=>{
  let acno = req.fromAcno
  return db.User.findOne({
    acno
  }).then((result)=>{
    if(result){
       return{
               statusCode:200,
               transaction:result.transaction

       }
    }
    else{
      return {
        statusCode:401,
        message:'invalid Account Number'
      }
    }
  })
 }
 //delete account
 const deleteMyAccount =(acno)=>{
  return db.User.deleteOne({
    acno
  })
  .then((result)=>{
    if(result){
        return{
          statusCode:200,
          message:"Account Deleted Succesfully"    
    }
        }
    else{
     return{
      statusCode:401,
      message:'Invalid Account '
     }

    }
  })
 }

//export
module.exports = {
  register,
  login,
  getBalance,
  deposit,
  fundTransfer,
  getAllTransaction,
  deleteMyAccount
};
