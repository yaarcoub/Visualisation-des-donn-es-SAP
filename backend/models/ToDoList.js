const  mongoose = require('mongoose');

const doListe = new mongoose.Schema({

    taskId : {type : mongoose.Schema.Types.ObjectId , require:true , ref : 'Tache'}, 
    title: { type: String }, 
    done: { type: Boolean, default: false }  
   
})




  module.exports = mongoose.model('ToDoliste',doListe);