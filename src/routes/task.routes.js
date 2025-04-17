import express from 'express'
import protectRoute from '../middlewares/protectRoute.js';
import { createSubTask, createTask, deleteSubTask, deleteTask, getTaskById, getTasks, updateSubTask, updateTask } from '../controllers/task.controller';
import {validate}  from '../middlewares/validator.middleware.js'
import {taskCreationValidator,taskUpdationValidator,subTaskCreationValidator,subTaskUpdationValidator} from '../validators/task.js'

import { upload } from '../middlewares/multer.middleware.js';


const router = express.Router();

router.post('/projects/:projectId/users/:assignedTo/tasks',upload.fields([
    {
        name:"attachments",
         maxCount:1
    }
]),taskCreationValidator(),validate, createTask);

router.post('/update/:taskId',upload.fields([
    {
        name:"attachments",
         maxCount:1
    }
]),protectRoute,taskUpdationValidator(),validate,updateTask);
router.delete('/delete/:taskId',protectRoute,deleteTask);


router.get('/getTaskById/:taskId',protectRoute,getTaskById);
router.get('/all',protectRoute,getTasks);


router.post('/createSubTask/:taskId',protectRoute,subTaskCreationValidator(),validate,createSubTask);
router.post('/updateSubTask/:subtaskId',protectRoute,subTaskUpdationValidator(),validate,updateSubTask);
router.delete('/deleteSubTask/:subtaskId',protectRoute,deleteSubTask);




export default router;