const { sign } = require("jsonwebtoken");
// creating JWTS 

//first JWT - access Token
const createAccessToken= (id) =>{
    return sign({id}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 15*60
    });
};

//send access Token to client
const sendAccessToken = (_req, res, accessToken)=>{
    res.json({
        accessToken,
        message:"Sign in successful!",
        type:"success"
    }
    );
};

//second JWT - Refresh Token 
const createRefreshToken= (id) =>{
    return sign({id}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "90d"
    });
};

//send Refresh Token as a cookie to client
const sendRefreshToken = (res, refreshToken)=>{
    res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
      });

};

//create email token 
const createEmailToken = (id) =>{
    return sign({id}, process.env.EMAIL_TOKEN_SECRET,{
        expiresIn:'1h'
    });
};

//send email token 
const sendEmailToken = (_req, res, emailToken)=>{
    res.json({
        emailToken,
        message:"Email verification is successful!",
        type:"success"
    }
    );
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken,
    createEmailToken,
    sendEmailToken
  };
  