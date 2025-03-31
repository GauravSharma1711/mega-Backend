import mongoose,{Schema} from "mongoose";
import {AvailableUserRoles,UserRolesEnum} from '../utils/Constants.js'

const projectMemberSchema = new Schema({

    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true,
    },
    role:{
        type:"String",
        enum:AvailableUserRoles,
        default:UserRolesEnum.MEMBER,
    }


},{timestamps:true})


export const ProjectMember = new mongoose.model("ProjectMember",projectMemberSchema);

