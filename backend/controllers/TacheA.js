const BadRequestError = require('../errors/Bad-request')
const Tache = require('../models/Tache')
const UnauthenticatedError = require('../errors/unauthenticated')
const NotFoundError = require('../errors/NotFound')
const User = require('../models/User')
const { sendTaskNotification } = require('./Socket');
const UserTache = require('../models/UserTache');
const doListe = require('../models/ToDoList');







const createTache = async (req,res)=>{
    const { emails ,  title , dateD , dateF,description  ,importance , TodoTitles} = req.body
        console.log(1)

    if(emails.length ===0 || !title || !dateD || !dateF || !importance || TodoTitles.length ===0 || !description){
     throw new BadRequestError('please provide all information')
    }
    console.log(1)

    
    const users = await User.find({ email: { $in: emails } });
     console.log(2)
    if(users.length !== emails.length)throw new BadRequestError(' somme of users not exist ');
    

  // creat task
   const task = await Tache.create({ title, dateD ,dateF,description ,importance,etat :1})
   // add to do liste  in Collection 
   const itemsToInsert = TodoTitles.map(title => ({
    taskId: task._id,
     title:title.title
    }));
    const doListeDocuments =  await doListe.insertMany(itemsToInsert);

  


  //add task for users
   console.log(task);
    let validation = true ;
    for (const user of users) {
    const resulta =  await UserTache.create({
    userId: user._id,
    taskId: task._id,
    lu: false
    });
   validation = sendTaskNotification(user._id.toString(),task)&&validation 
}


     if (!validation) {
    res.status(201).json({
      task ,
      users,
      doListeDocuments
    });
  } else {
    throw new BadRequestError('Some users are not connected now');
  }
    
}


const DateTasks = async (tasksid)=>{
   const starts = await Tache.aggregate([
    { $match: { _id: { $in: tasksid } } },
    {$group: {_id: { $dateToString: { format: "%Y-%m-%d", date: "$dateD" } },count: { $sum: 1 }}},
    { $sort: { _id: 1 } }
  ]);
  const ends = await Tache.aggregate([
    { $match: { _id: { $in: tasksid } } },
    {$group: {_id: { $dateToString: { format: "%Y-%m-%d", date: "$dateF" } },count: { $sum: 1 }}},
    { $sort: { _id: 1 } }
  ]);
  const resultMap = {};
for (const item of starts) {
  resultMap[item._id] = {
    date: item._id,
    startTasks: item.count,
    endTasks: 0
  };
}
console.log(resultMap)
for (const item of ends) {
  if (resultMap[item._id]) {
    resultMap[item._id].endTasks = item.count;
  } else {
    resultMap[item._id] = {
      date: item._id,
      startTasks: 0,
      endTasks: item.count
    };
  }
}
console.log(resultMap)
const result = Object.values(resultMap).sort((a, b) => new Date(a.date) - new Date(b.date));
 return result ;
}
const Importance = async (tasksid)=>{

  const importanceStats = await Tache.aggregate([
  { $match: { _id: { $in: tasksid } } },
  {
    $group: {
      _id: "$importance", 
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);

  const mapped = importanceStats.map(item => ({
  importance:
    item._id === 1 ? 'basse' :
    item._id === 2 ? 'moyenne' :
    item._id === 3 ? 'haute' : 'inconnue',
  count: item.count
}));


 return mapped ;

}
const Etat = async (tasksid)=>{
  const etatStats = await Tache.aggregate([
  { $match: { _id: { $in: tasksid } } },
  {
    $group: {
      _id: "$etat", // 1, 2, ou 3
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);

const mapped = etatStats.map(item => ({
  etat:
    item._id === 1 ? 'suspendu' :
    item._id === 2 ? 'en cours' :
    item._id === 3 ? 'complété' : 'inconnu',
  count: item.count
}));

 return mapped ;
}


const getTasksById = async (req,res)=>{
    const {id} = req.params ;
    
   const userTasks = await UserTache.find({ userId :id })
    .populate('taskId'); 
   
  const tasks = userTasks.map(ut => ({
    _id: ut.taskId._id,
    title: ut.taskId.title,
    description: ut.taskId.description,
    dateD: ut.taskId.dateD,
    dateF: ut.taskId.dateF,
    etat: ut.taskId.etat,
    importance: ut.taskId.importance,
    doListe: ut.taskId.doListe,
    isRead: ut.isRead
  }));

   const tasksid  = userTasks.map(ut => (
     ut.taskId._id
  ));

   const dates = await DateTasks(tasksid);
   const importanceStats = await Importance(tasksid)
   const Etats = await Etat(tasksid)

    res.status(200).json({tasks , dates,importanceStats ,Etats});

}


const getTasks = async (req,res)=>{

  const tasks = await Tache.find({})
  console.log(tasks);
  const tasksid  = tasks.map(taskId => (
     taskId._id
  ));
   const dates = await DateTasks(tasksid);
   const importanceStats = await Importance(tasksid)
   const Etats = await Etat(tasksid)
  res.status(200).json({  tasks , dates , importanceStats , Etats });

}


const UpdateEtat = async (taskId)=>{
  
  const done = await doListe.find({ taskId, done: true });
  const Notdone = await doListe.find({ taskId, done: false });
  console.log(Notdone)
  if(Notdone.length === 0 ){
    const task = await Tache.updateOne(
      {_id : taskId },
      { etat : 3 } ,
      {new:true  }
    );
   return 3;
   } 
   
   if(done.length === 0 ){
    const task = await Tache.updateOne(
      {_id : taskId },
      { etat : 1 } ,
      {new:true  }
    );
   return 1;
   } 
   if(Notdone.length !==0 && done.length !== 0){
     const task = await Tache.updateOne(
      {_id : taskId },
      { etat : 2 } ,
      {new:true  }
    );
   return 2;
   }

}
const UpdateDoListe = async (req,res)=>{
  const {updates} = req.body

 
const result = await Promise.all(
               updates.map(update =>
               doListe.findByIdAndUpdate({_id:update.subTaskId}, { done: update.done}, { new: true })
            ));
   

    if(!result) throw new BadRequestError('bad taskId or subTaskId');

   const etat =  await UpdateEtat(result[0].taskId)
    res.status(200).json({ result , etat });

}
const Updatetitle  = async (req,res)=>{
 const {title , subTaskId} = req.body ;

 const result =  await doListe.findByIdAndUpdate({_id:subTaskId}, { title}, { new: true })
 res.status(200).json({ result });

}
const DeletTask  = async (req,res)=>{
 const {id} = req.params ;

 const result =  await doListe.findByIdAndDelete({_id:id}, { new: true })
 res.status(200).json({ result });

}
const createTodoList = async (req,res)=>{
  const {taskId , title} = req.body ;
  const result = await doListe.create({taskId , title});
  if(!result)throw new BadRequestError('this Task dose not created ');

  res.status(200).json({ result });

}
const getTodoListe = async (req,res)=>{
   const {id} = req.params ;
   const Subtasks = await doListe.find({taskId :id})
    if(Subtasks.length === 0){
        throw new BadRequestError('this user dose not have tasks to do')    
    }

  res.status(200).json({Subtasks});

}
const isRead = async (req , res)=>{
  const  userId  = req.params.id; 

  const newVal = await UserTache.updateMany(
      {  userId , isRead:false},
      { isRead:true }, 
      { new:true , runValidators: true }
    )
    

  if(!newVal)throw new NotFoundError('Not found');
  res.status(200).json({newVal});
}
const GetTaskNoRead = async (req,res)=>{
    const  userId  = req.params.id; 

  const updatedTaches = await UserTache.find({ userId })
  .populate('taskId');

  const noRead = await UserTache.find({ userId  , isRead:false})
  
  
    if(!updatedTaches)throw new NotFoundError('Not found data');

     res.status(200).json({updatedTaches , NoRead : noRead.length });


}


module.exports = {createTache, getTasksById, getTasks,UpdateDoListe
   , isRead,UpdateEtat,getTodoListe
    ,Updatetitle,DeletTask , createTodoList ,GetTaskNoRead}