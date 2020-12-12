const User = require("../models/User.model")
const bcrypt = require("bcryptjs");
const {Error} = require("mongoose");


const signIn = async (req,res,next) => {
    try{
        const {user,password,email} = req.body;
        console.log(user,password,email);

    }catch(err){
        console.error(err);
    }
} 

const logIn = async (req,res,next) => {
    try{
        const {user,password} = req.body;
        console.log(user,password);

    }catch(err){
        console.error(err);
    }
} 

const logOut = async (req,res,next) => {
    try{
        

    }catch(err){
        console.error(err);
    }
} 






module.exports = {logIn,signIn, logOut};

