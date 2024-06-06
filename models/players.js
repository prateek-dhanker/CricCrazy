import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    name : {type:String , required:true },
    category : {type:String , required:true},
    matches : {type:Number , required:true},
    batting : {
        innings:{type:Number , required:true},
        runs:{type:Number , required:true},
        balls:{type:Number , required:true},
        notout:{type:Number , required:true},
        fifties:{type:Number , required:true},
        hundreds:{type:Number , required:true},
        highest:{type:Number , required:true}
    },
    bowling : {
        balls:{type:Number , required:true},
        wickets:{type:Number , required:true},
        runs:{type:Number , required:true},
        fivers:{type:Number , required:true}
    },
    user : {type:mongoose.Schema.Types.ObjectId , ref:'User'}
})

playerSchema.index({ name: 1, user: 1 }, { unique: true });

const Player = mongoose.model('Player', playerSchema);

export default Player;