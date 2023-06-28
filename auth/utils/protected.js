const { verify } = require("jsonwebtoken");
const User = require("../models/user");

const protected= async (req, res, next) =>{
    const auth = req.headers["authorization"];

    //if tokens don't exist
    if(!auth){
        return res.status(500).json({
            message:"Tokens don't exist!",
            type:"error"
        });
    }
    

    //if token exists => verify it 
    const token = authorization.split(" ")[1];
    let id;

    //verify the token is right using secret key 
    try{
        id = verify(token, process.env.ACCESS_TOKEN_SECRET).id;
    }
    catch(error){
        return res.status(500).json({
            message: "Token is invalid!",
            type:"error"
        });
    }

    // if id does not exist then return error
    if(!id){
        return res.status(500).json({
            message: "Token is invalid!",
            type:"error"
        });
    }

    //token exists, is valid => check if user exists

    const userCheck = await User.findById(id);
    
    if(!userCheck){
        return res.status(500).json({
            message: "User does not exist!",
            type:"error"
        });
    }
    
    req.User = userCheck;
    next();


};

module.exports = { protected };