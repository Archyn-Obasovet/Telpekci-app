const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const Api = require('./api/Api');
const http = require('http')
const server = http.createServer(app);
const io = require('socket.io')(server);
const Thought = require('./models/Thought');


//database middleware
mongoose.connect('mongodb://localhost:27017/Telpekci',{
        auto_reconnect:false,
        poolSize: 10,
        keepAlive: 1000,
        connectTimeoutMS: 10000,
        useNewUrlParser: true,
        useUnifiedTopology: true
})
//view middlewares and static
app.set('views',path.join(__dirname,'views/html'));
app.set('view engine','ejs');
app.use(express.static('views'))
//re-routing
app.use('/Api',Api);

//request handling
app.get('/',function(req,res){
    res.render('index')
})


//socket handler and real-time get-post handling
io.on('connection',function(socket){
    socket.on('messages',(data)=>{                                  //listening to the event 
            let thought = new Thought({
                text : data.content.data,
                theme : data.content.theme,
                CreatedAt : data.content.date
            });                                                     //re-saving received object to a save-able type
            thought.save(function(err,thought){                     //saving the received data
                if(err){console.log('error')}
                else{
                    console.log('saved');
                    io.sockets.emit('receiver',thought);
                }
            });
             
        
    });
    Thought.find().sort({'_id':1}).then((data,err)=>{             //getting records by the last-saved
        if(err){throw err;}
        else{
            
            io.sockets.emit('messages',data);                            //sending received data to front-end
        }
    });
   

})

server.listen(4000,function(){
    console.log('server is on port 4000');
})
            

