const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User")

exports.auth =async (req,res,next) =>{
    try{
        const token=req.cookies.token ||req.body.token || req.header("Authorization").replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing", 
            });
        }

        // verify the token
        try{
            const decode=  jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        }
        catch(error){
            console.log(error);
            return res.status(401).json({
                success:false,
                message:"token is not valid"
            });
        }
        next();

    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'something wetn wrong while validating the token'
        }); 
    }
}


exports.isStudent= async (req,res,next) =>{
    try{
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success:false,
                message:"this is a protected route for students only "
            })
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot br verified, Please try again"
        })
    }
}


//for instructor

exports.isInstructor= async (req,res,next) =>{
    try{
        if(req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success:false,
                message:"this is a protected route for Instructor only "
            })
        }
        next();
        
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot br verified, Please try again"
        })
    }
}

//for admmin
exports.isAdmin= async (req,res,next) =>{
    try{
        if(req.user.accountType !== "Admin") {
            return res.status(401).json({
                success:false,
                message:"this is a protected route for Admin only "
            })
        }
        next();
        
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot br verified, Please try again"
        })
    }
}