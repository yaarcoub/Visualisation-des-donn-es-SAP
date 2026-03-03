const  mongoose = require('mongoose');

const UserTache = new mongoose.Schema({

    userId : {type : mongoose.Schema.Types.ObjectId , require:true , ref : 'User'},
    taskId : {type : mongoose.Schema.Types.ObjectId , require:true , ref : 'Tache'},
    
    isRead : { type: Boolean, default: false }
})




module.exports = mongoose.model('UserTache',UserTache);