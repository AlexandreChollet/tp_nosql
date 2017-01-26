$(document).ready(function() {
        var username = "annonyme";
        $('input[name=setUsername]').click(function(){
            if($('input[name=usernameTxt]').val() != ""){
                username = $('input[name=usernameTxt]').val();
                var msg = {type:'setUsername',user:username};
                socket.json.send(msg);
            }
            $('#username').slideUp("slow",function(){
                $('#sendChat').slideDown("slow");
            });
        });
        var socket = new io.connect('http://localhost:8088');
        var content = $('#content');
 
        socket.on('connect', function() {
            console.log("Connected");
        });
 
        socket.on('message', function(message){
            content.append(message + '<br />');
        }) ;
 
        socket.on('disconnect', function() {
            content.html("<b>Disconnected!</b>");
        });
 
        $("input[name=sendBtn]").click(function(){
            var msg = {type:'chat',message:username + " : " +  $("input[name=chatTxt]").val()}
            socket.json.send(msg);
            $("input[name=chatTxt]").val("");
        });
    });
