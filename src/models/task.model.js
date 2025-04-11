import mongoose,{Schema} from "mongoose";
import {AvailableTaskStatus,TaskStatusEnum} from '../utils/Constants.js'

const taskSchema = new Schema({

title:{
    type:String,
    required:true,
    trim:true,
},
description:{
    type:String
},
project:{
    type:Schema.Types.ObjectId,
    ref:"Project",
    required:true,
},
assignedTo:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
},
assignedBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
},
status:{
    type:String,
    enum:AvailableTaskStatus,
    default:TaskStatusEnum.TODO,
},

attachments:{
    type:[
        {
            url:String,
            mimetype:String, // jpg,png
            Size:Number
        }
    ],
    default:[]
}






},{timestamps:true})


 const Task= mongoose.model("Task",taskSchema);
 export default Task;


