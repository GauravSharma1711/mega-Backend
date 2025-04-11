import express from 'express'
import protectRoute from '../middlewares/protectRoute.js';
import { createSubTask, createTask, deleteSubTask, deleteTask, getTaskById, getTasks, updateSubTask, updateTask } from '../controllers/task.controller';


const router = express.Router();

router.post('/projects/:projectId/users/:assignedTo/tasks', createTask);
router.post('/update/:taskId',protectRoute,updateTask);
router.delete('/delete/:taskId',protectRoute,deleteTask);


router.get('/getTaskById/:taskId',protectRoute,getTaskById);
router.get('/all',protectRoute,getTasks);


router.post('/createSubTask/:taskId',protectRoute,createSubTask);
router.post('/updateSubTask/:subtaskId',protectRoute,updateSubTask);
router.delete('/deleteSubTask/:subtaskId',protectRoute,deleteSubTask);




export default router;