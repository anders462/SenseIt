var mongoose = require('mongoose');
var User = require('../../models/user');
var assert = require('chai').assert;

var url = 'mongodb://localhost:27017/mysensor';

mongoose.connect(url);
var db = mongoose.connection;

describe('Test of User Model', function(){

  beforeEach(function(done){
    User.remove({}, done); // don't use drop() as this will occasionnnaly raise a background operation error
  });

  after(function(done){
    //clear out db
    User.remove(function(err){
            db.connection.close();
            done();
    });
  });

  describe('Creation of new users', function() {
    it('should create a new user', function(done) {
      var req = {
          username: 'anders462',
          password: '12345',
          firstname: "anders",
          lastname: "bengtsson",
          admin: false,

      };
      User.create(req, function (err, res) {

              if (err) throw err;
              assert.equal(res.username, req.username);
              assert.equal(res.admin, req.admin);
              assert.equal(res.firstname, req.firstname );
              assert.equal(res.lastname, req.lastname);
              done();
      });
    });

  });

  describe('should fail because of missing fields', function() {
    it('should create a new empty user', function(done) {
      var req = {};
      User.create(req, function (err, res) {
              assert.equal(err.errors.username.name, 'ValidatorError');
              assert.equal(err.errors.password.name, 'ValidatorError');
              done();
      });
    });

  });


});
