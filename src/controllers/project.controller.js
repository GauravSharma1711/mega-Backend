
import asyncHandler from "../utils/async-handler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Project  from "../models/project.model.js";
import ProjectMember from "../models/projectmember.model.js";
import User from '../models/user.models.js'

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

    if(allProjects.length===0){
        throw new ApiError(404,"no project found");
    }

    return res.status(200).json(
        new ApiResponse(200,{message:"all projects",allProjects})
    )


  })



  const addMemberToProject = asyncHandler(async(req,res)=>{
    const { userId, role } = req.body; 
    const { projectId } = req.params;
    const currentUserId = req.user.id;

    if(!userId){
        throw new ApiError(400, "userId is required to add a member");
    }

const project = await Project.findById(projectId);

if (!project) {
    throw new ApiError(404, "Project not found");
}

if (project.createdBy.toString() !== currentUserId.toString()) {
    throw new ApiError(403, "You are not authorized to add members to this project");
}

const user = await User.findById(userId);

if (!user) {
    throw new ApiError(404, "User to be added not found");
}

const existingMembership = await ProjectMember.findOne({
    user:userId,
    project:projectId,
});


if (existingMembership) {
    throw new ApiError(409, "User is already a member of this project");
}

const newMember = await ProjectMember.create({
    user: userId,
    project: projectId,
 role: role || UserRolesEnum.MEMBER,
})

return res.status(201).json(
    new ApiResponse(201, {
        message: "Member added to project successfully",
        member: newMember,
    })
);

  })


  const getProjectMembers = asyncHandler(async(req,res)=>{
  const projectId=  req.params.projectId;

  const projectMembers = await ProjectMember.find({
           project:projectId
  }) 

  if(!projectMembers){
    throw new ApiError(404,"no member found")
  }

  return res.status(200).json(
    new ApiResponse(201,{mesage:"member found successfully",projectMembers})
  )


  })


  const updateMemberRole = asyncHandler(async(req,res)=>{
   const {projectId} = req.params;
   const {memberId,role} = req.body;
   const curUserId = req.user.id;

   const project = await Project.findOne({
    _id:projectId
   })

   if(!project){
    throw new ApiError(404,"project not found")
   }

   if(project.createdBy.toString()!==curUserId.toString()){
    throw new ApiError(403,"you are not authorized to update member role");
   }

   const member = await ProjectMember.findOne({
         user:memberId
        });

   if(!member){
    throw new ApiError(404,"project member not found")
   }

   if(member.project.toString()!==projectId.toString()){
    throw new ApiError(403,"member not part of project")
   }

member.role = role;
await member.save();

return res.status(200).json(
  new ApiResponse(200,{message:"member role updated"})
)

  })

  const deleteMember = asyncHandler(async(req,res)=>{
     
    const memberId = req.params.memberId;
    const curLoggedInUser = req.user.id;

    const projectmember = await ProjectMember.findOne({
      user:memberId
    })

    if(!projectmember){
      throw new ApiError(404,"project member not found")
    }

    const projectId  =  projectmember.project;
    const project = await Project.findById(projectId);
    if(!project){
      throw new ApiError(404,"project not found")
    }

    if(project.createdBy.toString()!==curLoggedInUser.toString()){
      throw new ApiError(403,"not authorized to delete member")
    }

    await ProjectMember.deleteOne({ _id: projectmember._id });


    return res.status(200).json(
      new ApiResponse(200,{message:"member deleted successfully"})
    )

  })




export {createProject,updateProject,deleteProject,getProjectById,getProjects,
    addMemberToProject,getProjectMembers,updateMemberRole,deleteMember

}