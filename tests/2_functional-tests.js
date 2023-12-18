const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { issue } = require('../routes/models');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite("post requests",function(){
    test("every field filled in",(done)=>{
        chai
            .request(server)
            .post('/api/issues/test')
            .send({
                issue_title:"title",
                issue_text:"hello",
                created_by:"creator",
                assigned_to:"assigner",
                status_text:"in development"
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.equal(res.body.issue_title,"title");
                assert.equal(res.body.created_by,"creator");
                assert.equal(res.body.issue_text,"hello");
                assert.equal(res.body.assigned_to,"assigner");
                assert.equal(res.body.status_text,"in development");
                done();
            })
    })

    test("only required fields",(done)=>{
        chai
            .request(server)
            .post('/api/issues/test')
            .send({
                issue_text:"new issue",
                issue_title:"vishayam",
                created_by:"tester"
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.equal(res.body.issue_text,"new issue");
                assert.equal(res.body.issue_title,"vishayam");
                assert.equal(res.body.created_by,"tester");
                done();
            })
    })
    test("missing required fields",(done)=>{
        chai
            .request(server)
            .post('/api/issues/test')
            .send({
                issue_title:'test'
            })
            .end((err,res)=>{
                assert.equal(res.body.error,"required field(s) missing")
                done();
            })
    })
  })
  suite("get requests",function(){
    test("view issues",(done)=>{
        chai
            .request(server)
            .get('/api/issues/test123')
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.equal(res.body[0].issue_title,"test");
                assert.equal(res.body[0].issue_text,"test");
                assert.equal(res.body[0].created_by,"test");
                assert.equal(res.body[0].assigned_to,"test");
                assert.equal(res.body[0].status_text,"test");
                assert.equal(res.body[0].open,true);
                assert.isArray(res.body);
                assert.equal(res.body.length,1);
                done();
            })
    })
    test("view with one filter",(done)=>{
        chai.request(server)
            .get('/api/issues/test1001')
            .query({created_by:'james'})
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.equal(res.body[0].issue_title,"testing");
                assert.equal(res.body[0].issue_text,"this is a text");
                assert.equal(res.body[0].project,"test1001");
                assert.isArray(res.body);
                assert.equal(res.body.length,1);
                done();
            })

    })
    test("multiple filter",(done)=>{
        chai.request(server)
            .get('/api/issues/test1001')
            .query({created_by:"johan",issue_title:"berthe scn"})
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isArray(res.body);
                assert.equal(res.body[0].issue_text,"berhte scn mwone");
                done();
            })
    })
  })

  suite("put requests",function(){
    test("update one field",(done)=>{
        chai.request(server)
            .put("/api/issues/test1002")
            .send({_id:"657fe9a26e3992a2e59b90eb",issue_title:'updated'})
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.equal(res.body.result,"successfully updated");
                assert.equal(res.body._id,"657fe9a26e3992a2e59b90eb");
                done();
            })
    })
    test("update multiple fields",(done)=>{
        chai.request(server)
            .put("/api/issues/test1002")
            .send({_id:"657fe9a26e3992a2e59b90eb",issue_title:"updated",created_by:"tester"})
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.equal(res.body.result,"successfully updated");
                assert.equal(res.body._id,"657fe9a26e3992a2e59b90eb");
                done();
            })
    })
    test("update with missing id",(done)=>{
        chai.request(server)
            .put("/api/issues/test1002")
            .send({issue_title:"updated",created_by:"tester"})
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.equal(res.body.error,'missing _id');
                 done();
            }) 
    })

    test("no fields to update",(done)=>{
        chai.request(server)
            .put("/api/issues/test1002")
            .send({_id:"657fe2956cfd9e6f7fd16fa3"})
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.equal(res.body.error,'no update field(s) sent');
                assert.equal(res.body._id,"657fe2956cfd9e6f7fd16fa3")
                 done();
            }) 
    })
  })
  test("invalid id",(done)=>{
    chai.request(server)
        .put("/api/issues/test1002")
        .send({_id:"thisisaninvalidid",issue_title:'not happening'})
        .end((err,res)=>{
            assert.equal(res.status,200);
            assert.equal(res.body.error,"could not update");
            assert.equal(res.body._id,"thisisaninvalidid")
             done();
        }) 
    })
    suite("delete requests",function(){
        test("invalid id",(done)=>{
            chai.request(server)
                .delete("/api/issues/test1003")
                .send({_id:"657fe2956cfd9e6f7fd16fa3"})
                .end((err,res)=>{
                    assert.equal(res.status,200);
                    assert.equal(res.body.error,"could not delete");
                    assert.equal(res.body._id,"657fe2956cfd9e6f7fd16fa3");
                    done();
                })
        })
        test("missing id",(done)=>{
            chai.request(server)
                .delete("/api/issues/test1003")
                .send()
                .end((err,res)=>{
                    assert.equal(res.status,200);
                    assert.equal(res.body.error,"missing _id");
                    done();
                })
        })
        test("deleting an issue",(done)=>{
            chai.request(server)
                .delete("/api/issues/test1003")
                .send({_id:"657febde17bd3c713bcf7262"})
                .end((err,res)=>{
                    assert.equal(res.status,200);
                    assert.equal(res.body.result,"successfully deleted");
                   
                    done();
                })
        })
    })
});
