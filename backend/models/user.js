const mongoose = require('mongoose');
const crypto = require('crypto');
const {v4: uuidv4} = require('uuid');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        //remove spaces
        trim: true,
        required: true,
        maxlength:32
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
   // saving the hashed password and not the password from user directly
   hashed_password:{
        type: String,
        required: true,
    },
    about:{
        type: String,
        //remove spaces
        trim: true,
    },
    //salt to generate the hashed password
    salt:{
        type:String
    },
    role:{
        type:Number,
        default: 0
    },
    history:{
        type: Array,
        default:[]
    }
},{timestamps: true});

//virtual field
//Take the password from user and saving the hashed one
userSchema.virtual('password')
.set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.hashed_password = this.encryptPassword(password);
})
.get(function () {
    return this._password;
});

userSchema.methods = {
    encryptPassword: function (password) {
        if(!password)return'';
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        }catch (e) {
            return "";
        }
    }
};

module.exports = mongoose.model("User", userSchema);