
const countLogin = require('../models/CountLogin')
const BadRequestError = require('../errors/Bad-request')

const countforUser = async (id)=>{

    const count = await countLogin.countDocuments({userId : id})
    if(!count) throw new BadRequestError(' user not found ')

        return count ;
}

const countforAllUsers = async () =>{
  const res = await countLogin.aggregate([
   {
    $group : {
        _id : '$userId',
        count: { $sum : 1}
    }},

    {
     $project: {
        userId: '$_id',
        count: 1,
        _id: 0
      }
    }

  ])


  return res ;
}



module.exports = {countforUser , countforAllUsers} ;