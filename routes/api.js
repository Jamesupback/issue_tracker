'use strict';
require('./models');
const issue=require('./models').issue;
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let filter=req.query;
      filter.project=project
      issue.find(filter).then((value)=>{
        return res.json(value)
      }) 
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by)
      return res.json({ error: 'required field(s) missing' });
      const newissue=new issue({
        issue_title:req.body.issue_title ||"",
        issue_text:req.body.issue_text||"",
        created_on:new Date()||'',
        updated_on:new Date()||'',
        created_by:req.body.created_by||'',
        assigned_to:req.body.assigned_to||'',
        open:true||'',
        status_text:req.body.status_text||"",
        project:project||''
      })
      newissue.save().then((data)=>{
        return res.json(data)
      })
    })
    
    .put(function (req, res){

     let update={};
     if(!req.body._id)
     return res.json({ error: 'missing _id' })
  
     Object.keys(req.body).forEach((e)=>{
      if(req.body[e]){
        update[e]=req.body[e];
      }
     })
     if(Object.keys(update).length==1){
      return res.json({ error: 'no update field(s) sent', '_id': req.body._id });
     }
     
     update['updated_on']=new Date()
     issue.findByIdAndUpdate({_id:req.body._id},update,{new:true}).then((data)=>{
      if(data)
       res.json({  result: 'successfully updated', '_id': req.body._id });
      else
      res.json({ error: 'could not update', '_id': req.body._id });
     }).catch((err)=> res.json({ error: 'could not update', '_id': req.body._id }))
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      if(!req.body._id)
      return res.json({ error: 'missing _id' })
      issue.findByIdAndDelete({_id:req.body._id}).then((data)=>{
        if(data)
         res.json({ result: 'successfully deleted', '_id': req.body._id })
        else
          res.json({ error: 'could not delete', '_id': req.body._id })
      })
    });
    
};
