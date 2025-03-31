import mongoose,{Schema} from "mongoose";

const ProjectNoteSchema = new Schema({

    project:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        required:true
    }




},{timestamps:true})


export const ProjectNote= new mongoose.model("ProjectNote",ProjectNoteSchema);
