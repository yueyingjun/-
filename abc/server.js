var http=require("http");
var fs=require("fs");
var path=require("path");
var config=require("./config");
var ejs=require("./ejs");
class route{
   constructor(){
       this.infoArr={};
       this.cookies=[];
   }
   get(url,callback){
       var arr=(url.match(/:[^\/]*/g))||[]
       var attr=arr.map(function(val){
           return val.substr(1);
       });
       var reg=url.replace(/:[^\/]*/g,"([^\/]*)");
       var regstr="/"+reg.replace(/\//g,"\\/")+"$/";
       this.infoArr[regstr]={};
       this.infoArr[regstr].attr=attr;
       this.infoArr[regstr].fn=callback;
   }
   listen(params,callback){
        var that=this;
        http.createServer(function(req,res){
            that.done(req,res)
        }).listen(params,function () {
            if(callback){
                callback();
            }
        })
   }

   done(req,res){

       var url=(req.url);
       if(url=="/favicon.ico"){
           res.end();
       }else{
           //处理静态的文件
            var ext=path.extname(url);
            if(ext&&config.staticType.indexOf(ext)>-1){
                var staticUrl=path.resolve("./"+config.staticDir,"."+url);

                try{
                    console.log(staticUrl);
                    res.setHeader("content-type",config.mimeType[ext]+";charset=utf-8")
                    res.writeHead(200);
                    fs.createReadStream(staticUrl).pipe(res);
                }catch (e){
                    res.writeHead(404);
                    res.end();
                }

            }else{

              //处理cookie

                this.getCookie(req,res)
                res.setCookie=function(attr,val){
                    var str=attr+"="+val;
                    that.cookies.push(str);
                    res.setHeader("set-cookie",that.cookies);
                }
                res.clearCookie=function(attr){
                    if(attr){
                        that.cookies=that.cookies.map(function(val){
                            var arr=val.split("=");
                            if(arr[0]==attr){
                                return val+";expires="+new Date().toUTCString();
                            }else{
                                return val;
                            }
                        })

                    }else{
                        that.cookies=that.cookies.map(function(val){
                            return val+";expires="+new Date().toUTCString()
                        })

                    }

                    res.setHeader("set-cookie",that.cookies);
                }




              res.sendFile=function(url){
                    var url=path.resolve("./"+url);
                    try{
                        fs.createReadStream(url).pipe(res);
                    }catch (e){
                        res.setHeader("content-type","text/html;charset=utf-8");
                        res.end("模板不存在");
                    }

              }

              res.render=function(url,data1){
                  var url=path.resolve("./"+url);
                  fs.readFile(url,function(err,data){
                      if(err){
                          res.end("template not find");
                      }else{
                         res.write(ejs(data.toString(),data1));
                         res.end();
                      }

                  })


              }


              var flag=true;
              for(var i in this.infoArr){

                  if(eval(i).test(url)){
                      flag=false;
                        var arr=eval(i).exec(url);
                        for(var j=0;j<this.infoArr[i].attr.length;j++){
                            req[this.infoArr[i].attr[j]]=arr[j+1]
                        }

                      this.infoArr[i].fn(req,res)

                  }
              }

              if(flag){
                  res.setHeader("content-type","text/html;charset=utf-8");
                  res.end("页面不存在");
              }



            }


       }


   }

    getCookie(req,res){
       req.cookies={}
       var arr=req.headers.cookie?req.headers.cookie.split("; "):[];
       for(var i=0;i<arr.length;i++){
           var arr1=arr[i].split("=");
           req.cookies[arr1[0]]=arr1[1];
           var str=arr1[0]+"="+arr1[1];
           this.cookies.push(str);
       }

    }

}

module.exports=function(){
    return new route();
}






