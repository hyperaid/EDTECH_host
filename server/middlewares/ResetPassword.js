const mailSender = require("../utils/mailSender");
const User=require("../models/User")
const bcrypt=require("bcrypt")

exports.resetPasswordToken = async (req,res)=> {
    try{
        const email=req.body.email;
        const user=await User.findOne({email:email});
        if(!user){
            return res.json({
                success:false,
                message:"your wmail is not registered with us"
            });

        }
        const token= crypto.randomUUID();
        const updatedDetails=await User.findOneAndUpdate(
                                                            {email:email},
                                                                        {
                                                                            token:token,
                                                                            resetPasswordExpires:Date.now() + 5*60*1000,    
                                                                        },
                                                                        {new:true});
                                                                        
        
        



        const url=`http://localhost:3000/update-password/${token}`

        await mailSender(email,"Password reset Link ",`Password reset Link ${url}`);
        return res.json({
            success:true,
            message:"email sent succesfully check your email"
        })
    }
    catch(error){
        console.log(error)
        return res.staus(500).json({
            success:false,
            message:"Something went wrong while resetiing your password "
        })
    }
}


exports.resetPassword= async(req,res)  =>{
    try{
        const {password,confirmPassword,token}=req.body;
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"password ans confirm password doest not match"
            });
        }
        const userDetails=await User.findOne({token:token});
        if(!userDetails){
            return res.json({
                success:false,
                message:"token is invalid"
            });
        }
        if(userDetails.resetPasswordExpires  < Date.now()){
            return res.json({
                success:false,
                message:"token is expired,please regenerate your token"
            });
        }
        const hashedPassword= await bcrypt.hash(password,10);

        await User.findOneAndUpdate(
            {token:token},
            {password:password},
            {new:true}
        );
        return res.status(200).json({
            success:true,
            message:"password reset succesfully"
        });

    }
           
    catch(error){
        console.log(error)
        return res.staus(500).json({
            success:false,
            message:"Something went wrong while resetiing your password "
        })
    }
}