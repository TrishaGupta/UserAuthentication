var express = require("express");
var router = express.Router();
const { hash, compare } = require("bcryptjs");
const { verify } = require("jsonwebtoken");
const sendEmail = require('../utils/emails.js');

const { createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken,
    sendEmailToken,
    createEmailToken} = require("../utils/tokens");
const { protected } = require("../utils/protected");

//importing the user model
const user = require("../models/user");


//posting sign up action
router.post("/signup", async(req, res)=>{
    
    
    //try creating new user and adding to the database
    try{

        const {newEmail, newPassword} = req.body;
        const email = newEmail;
        const password = newPassword;
        //console.log(req);
        console.log("tomato");

        // check if user already exists 
        const userCheck = await user.findOne({email:email});
        
        if(userCheck){
            return res.status(500).json({
                message: "Email already exists! Try logging in using it.",
                type: "warning"
            });
            
        }
        
        let hashPassword;
        // if new user then hash password with salt length 15
        try{
        hashPassword = await hash(password,10);
        }
        catch(error){
            console.log(error);
        }
       
        // create new user for database
        const newUser = new user({
            email: email,
            password: hashPassword
        });

    
        await newUser.save();
    
        let verifyResponse;
        try{
             verifyResponse = sendEmail(null,email);
        }
        catch(error){
            console.log(error);
        }
        if (verifyResponse == 200){
            console.log("Route to a new page");
        }
        res.status(200).json({
            message: "User created successfully!",
            type:"success"
        });

    }
    //if unable to create and add new user to database 
    catch(error){
        res.status(500).json({
            type: "error",
            message: "Error creating User",
            error,
        });

    }
});



//posting Sign In request
router.post("/signin", async(req,res)=>{
    try{
        console.log("Sign In");

        const{email, password} = req.body;
        const userCheck = await user.findOne({email:email});
        console.log(userCheck.verified);
   

        //if user does not exist
        if(!user){
            return res.status(500).json({
                message:"User does not exist!",
                type:"error"
            });
        }

        //compare if the passwords match
        const isMatch = await compare(password, userCheck.password);
        //is passwords don't match send error

        if(!isMatch){
            return res.status(500).json({
                message:"Password is incorrect!",
                type:"error"
            });
        }

        if(!userCheck.verified){
            return res.status(500).json({
                message:"Your email is not verified! Verify email and try again.",
                type:"error"
            });
        }

        //password is correct so create tokens
        const accessToken = createAccessToken(userCheck._id);
        const refreshToken = createRefreshToken(userCheck._id);
        


        userCheck.refreshToken = refreshToken;
        await userCheck.save();
       

        //send response to tokens 
        sendAccessToken(req, res, accessToken);
        sendRefreshToken(res, refreshToken);
    }
    catch(error){
        res.status(500).json({
            type: "error",
            message: "Error signing in!",
            error,
          });
    }
});

//logout request
router.post("/logout", (_req, res) => {
    // clear cookies
    res.clearCookie("refreshtoken");
    return res.json({
      message: "Logged out successfully!",
      type: "success",
    });
  });


  //refresh token request

  router.post('/refresh_token', async (req, res) =>{
    try{
        const { refreshToken } = req.cookies;

        //if refreshToken does not exist 
        if(!refreshToken){
            return res.status(500).json({
                message: "Refresh token does not exist!",
                type:"error"
            });
        }

        // token exists, verifying it
        let id;
        try{
            id = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET).id;
        }
        catch(error){
            return res.status(500).json({
                message:"Invalid Refresh Token!",
                type:"error"
            });
        }

        // if token is invalid
        if(!id){
            return res.status(500).json({
                message:"Invalid Refresh Token!",
                type:"error"
            });
        }

        // token exists, is valid => check if user exists 
        const userExists = await user.findById(id);

        //if user does not exist 
        if(!userExists){
            return res.status(500).json({
                message:"User does not exist!",
                type:"error"
            });
        }

        //user exists => check is refresh token us correct
        const tokenCheck = await compare(userCheck.refreshToken, refreshToken);
        if(!tokenCheck){
            return res.status(500).json({
                message:"Invalid Refresh Token!",
                type:"error"
            });
        }

        //refresh token is valid, create new tokens 
        const newAccessToken = createAccessToken(userCheck._id);
        const newRefreshToken = createRefreshToken(userCheck._id);

        //set new refreh token
        userCheck.refreshToken= newRefreshToken;
        //send new token
        sendRefreshToken(res, newRefreshToken);
        //send with access token
        return res.json({
            message: "Refreshed successfully!",
            type: "success",
            newAccessToken,
          });
    }
    catch (error) {
        res.status(500).json({
          type: "error",
          message: "Error refreshing token!",
          error,
        });
      }
  });

router.post('/confirm', async(req, res)=>{
    const emailObj = req.body;
    const email = emailObj.email;
   
    const userCheck = await user.findOne({email:email});


    // find user
    
    

    if(!userCheck){
         return res.status(500).json({
            type: "error",
            message: "User does not exist!",
            error,
          });
    }
    userCheck.verified = true;
    await userCheck.save();

    return res.json({
        message:"Email verified!",
        type:"success"
    });
    
    
});

// protected route request

router.post('/protected', protected, async(req,res) =>{
    try{
        if (req.user)
      return res.json({
        message: "You are logged in!",
        type: "success",
        user: req.user,
      });
    // if user doesn't exist, return error
    return res.status(500).json({
      message: "You are not logged in!",
      type: "error",
    });
    }
    catch(error){
        return res.status(500).json({
            type:"error",
            message:"Error getting protected route!",
            error
        });
    }
});

module.exports = router;

