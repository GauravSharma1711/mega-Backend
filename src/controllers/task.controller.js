import Task from '../models/task.model.js'
import asyncHandler from "../utils/async-handler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Project from '../models/project.model.js';
import { SubTask } from '../models/subtask.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js'
 

const getTasks = asyncHandler(async (req, res) => {
   
  const curLoggedInUser  = req.user.id

  const myTasks = await Task.find({
    assignedBy:curLoggedInUser
  })

  if(!myTasks){
    throw new ApiError(400,"you dont have any task");
  }

  return res.status(200).json(
    new ApiResponse(200,{message:"got all tasks",myTasks})
  )

  });
  

  const getTaskById = asyncHandler(async (req, res) => {
    const taskId = req.params.taskId;

    const curLoggedInUser  = req.user.id;

    const task = await Task.findById(taskId);
    if(!task){
      throw new ApiError(404,"task not found");
    }

    if(task.assignedBy.toString()!==curLoggedInUser.tostring()){
      throw new ApiError(403,"not authorized to get task");
    }

    return res.status(200).json(
      new ApiResponse(200,{message:"got task by id",task})
    )
  });
  
  
  const createTask = asyncHandler(async(req, res) => {
    
    const {title,description}  = req.body;

    const {projectId,assignedTo} = req.params;

    const assignedBy  = req.user.id;

    const project = await Project.findById(projectId);
    if(!project){
      throw new ApiError(404,"Project not found")
    }

    if(project.createdBy.toString()!==assignedBy.toString()){
      throw new ApiError(403,"Not authorized to assign task");
    }

   const attachmentLocalPath =  req.files?.attachments[0]?.path;

   if(!attachmentLocalPath){
    throw new ApiError(400,"attachment is required")
   }
 const attachment  =    await uploadOnCloudinary(attachmentLocalPath);
   
 if(!attachment){
  throw new ApiError(400,"attachment is required")
 }



    const task = new Task({
      title,
      description,
      attachment:attachment.url,
      assignedTo,
      assignedBy,
      projectId
      })

      await task.save();

      return res.status(200).json(
        new ApiResponse(200,{message:"task created successfully",task})
      )



  });
  
  
  const updateTask = asyncHandler(async(req, res) => {
    const {title,description}  = req.body;
      const taskId = req.params.taskId;

      const curLoggedInUser  = req.user.id;

      const task = await Task.findById(taskId);
      if(!task){
        throw new ApiError(404,"task not found");
      }

      if(task.assignedBy.toString()!==curLoggedInUser.tostring()){
        throw new ApiError(403,"not authorized to update task");
      }

      const attachmentLocalPath =  req.files?.attachments[0]?.path;

   if(!attachmentLocalPath){
    throw new ApiError(400,"attachment is required")
   }
 const attachment  =    await uploadOnCloudinary(attachmentLocalPath);
   
 if(!attachment){
  throw new ApiError(400,"attachment is required")
 }

      task.title = title;
      task.description = description;
      task.attachments = attachment;

      await task.save();


      return res.status(200).json(
        new ApiResponse(200,{message:"task updated successfully",task})
      )


        



  });
  
 
  const deleteTask = asyncHandler(async (req, res) => {

    const taskId = req.params.taskId;

    const curLoggedInUser  = req.user.id;

    const task = await Task.findById(taskId);
    if(!task){
      throw new ApiError(404,"task not found");
    }

    if(task.assignedBy.toString()!==curLoggedInUser.tostring()){
      throw new ApiError(403,"not authorized to delete task");
    }

    await Task.findByIdAndDelete({_id:taskId});
    
    return res.status(200).json(
      new ApiResponse(200,{message:"task delted successfully",task})
    )

  });
  
 
  const createSubTask = asyncHandler(async (req, res) => {
     const taskId =  req.params.taskId;

     const curLoggedInUser = req.user.id;

     const {title} = req.body;

     const task = await Task.findById(taskId);
     if(!task){
      throw new ApiError(404,"task not found");
     }

     if(task.assignedBy.toString()!==curLoggedInUser.toString()){
      throw new ApiError(403,"not authorized to create subtask");
     }

     const subTask = new SubTask({
      title,
      task:taskId,
      createdBy:curLoggedInUser
     })

     await SubTask.save();

     return res.status(200).json(
      new ApiResponse(200,{message:"Subtask created successfully",subTask})
    )



  });
  
  const updateSubTask = asyncHandler(async (req, res) => {
    const subtaskId =  req.params.subtaskId;

    const curLoggedInUser = req.user.id;

    const {title,isCompleted} = req.body;

    const subtask = await Task.findById(subtaskId);
    if(!subtask){
     throw new ApiError(404,"subtask not found");
    }

    if(subtask.createdBy.toString()!==curLoggedInUser.toString()){
     throw new ApiError(403,"not authorized to update subtask");
    }

    subtask.title=title;
    subtask.isCompleted=isCompleted;

    await subtask.save();


  return res.status(200).json(
      new ApiResponse(200,{message:"Subtask updated successfully",task})
    )


  });
  
 
  const deleteSubTask = asyncHandler(async (req, res) => {
    const subtaskId =  req.params.subtaskId;

    const curLoggedInUser = req.user.id;

 

    const subtask = await Task.findById(subtaskId);
    if(!subtask){
     throw new ApiError(404,"subtask not found");
    }

    if(subtask.createdBy.toString()!==curLoggedInUser.toString()){
     throw new ApiError(403,"not authorized to delete subtask");
    }

    await SubTask.findByIdAndDelete({_id:subtaskId});

    return res.status(200).json(
      new ApiResponse(200,{message:"Subtask delete successfully",task})
    )

  });
  
  export {
    createSubTask,
    createTask,
    deleteSubTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateSubTask,
    updateTask,
  };
  