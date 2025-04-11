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


 const ProjectNote=  mongoose.model("ProjectNote",ProjectNoteSchema);
 export default ProjectNote
