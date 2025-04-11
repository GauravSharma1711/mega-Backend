
import asyncHandler from "../utils/async-handler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ProjectNote  from "../models/projectNote.model.js"
import Project from '../models/project.model.js'

const getNotes = async (req, res) => {
    // get all notes
    const curLoggedInUser = req.user.id;
    const projectId = req.params.projectId;

    const allnotes = await ProjectNote.find({
        project:projectId,
        createdBy:curLoggedInUser
    })
    if(!allnotes){
    throw new ApiError(403,"note authorized to get note");
    }

    return res.status(200).json(
        new ApiResponse(200,{message:"got all note successfully",allnotes})
    )


  };
  
  const getNoteById = async (req, res) => {
    // get note by id
    const noteId = req.params.noteId;
    const curLoggedInUser = req.user.id;

    const note = await ProjectNote.findById(noteId);
    if(!note){
        throw new ApiError(404,"note not found");
    }

    if(note.createdBy.toString()!==curLoggedInUser.toString()){
        throw new ApiError(403,"note authorized to get note");
    }


    return res.status(200).json(
        new ApiResponse(200,{message:"got all note successfully",note})
    )

  };
  
  const createNote = async (req, res) => {
    // create note

    const {content}  =req.body
const projectId  = req.params.projectId;
    const curLoggedInUser = req.user.id;

    const project = await Project.findById(projectId);
    if(!project){
        throw new ApiError(404,"Project not found")
    }

    if(project.createdBy.toString()!==curLoggedInUser.toString()){
        throw new ApiError(403,"not authorized to add note")
    }

    const note = new ProjectNote({
        project:projectId,
        content:content,
        createdBy:curLoggedInUser
    })

    await note.save();

    return res.status(200).json(
        new ApiResponse(200,{message:"note created successfully",note})
    )

  };
  
  const updateNote = async (req, res) => {
    // update note

    const {content} = req.body;
    const projectId  = req.params.projectId;
    const curLoggedInUser = req.user.id;

    const note = await ProjectNote.findOne({
        project:projectId
    });
    if(!note){
        throw new ApiError(404,"note not found")
    }

    if(note.createdBy.toString()!==curLoggedInUser.toString()){
        throw new ApiError(403,"not authorized to update note")
    }
  
     note.content = content;
     await note.save();


    return res.status(200).json(
        new ApiResponse(200,{message:"note updated successfully",note})
    )


  };
  
  const deleteNote = async (req, res) => {
    // delete note

    const noteId = req.params.noteId;
    const curLoggedInUser = req.user.id;


    const note = await ProjectNote.findById(noteId);
    if(!note){
        throw new ApiError(404,"note not found");
    }

    if(note.createdBy.toString()!==curLoggedInUser.toString()){
        throw new ApiError(403,"note authorized to delete note");
    }

    await ProjectNote.deleteOne({ _id: note._id });

    return res.status(200).json(
        new ApiResponse(200,{message:"note delted successfully"})
    )

  };
  
  export { createNote, deleteNote, getNoteById, getNotes, updateNote };
  