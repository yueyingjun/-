
var server=require("./server.js");
var app=server();
app.start(8888,function(){
    console.log("启动");
})

app.get("/",function(req,res){
    /*cookies*/
    if(req.cookies.name=="lisi1") {
        res.sendFile("tpl/aa.html");
    }else{
        res.sendFile("tpl/login.html");
    }
})
app.get("/abc/:id/list/:id1",function(req,res){
    res.end("abc1");
})
app.get("/123",function(req,res){
    res.end("sdas");
})

