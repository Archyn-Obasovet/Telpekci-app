
var socket = io();
        
      
        //val event receiver
        socket.on('messages',function(data){
            let i = 0;
            while(i < data.length){
                document.getElementById('contenti').innerHTML += `<p>${data[i].text}</p>`;
                i++;
            }
        })
       
            
            
       function Tracer (){
         
         'use strict'
            socket.open()    
            const data = document.getElementById('input').value;
            const theme = document.getElementById('theme').value;
            var date = Date.now(); 
            var submition = {
                data,
                theme,
                date
            }
            socket.emit('messages',{content: submition})
            
        }    