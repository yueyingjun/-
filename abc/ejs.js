function compile(str){
      var str=str.replace(/\n*/g,"").replace(/'/g,'"');
       str=str.replace(/<%=([^%]*)%>/g,function(a,b){
          return "`+"+b+"+`"
       })

       str=str.replace(/<%([^%]*)%>/g,function(a,b){
           return "`;\n"+b+"\ntpl+=`"
       })
      str="var tpl='';with(obj){tpl+=`"+str+"`\n return tpl}"
     return  new Function("obj",str);
}

function render(str,data){
   return compile(str)(data);
}

module.exports=render;

