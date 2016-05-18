var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: {
              type: String,
              required: false,
              unique: true
            },
    password: {
              type: String,
              required: false
            },
    email: {
            type: String,
            required: false,
            unique: false

          },
    OauthId: String,
    OauthToken: String,
    firstname: {
        type: String,
        default: ''
      },
      lastname: {
          type: String,
          default: ''
        },
    admin:   {
        type: Boolean,
        default: false
    },
    activated: {
      type: Boolean,
      default: false
    },
    cmq_password: String
    }, {
    timestamps: true
});

User.methods.getName = function(){
  return (this.firstname + " " + this.lastname);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
