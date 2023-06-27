const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    email:{
        //string input of user email
        type: String,
        //email is a required field
        required: true,
        //it has to be unique since one email can only be attached to one user
        unique:true,
    },
    password:{
        //password has to be a string
        type: String,
        required:true
    },
    verified:{
        //if the user has been verified or not, defualt is false
        type: Boolean,
        default:false,
    },
    refreshToken:{
        type: String
    }
});

module.exports = model("User", userSchema);