require('dotenv').config();
const mongoose=require('mongoose');
const {schema}=mongoose;
const uri=process.env.MONGO_URI;

const db=mongoose.connect(uri).then(()=>{
    console.log("database connection successfull")
})


const issueschema=new mongoose.Schema({
    issue_title:{type:String},
    issue_text:{type:String},
    created_on:Date,
    updated_on:Date,
    created_by:{type:String},
    assigned_to:String,
    open:Boolean,
    status_text:String,
    project:String
})
const issue=mongoose.model('issue',issueschema)

module.exports.issue=issue;