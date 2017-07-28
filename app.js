var server=require("./abc/server.js");
var app=server();
app.start(8888,function(){
    console.log("启动1");
})




app.get("/abc/:id",function(req,res){
    res.end(req.id);
})
app.get("/abc/aa/:cc",function(req,res){
    res.end(req.cc);
})
app.get("/123",function(req,res){
    /*
    *  模板引擎
    * */
    res.end("123");
})
app.get("/list/:id",function(req,res){
    var arr=["a","b","c"];
    var data=arr[req.id];
    res.end(data)
})


/*
   req.url="/abc/1"
*
*{ '/\//': { attr: [], fn: [Function] },
 '/\/abc\/([^\/]*)/': { attr: [ 'id' ], fn: [Function] },
 '/\/123/': { attr: [], fn: [Function] },
 '/\/demo\/([^\/]*)/': { attr: [ 'aa' ], fn: [Function] } }
*
*
* */