var server=require("./abc/server");
var mysql=require("mysql");
var app=server();
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'w1701blog'
});




app.listen(8888,function(){
    console.log("start");
})


app.get("/stu",function(req,res){
    connection.query('select * from member', function (error, results, fields) {
        if (error) throw error;

            res.render("tpl/stu.html",{data:results})

    });
})

app.get("/list/:id",function(req,res){
      var id=req.id;
    connection.query('select * from member where mid='+id, function (error, results, fields) {
        if (error) throw error;

        res.render("tpl/show.html",{mpass:results[0].mpass})

    });

})
