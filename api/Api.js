const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const Registration = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(sessions)
const Thought = require('../models/Thought')
require('../config/config')(passport);




//cookie-session configuration
router.use(cookieParser())
router.use(
	sessions({
		secret:'important',
		resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection})    
	})
);
router.use(passport.initialize())
router.use(passport.session())




//middleware for bodyparser
const jsonParser = bodyParser.json();
const urlencodedparser = bodyParser.urlencoded({extended: false});




//requests
router.get('/Feed',checker,function(req,res){
    res.render('feed');
   /*Thought.find({},function(err, thought){
       if(err){throw err;}
       else{
        res.render('feed',{data: thought});
       }
   })*/
   
    
   })

//instead of post request
   

router.get('/Registration',function(req,res){
    res.render('register')
})
router.post('/Registration',urlencodedparser,function(req,res){
    var register = new Registration({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    }); bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(register.password,salt,(err,hash)=>{
            if(err){throw err;}
            register.password = hash;
            register.save(function(err,register){
                if(err){throw err;}
                res.redirect('/');
            })
        })
    })

})
router.get('/Login',function(req,res){
    res.render('login');
})
router.post('/Login',urlencodedparser,passport.authenticate('local',{successRedirect:'/Api/Feed', failureRedirect: '/Api/Registration' }),function(req,res){
  
});
router.get('/logout',function(req,res){
    req.logout();
    res.send(`<script>alert('you successfully logged out!')</script>`)
})






//authorization check function
function checker(req,res,next){
	if(!req.isAuthenticated()){
        res.redirect('/Api/login')
	} else{
		next();
	}
}

module.exports = router