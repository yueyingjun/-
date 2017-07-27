var http=require("http");
var fs=require("fs");
var path=require("path");
class route{
   constructor(){
       this.infoArr={};
       this.cookies=[];
   }
   get(url,callback){
       this.infoArr[url]=callback;
   }
   start(params,callback){
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


       var that=this;



       res.sendFile=function(url){
            fs.createReadStream(url).pipe(res);
       }

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

        var url=(req.url);
        if(url==="/favicon.ico"){
            res.end();
        }else{
            that.getCookie(req,res)

            for(var i in this.infoArr){
                if(i==url){
                    this.infoArr[i](req,res);
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






