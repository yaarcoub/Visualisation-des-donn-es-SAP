const  mongoose = require('mongoose')




const countLogin = new mongoose.Schema({

    userId : {type : mongoose.Schema.Types.ObjectId , require:true , ref : 'User'},

    dataLogin : {type : Date , default:Date.now}

})



module.exports = mongoose.model('countLogin',countLogin);