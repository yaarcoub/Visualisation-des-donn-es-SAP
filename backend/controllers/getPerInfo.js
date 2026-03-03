



const getInfo = (req,res) =>{
    res.status(200).json({name:req.user.name , _id : req.user.userId})
}

module.exports = {getInfo} ;