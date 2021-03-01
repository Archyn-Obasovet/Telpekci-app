const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const Register = require('../models/User');

module.exports = function(passport){
    passport.use('local',new LocalStrategy({usernameField: 'username'},(username,password,done) => {
        Register.findOne({username:username}).then(user =>{
            if(!user){
                return done(null,false,console.log('incorrect password'));
            }
            bcrypt.compare(password,user.password,function(err,isMatch){
                if(err){throw err;}
                if(isMatch){
                    return done(null,user);
                } else {
                    return done(null,false,console.log('incorrect password'));
                }
            })
        });
    }));



passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    Register.findById(id,function(err,user){
        done(err,user);
    })
})

};