var couple = require('./coupleModel.js');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');


// refactored for couples from shortly angular

module.exports = {
  signup: function (req, res, next) {
    //generating hash of password
    bcrypt.genSalt(10, function(err, salt){
      if(err){
        console.error(err);
      }
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        if(err){
          console.error(err);
        }
        var params = [req.body.username, 
                      hash,
                      req.body.lastName1, 
                      req.body.firstName1, 
                      req.body.lastName2, 
                      req.body.firstName2,
                      req.body.email, 
                      req.body.phoneNumber,
                      '../assets/m1.png'];
        //inserting data into the DB
        couple.postCouple(params, function(err, result) {
          if(err){
            console.error(err);
          }
          //creating token with username as payload
          var jwtSecret = 'a;lskdjf;laksdjf';
          var token = jwt.sign({
            username: req.body.usernameSignup
          }, jwtSecret);
          res.send({
            //sending back token for client processing
            token: token
          });
        });
      });
    });
  },

  signin: function(req, res, next) {
    //get the username and password Hash from the DB
    couple.getCouple([req.body.username], function(err, result) {
      if(err){
        console.error('user not found')
      }
      //check if the password Hash === typed in password 
      bcrypt.compare(req.body.password, result[0][hash], function(err, res) {
        if(err) {
          res.status(401).end('Either username or password was incorrect');
        }

        //if typed in password checks out, create a token
        if(res == true) {
          //creating token with username as payload
          var jwtSecret = 'a;lskdjf;laksdjf';
          var token = jwt.sign({
            username: req.body.usernameSignup
          }, jwtSecret);
          res.send({
            //sending back token for client processing
            token: token
          });
        }
      });
    });
  }
};


