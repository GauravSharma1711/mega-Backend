import { Router } from "express";
import { createNote, deleteNote, getNoteById, getNotes, updateNote } from "../controllers/note.controller.js";
import protectRoute from '../middlewares/protectRoute.js'
import {validate}  from '../middlewares/validator.middleware.js'
import {noteCreationValidator,noteUpdationValidator} from '../validators/note.js'

const router = Router()

router.post('/create/:projectId',noteCreationValidator(),validate,protectRoute,createNote);
router.post('/update/:projectId',noteUpdationValidator(),validate,protectRoute,updateNote);
router.get('/delete/:noteId',protectRoute,deleteNote);

router.get('/getNoteById/:noteId',protectRoute,getNoteById);
router.get('/getAllNotes/:projectId',protectRoute,getNotes);

export default router