

const express = require('express');

const router = express.Router();
const {createTache,getTasksById,getTasks
     ,isRead,UpdateDoListe,UpdateEtat,getTodoListe
     , Updatetitle,DeletTask,createTodoList,GetTaskNoRead
     } = require('../controllers/TacheA');

router.route('/CreateTache').post(createTache)

router.route('/getTache/:id').get(getTasksById)
router.route('/getTache').get(getTasks)
router.route('/UpdateIsRead/:id').patch(isRead)
router.route('/UpdateDoListe').patch(UpdateDoListe)
router.route('/UpdateEtat/:id').patch(UpdateEtat)
router.route('/GetSubTasks/:id').get(getTodoListe)
router.route('/Updatetitle').patch(Updatetitle)
router.route('/DeletTask/:id').delete(DeletTask)
router.route('/createTodoList').post(createTodoList)
router.route('/getUserTaskNoRead/:id').get(GetTaskNoRead)

module.exports = router ;


