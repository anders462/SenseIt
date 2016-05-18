var mongoose = require('mongoose');
var Users = require('../models/user');
var assert = require('chai').assert;
var app = require('../index');
var request = require('supertest');
var users_fixtures = require("./fixtures/users_fixtures");


var STRICT_REST = true; // change that to false depending on https://www.coursera.org/learn/server-side-development/lecture/bKtMl/exercise-video-rest-api-with-express-mongodb-and-mongoose/discussions/x1AZIu9SEeWB0QpuSDkq-Q
var HTTP_OK = 200;
var HTTP_CREATED = (STRICT_REST) ? 200 : HTTP_OK;
var HTTP_NOT_FOUND = 404;
var HTTP_SERVER_ERROR = 500;
var HTTP_NOT_AUTH = 401;

var new_user = {
  "username": "admin",
  "password": "12345",
  "lastname": "bengtsson",
  "firstname": "anders"
}

var actual_user = {
  "username": "admin",
  "password": "12345",
}

var not_user = {
  "username": "fake",
  "password": "12345",
}

var new_user_password ={
    "username": "admin",
    "password": "12345",
    "newPassword": "654321"
}

describe('****Users Routes*****', function(){

  describe('----GET /user----', function(){

    before(function(done){
      Users.remove({}, function(err, res) { // don't use drop() as this will occasionnnaly raise a background operation error
         Users.insertMany(users_fixtures, done);
      });
    });

    it('respond with code 404 (wrong spelling)', function(done){
        request(app)
          .get('/user')
          .expect(HTTP_NOT_FOUND, done);
    });
  });



  describe('----GET /users----', function(){
    before(function(done){
      Users.remove({}, function(err, res) { // don't use drop() as this will occasionnnaly raise a background operation error
         Users.insertMany(users_fixtures, done);
      });
    });

    it('respond with code HTTP_OK + list of users', function(done){
      request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HTTP_OK)
        .expect(function(res) {
          assert.deepEqual(res.body, users_fixtures);
        })
        .end(done);
    });
  });


  describe('----DELETE /users----', function(){
    before(function(done){
      Users.remove({}, function(err, res) { // don't use drop() as this will occasionnnaly raise a background operation error
         Users.insertMany(users_fixtures, done);
      });
    });

    it('responds with code HTTP_NOT_FOUND, delete all users should\'t work', function(done){
      request(app)
        .delete('/users')
        .expect(HTTP_NOT_FOUND, done);
    });
  });

  describe('----POST /users/register---', function(){
    before(function(done){
      Users.remove({}, function(err, res) { // don't use drop() as this will occasionnnaly raise a background operation error
         Users.insertMany(users_fixtures, done);
      });
    });

    it('creates a new user', function(done){
      request(app)
        .post('/users/register')
        .set('Accept', 'application/json')
        .send(new_user)
        .expect(HTTP_CREATED)
        .expect(function(res) {
          assert.equal(res.body.status, 'Registration Successful!');
        })
        .end(done);
    });

    it('fail to create duplicate user', function(done){

      before(function(done) {
        Users.insert(new_user,function(err,res){
          console.log("respons",res)
          done();

        });
      });

      request(app)
        .post('/users/register')
        .set('Accept', 'application/json')
        .send(new_user)
        .expect(HTTP_SERVER_ERROR)
        .expect(function(res) {
          assert.equal(res.body.err.name, 'UserExistsError');
        })
        .end(done);
    });
   });

   describe('----POST /users/login---', function(){

     it('login user existing user should work', function(done){
       request(app)
         .post('/users/login')
         .set('Accept', 'application/json')
         .send(actual_user)
         .expect(HTTP_OK)
         .expect(function(res) {
           assert.equal(res.body.status, 'Login successful!');
         })
         .expect(function(res){
           assert.equal(typeof res.body.token, 'string' );
         })
         .end(done);
     });

     it('reject login if fake user', function(done){
       request(app)
         .post('/users/login')
         .set('Accept', 'application/json')
         .send(not_user)
         .expect( HTTP_NOT_AUTH)
         .expect(function(res) {
           assert.equal(res.body.err.message, 'Password or username are incorrect');
         })
         .end(done);
     });
   });


     describe('PUT /users/update', function(){
       var token = "";
       before(function(done) {
         request(app)
           .post('/users/login')
           .set('Accept', 'application/json')
           .send(actual_user,function(res){
             token = res.body.token;
             console.log(res);
           })
           .end(done);
         });

       it('let a loggedin user change password', function(done){
         request(app)
           .put('/users/update')
           .set('Accept', 'application/json')
           .set('x-access-token', token)
           .send(new_user_password)
           .expect(HTTP_OK)
           .expect(function(res) {
             assert.equal(res.body.status, 'Password update successful!');
           })
           .end(done);
       });
     });



 });
