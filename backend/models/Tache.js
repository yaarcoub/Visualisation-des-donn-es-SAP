const  mongoose = require('mongoose');



const Tache = new mongoose.Schema({
     
    title : {type : String , require:true },

     description: {
       type: String,
       required: false 
    },

    dateD : {type : Date , required: true },

    dateF : {type : Date,required: true },

     etat: {
    type: Number,
    enum: [1, 2, 3], // 3 completé,  2 en cours , 1 suspendu ;
    required: true
      },

    importance: {
   type: Number,
   enum: [1, 2, 3], // 1 = basse, 2 = moyenne, 3 = haute
   required: true
    },


    


})



module.exports = mongoose.model('Tache',Tache);