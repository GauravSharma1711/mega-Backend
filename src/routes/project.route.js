import express from 'express'
import { addMemberToProject, createProject, deleteMember, deleteProject, getProjectById, getProjectMembers, getProjects, updateMemberRole, updateProject } from '../controllers/project.controller.js';
import { validate } from '../middlewares/validator.middleware.js';
import { projectCreationValidator,projectUpdationValidator } from '../validators/Project.js';
import  protectRoute  from "../middlewares/protectRoute.js";

const router = express.Router();

router.post('/create',projectCreationValidator(),validate,createProject)
router.post('/update/:projectId',projectUpdationValidator(),validate,protectRoute,updateProject);
router.get('/delete/:projectId',protectRoute,deleteProject);

router.get('/getProjectById/:projectId',protectRoute,getProjectById);
router.get('/getProjects',protectRoute,getProjects);


router.get('/addMemberToProject/:projectId',protectRoute,addMemberToProject);
router.get('/getProjectMembers/:projectId',protectRoute,getProjectMembers);
router.post('/updateMemberRole/:projectId',protectRoute,updateMemberRole)
router.get('/deleteMember/:memberId',protectRoute,deleteMember)
export default router