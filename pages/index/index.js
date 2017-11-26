//手指按下的坐标
var startX=0;
var startY=0;

//手指移动的坐标
var moveX=0;
var moveY=0;

//移动位置与开始位置的差值
var X=0;
var Y=0;

//蛇头的对象
var snakeHead = {
  x:0,
  y:0,
  color:"#ff0000",
  w:20,
  h:20,
}

var direction = null;//手指方向
var snakeDirection = "right";//移动方向

var snakeBody = [];//身体对象数组
var food = []; //食物对象

//窗口宽高
var winWidth = 0;
var winHeight = 0;

var collisionBool = true; //判断碰撞后是否删除

Page({
  canvasStart:function(e){
    startX=e.touches[0].x;
    startY=e.touches[0].y;
  },
  canvasMove:function(e){
    moveX = e.touches[0].x;
    moveY = e.touches[0].y;

    X = moveX-startX;
    Y = moveY-startY;
    if(Math.abs(X)>Math.abs(Y)&&X>0){
      console.log("right");
      direction = "right";
    } else if (Math.abs(X) > Math.abs(Y) && X < 0){
      console.log("left");
      direction = "left";
    } else if (Math.abs(X) < Math.abs(Y) && Y > 0){
      console.log("bottom");
      direction = "bottom";
    } else if (Math.abs(X) < Math.abs(Y) && Y < 0) {
      console.log("top");
      direction = "top";
    }
  },

  onReady:function(){
    var context = wx.createCanvasContext('snake');//获取画布上下文
    var frameNum = 0;//帧数

    function drawSnake(obj) {
      context.setFillStyle(obj.color);
      context.beginPath();
      context.rect(obj.x, obj.y, obj.w, obj.h);
      context.closePath();
      context.fill();
    }

    function collision(obj1,obj2){
      var l1 = obj1.x;
      var r1 = l1 + obj1.w;
      var t1 = obj1.y;
      var b1 = t1 + obj1.h;

      var l2 = obj2.x;
      var r2 = l2 + obj2.w;
      var t2 = obj2.y;
      var b2 = t2 + obj2.h;    

      if(r1>l2&&r2>l1&&t2<b1&&t1<b2){
        return true;
      }else{
        return false;
      }
    }

    function animate(){
      frameNum++;
      if(frameNum%60==0){
        //向蛇身数组添加上一个位置（身体对象），不是最新，否则位置重叠，蛇头不是红色
        snakeBody.push({
          x: snakeHead.x,
          y: snakeHead.y,
          w: 20,
          h: 20,
          color: "#00ff00",
        })
        switch (snakeDirection) {
          case "left":
            snakeHead.x -= snakeHead.w;
            break;
          case "right":
            snakeHead.x += snakeHead.w;
            break;
          case "top":
            snakeHead.y -= snakeHead.h;
            break;
          case "bottom":
            snakeHead.y += snakeHead.h;
            break;
        }

        //删除数组第一位，移除不用的身体
        if(snakeBody.length>4){
          if(collisionBool){  
            snakeBody.shift();
          }else{
            collisionBool = true;
          }
        }
      }
      
      //绘制蛇头
      drawSnake(snakeHead);
      //绘制蛇身
      for(var i=0;i<snakeBody.length;i++){
        var snakebody=snakeBody[i];
        drawSnake(snakebody);
      }

      //绘制食物
      for(var i=0;i<food.length;i++){
        var foodObjs = food[i];
        drawSnake(foodObjs);
        if(collision(snakeHead,foodObjs)){
          console.log("collision sucess!")
          collisionBool = false;
          foodObjs.reset();
        }
      }

      context.draw();//绘制画布
 
      requestAnimationFrame(animate);//回调函数，达到循环
    }

    //生成食物坐标等相关属性的函数
    function rand(min, max) {
      return parseInt(Math.random() * (max - min));
    }
    function foodFn() {
      this.x = rand(0,winWidth);
      this.y = rand(0,winHeight);
      var w = rand(10,30);
      this.w = w;
      this.h = w;
      this.color = "rgb("+rand(0,255)+","+rand(0,255)+","+rand(0,255)+")";

      this.reset = function(){
        this.x = rand(0, winWidth);
        this.y = rand(0, winHeight);
        this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")";        
      }
    }

    wx.getSystemInfo({
      success: function (res) {
        winWidth = res.windowWidth;
        winHeight = res.windowHeight;
        for(var i=0;i<20;i++){
          var foodObj = new foodFn();
          food.push(foodObj);
        }
        animate();
      }
    })

  },

  canvasEnd:function(){
    snakeDirection = direction;
  }
})
