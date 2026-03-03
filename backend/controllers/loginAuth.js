const BadRequestError = require('../errors/Bad-request')
const UnauthenticatedError = require('../errors/unauthenticated')
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User')

const countLogin = require('../models/CountLogin');
const {countforUser,countforAllUsers} = require('./statistique');
const NotFoundError = require('../errors/NotFound');
const { use } = require('../routes/Login_Register_R');



const Login = async (req,res)=>{
    const {email,password} = req.body
    
    if(!email || !password){
        throw new BadRequestError('please provide email and password')    
    }
       
        const user = await User.findOne({email})
              
       if(!user){
         throw new UnauthenticatedError('Please enter a valid email address')
       }

        const isPassword = await user.compairePassword(password);

        if(!isPassword)throw new UnauthenticatedError('bad password');

        const token = await user.createJWT();
          
        res.status(200).json({msg: " Connected successfully " ,user  , token }); 


}




const Register = async (req,res)=>{
       if (!req.file) {
         throw new BadRequestError('No File Upload')
    }
    const path = req.file.path;
    const userType = req.body.userType === 'true' || req.body.userType === true;
    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        userType,
        path
    };
    console.log(userData);
    const user = await User.create(userData);
    res.status(StatusCodes.CREATED).json({ msg: "created", user });
    }


    const get_Type = async (req,res)=>{
        const user =  await User.findById(req.params.id)
    let URL_Image = false;
    if (user.path) {
        const normalizedPath = user.path.replace(/\\/g, '/');
        URL_Image = `http://localhost:3000/${normalizedPath}`;
    }

           res.status(StatusCodes.CREATED).json({userType : user.userType , URL_Image});
    }


   const Change_Password = async (req, res) => {
    const { newPassword, newName } = req.body;
    const path  = req.file.path ;
    if (!newPassword && !newName) {
        throw new BadRequestError('please provide  password or name for update');
    }
     
    if(path){
         const user = await User.findByIdAndUpdate(
         req.params.id,
        { path:path },
        { new: true } 
    );
   }

     if(newPassword && newName){
       const user = await User.findByIdAndUpdate(
        req.params.id,
        { password: newPassword, name: newName },
        { new: true } 
    );
    const token = await user.createJWT();
    res.status(StatusCodes.OK).json({msg : 'You have successfully updated your password and name' ,user,token });
     }

      if(newPassword){
       const user = await User.findByIdAndUpdate(
        req.params.id,
        { password: newPassword },
        { new: true } 
    );
        const token = await user.createJWT();

    res.status(StatusCodes.OK).json({msg:'You have successfully updated your password', user,token });
     }

      if( newName){
       const user = await User.findByIdAndUpdate(
        req.params.id,
        {name: newName },
        { new: true } 
    );
        const token = await user.createJWT();
    res.status(StatusCodes.OK).json({msg:'You have successfully updated your name', user ,token});
     }

    
};
const getUsers = async (req,res)=>{

    const users0 = await User.find({} , { name: 1, email: 1, userType: 1,_id:1 , etat:1 ,path:1})
    
    if(users0.length === 0)throw new BadRequestError('No user Selected');
     const users = users0.map(user => (
        {
    ...user._doc,
    imageUrl: `${user.path ? `http://localhost:3000/${user.path}` : '' }`
  } 
  
));
  console.log(users)
    
    res.status(StatusCodes.OK).json({users})


}
const UpdateEtat = async (req,res) =>{
    const {id , etat} = req.body
   const user = await User.findByIdAndUpdate( {_id:id} , {etat} , {new:true})
   if(!user) throw new BadRequestError('this user dose not exist ');
    res.status(StatusCodes.OK).json({user})
}
 
 
 
 
module.exports = {
    Login,
    Register,
    get_Type,
    Change_Password,
    getUsers,
    UpdateEtat
}