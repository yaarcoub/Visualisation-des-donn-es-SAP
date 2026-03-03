const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
mongoose.set('bufferCommands', false);

const UserSchema = new mongoose.Schema({
  name:{
   type:String
  },
    email:{
    type:String,
            required:[true, 'please provide email'],
            match:[
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please  email is not match',
            ],
            unique:true,
  },
password:{
    type:String,
    required:[true, 'please provide password'],
            
},
userType : {
  type : Boolean,
  default:false
},

etat : {
  type : Boolean,
  default:true
},

path: String,


})

  //middleware
UserSchema.pre('save',async function () {
  const salt = await bcrypt.genSalt(10);

     this.password = await bcrypt.hash(this.password,salt);
})


UserSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();
    
    if (update.password) {
        update.password = await bcrypt.hash(update.password, 10);
    }
    next();
});

UserSchema.methods.compairePassword =async function(pass){
    const isMatch = await bcrypt.compare(pass,this.password);
    return isMatch ;
}

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
     'JWT_SECRET',
    {
      expiresIn: '3d',
    }
  )
}


module.exports = mongoose.model('User',UserSchema);