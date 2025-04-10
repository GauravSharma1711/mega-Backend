import express from 'express'
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from '../controllers/project.controller.js';
import { validate } from '../middlewares/validator.middleware.js';
import { projectCreationValidator,projectUpdationValidator } from '../validators/Project.js';
import  protectRoute  from "../middlewares/protectRoute.js";

const router = express.Router();

router.post('/create',projectCreationValidator(),validate,createProject)
router.post('/update/:projectId',projectUpdationValidator(),validate,protectRoute,updateProject);
router.get('/delete/:projectId',protectRoute,deleteProject);
router.get('/getProjectById/:projectId',protectRoute,getProjectById);
router.get('/getProjects',protectRoute,getProjects);

export default router