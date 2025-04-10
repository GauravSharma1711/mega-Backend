
import asyncHandler from "../utils/async-handler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Project  from "../models/project.model.js";
import ProjectMember from "../models/projectmember.model.js";

const createProject  = asyncHandler(async(req,res)=>{
  
     const {name,description,createdBy} = req.body;

     const existingProject = await Project.findOne({name});

     if(existingProject){
        throw new ApiError(400,"Project already exists");
     }

     const project = await Project.create({
        name,
        description,
        createdBy:createdBy
     })

     return res.status(200).json(
        new ApiResponse(200,{mesasge:"Project created successfully",project})
     )

})

const updateProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const curUserId = req.user.id;
  
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);
  
    if (!project) {
      throw new ApiError(404, "Project not found");
    }


  
  if(!project.createdBy || project.createdBy.toString()!==curUserId.toString()){
    throw new ApiError(403, "you are not authorized to update this project");
  }
  
    project.name = name;
    project.description = description;
  
    await project.save();
  
    return res.status(200).json(
      new ApiResponse(200, { message: "Project updated successfully" })
    );
  });
  
  const deleteProject = asyncHandler(async(req,res)=>{

    const projectId = req.params.projectId;
    const curLoggedInUser = req.user.id;

    const project = await Project.findById(projectId);
    if(!project){
        throw new ApiError(404,"Project to be deleted not found");
    }
  
    if( !project.createdBy ||project.createdBy.toString()!==curLoggedInUser.toString()){
 throw new ApiError(403, "you are not authorized to delete this project");
    }

    const deletedProject = await Project.findByIdAndDelete(projectId);

    return res.status(200).json(
        new ApiResponse(200,{message:"Project deleted successfully",deletedProject})
    )

  })

  const getProjectById = asyncHandler(async(req,res)=>{

    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);

    if(!project){
        throw new ApiError(404,"Project not found");
    }

    return res.status(200).json(
        new ApiResponse(200,{message:"project found",project})
    )

  })

  const getProjects = asyncHandler(async(req,res)=>{

    const allProjects = await Project.find({});

    if(allProjects,length===0){
        throw new ApiError(404,"no project found");
    }

    return res.status(200).json(
        new ApiResponse(200,{message:"all projects",allProjects})
    )


  })

export {createProject,updateProject,deleteProject,getProjectById,getProjects}