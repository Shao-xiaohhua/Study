/*
  邵晓华
 */

/*解决document.getElementsByClassName的兼容性问题
getclass("one",[range])获取带有指定class名的元素的集合，one是指定的class名
思路：
1、判断浏览器是否支持这个方法：document.getElementsByClassName;
2、如果有，直接使用指定方法:
  document.getElementsByClassName("class名");
3、如果没有，需要解决兼容问题（用已有方法模拟）
  从所有元素中进行挑选，通过类名进行挑选
  all[i].className=="指定的class名"
  all[i].className是否包含指定的className;
*/
function getClass(classname,range){
  var range=range||document;
  //var rang=rang?range:document;
  if(range.getElementsByClassName){
    return range.getElementsByClassName(classname)
  }else{
    var all=range.getElementsByTagName("*");
    var arr=[];
    for(var i=0;i<all.length;i++){
      /*if(all[i].className==classname){
        arr.push(all[i]);
      }*/
      //第一种：当前元素的className是否包含指定的classname；
      if (checkClass(all[i].className,classname)){
        arr.push(all[i]);
      }   
    }
    return arr;
  }
}
/*checkclass(str,classone){
  检查str里面是否包含classone
  思路：
  1、将str进行分割，转换成数组
  2、遍历数组，检查是否有元素等于classone；
  3、如果相等返回true
     如果不相等返回false；
}*/
function checkClass(str,classone){
  var arr=str.split(" ");
  for(var i=0;i<arr.length;i++){
    if(arr[i]==classone){
      return true;
    }
  }
  return false;
};


/*解决获取设置某个元素的文本兼容性问题
getContent(obj,[val])获取设置某个元素的文本,val是设置的内容
思路：
1、判断浏览器
2、判断val，是否有这个参数，有val是设置，没有这个参数是获取
3、设置或者获取文本*/
function getContent(obj,val){
  if(obj.textContent){
    // w3c
    if(val){
      obj.textContent=val;
    }else{
      return obj.textContent;
    }
  }else{
    if(val){
      obj.innerText=val;
    }else{
      return obj.innerText;
    }
  }
}

/*解决获取样式的通用方式兼容性问题
getStyle(obj,attr)获取样式的通用方式,obj是对象，attr是样式
思路：
1、判断浏览器，obj.currentStyle
2、IE6-8:obj.currentStyle.attr;
3、w3c:  getComputedStyle(obj,null).attr;*/
function getStyle(obj,attr){
  if(obj.currentStyle){
    return obj.currentStyle[attr];
  }else{
    return getComputedStyle(obj,null)[attr];
  }
}


/*$(select)方便来获取元素，将3种获取元素的方法进行封装
字符串
$(".one")通过className来获取元素
$("#one")通过id来获取元素  document.getElementById() select.substring(1);
$("div")通过标签来获取元素
$("<div>")创建div
如果传入的参数为函数时，让其执行window.onload=function(){};
思路：
1、判断参数的第一个字符   str.charAt(0);
2、根据字符执行相应的分支，返回相应的元素*/
/*function $(select,content){
  var content=content||document;
  var first=select.charAt(0);
  if(first=="."){
    return getClass(select.substring(1),content);
  }else if(first=="#"){
    return content.getElementById(select.substring(1));
  }else if(/^[a-z][a-z1-6]{0,8}$/.test(select)){
    return content.getElementsByTagName(select);
  }else if(/^<[a-z][a-z1-6]{0,8}>$/.test(select)){
    return document.createElement(select.slice(1,-1));
  }
}*/
function $(select,content){
  if(typeof select=="string"){
    var content=content||document;
  var first=select.charAt(0);
  if(first=="."){
    return getClass(select.substring(1),content);
  }else if(first=="#"){
    return content.getElementById(select.substring(1));
  }else if(/^[a-z][a-z1-6]{0,8}$/.test(select)){
    return content.getElementsByTagName(select);
  }else if(/^<[a-z][a-z1-6]{0,8}>$/.test(select)){
    return document.createElement(select.slice(1,-1)); // 创建元素
  }
  }else if(typeof select=="function"){
    addEvent(window,"load",select)
    
  }
}



/*getChild(obj，type)
获取指定元素的子元素的集合
obj是指定元素，type是指定获取元素的类型
type  ：true只获取元素节点（默认）
type  ：false获取元素节点和有意义的文本节点
1、获取obj的所有子元素(元素节点)
2、挑选 obj.nodeType==1*/
function getChild(obj,type){
  type=type==undefined?true:type;
  arr=[];
  var child=obj.childNodes; //获取这个元素的子元素集合
  if(type){
    for(var i=0;i<child.length;i++){
    if(child[i].nodeType==1){  //nodeType = 1 为元素节点
      arr.push(child[i]);
    }
    }return arr;
  }else{
    for(var i=0;i<child.length;i++){
    if(child[i].nodeType==1||(child[i].nodeType==3&&child[i].nodeValue.replace(/^\s+|\s+$/g,""))){
      arr.push(child[i]);
    }
    }
  return arr;
  }
  
}

function firstChild(obj){
  return getChild(obj)[0]
}
function randomChild(obj,num){
  return getChild(obj)[num]
}
function lastChild(obj){
  var length=getChild(obj).length;
  return getChild(obj)[length-1];
}
/*
beforeChild(obj,div)
在父元素里面的最前面插入元素
obj:父元素/父对象
div:要插入的元素
1、获取obj第一个子元素
2、obj.insertBefore(div,firstChild)
*/
function beforeChild(obj,child){
  var first=firstChild(obj)
  obj.insertBefore(child,first); //在最前面插入元素
}
/*
insertAfter(obj,div,true)
在某个元素的后面插入
obj是插入的位置
div是插入的元素
type：类型true，忽略文本，寻找元素节点
    类型false，不忽略文本，直接在位置的下一个前面插入，不管是什么类型
思路：
1、是否有下一个兄弟节点
  1.1、有兄弟节点，就在下一个兄弟节点的前面插入
insertBefore
2、没有兄弟节点
  2.1、就在父元素内最后面插入 
  appendChild
*/
function insertAfter(obj,ele,type){
  type=type==undefined?true:type;
  var next=getNext(obj,type)//false   next
  var parent=obj.parentNode;
  if(next){
    parent.insertBefore(ele,next);
  }else{
    parent.appendChild(ele);   //在最后添加
  }
}

/*
getNext(obj,true)
获取obj下一个兄弟节点，如果有，返回该节点，如果没有，返回false
obj:指定的对象
type：类型true(默认)，忽略文本，寻找元素节点
    类型false，不忽略文本，直接在位置的下一个前面插入，不管是什么类型
思路：
1、判断是否有兄弟节点
2、没有，直接return false；
3、有，判断next（下一个兄弟节点）是否是元素节点（有意义的文本）
4、如果不是，更新next，继续寻找下一个兄弟节点，知道找到元素节点（有意义的文本）
  判断是否为空
  4.1、不为空，重复2
  4.2、为空，直接返回false
*/
function getNext(obj,type){
  type=type==undefined?true:type;
  if(type){
    //忽略文本
    var next=obj.nextSibling;  //返回下一个兄弟元素
    if(next==null){
      return false;
    }
    //next类型是注释或文本时，继续向下
    while(next.nodeType==8||next.nodeType==3){
      next=next.nextSibling;
      if(next==null){
      return false;
      }
    }

    return next;
  }else{
    //不能忽略文本
    var next=obj.nextSibling;
    if(next==null){
      return false;
    }
    //next类型是注释或文本时，继续向下
    while(next.nodeType==8||(next.nodeType==3&&!(next.nodeValue.replace(/^\s+|\s+$/g,"")))){
      next=next.nextSibling;
      if(next==null){
      return false;
      }
    }

    return next;
  }
}
// 获取上一个兄弟元素
function getPrevious(obj,type){
  type=type==undefined?true:type;
  if(type){
    var previous=obj.previousSibling;
    if(previous==null){
      return false;
    }
    while(previous.nodeType==8||previous.nodeType==3){
      previous=previous.previousSibling;
      if(previous==null){
      return false;
      }
    }
    return previous;
  }else{
    var previous=obj.previousSibling;
    if(previous==null){
      return false;
    }
    while(previous.nodeType==8||(previous.nodeType==3&&!(previous.nodeValue.replace(/^\s+|\s+$/g,"")))){
      previous=previous.previousSibling;
      if(previous==null){
        return false;
      }
    }
    return previous;
  }
}


// 添加事件
/*
addEvent(obj,type,fn)
addEvent:给元素添加一个事件
obj:对象
type：事件类型
fn:事件的处理程序
各自有自己的添加方法，各自用各自的
*/
function addEvent(obj,type,fn){
  if(obj.addEventListener){
    obj.addEventListener(type,fn,false);
  }else{
    obj.attachEvent("on"+type,fn);
  }
}
function removeEvent(obj,type,fn){
  if(obj.removeEventListener){
    obj.removeEventListener(type,fn,false);
  }else{
    obj.detachEvent("on"+type,fn);
  }
}

/*
offset(obj)
获取元素到浏览器的距离
left=所有具有定位属性的父元素的offsetLeft+所有父元素的左边框+自身的offdetLeft
1、获取所有具有定位属性的父元素(判断position=relative||absolute)
2、offsetLeft+borderLerftWidth;
3、最终结果返回一个对象{left:200,top:300}
*/
function offset(obj){
  var result={left:0,top:0};
  var parent=obj.parentNode;
  var arr=[];//存放obj和具有定位属性的父元素
  arr.push(obj);
  //获取具有定位属性的父元素
  while(parent.nodeName!="BODY"){
    if(getStyle(parent,"position")=="relative"||getStyle(parent,"position")=="absolute"){
      arr.push(parent);
      
    }
    parent=parent.parentNode
  }

  //计算
  //父元素的offsetLeft+所有父元素的左边框+自身的offdetLeft
  for(var i=0;i<arr.length;i++){
    /*
    刨掉自身边框
    如果父元素没有边框，边框宽度0；
    */
    var leftWidth=getStyle(arr[i],"borderLeftWidth")?parseInt(getStyle(arr[i],"borderLeftWidth")):0;
    var topWidth=getStyle(arr[i],"borderTopWidth")?parseInt(getStyle(arr[i],"borderTopWidth")):0;
    if(i==0){
      leftWidth=0;
    }
    result.left+=arr[i].offsetLeft+leftWidth;
    result.top+=arr[i].offsetTop+topWidth

  }
  return result;
}