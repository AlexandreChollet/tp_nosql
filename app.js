var app = require('http').createServer(handler);
app.listen(8080);
var io = require('socket.io').listen(app);
var redis = require('redis');
var fs = require('fs');
 
function handler(req,res){
    fs.readFile(__dirname + '/index.html', function(err,data){
        if(err){
            res.writeHead(500);
            return res.end('Error loading index file');
        }
        res.writeHead(200);
        console.log("Magic happens on port 8088");
        res.end(data);
    });
}

// Initiliazing redis clients
var store = redis.createClient();
var pub = redis.createClient();
var sub = redis.createClient();
 
// socket io listener
io.sockets.on('connection', function (client) {
    sub.subscribe("chatting");
    sub.on("message", function (channel, message) {
        //message received on server from publish, sending to client
        client.send(message);
    });
    client.on("message", function (msg) {
        if(msg.type == "chat"){
            pub.publish("chatting",msg.message);
        }
        else if(msg.type == "setUsername"){
            pub.publish("chatting","A new user in connected:" + msg.user);
            store.sadd("onlineUsers",msg.user);
        }
    });
    client.on('disconnect', function () {
        sub.quit();
        pub.publish("chatting","User is disconnected :" + client.id);
    });
     
  });
