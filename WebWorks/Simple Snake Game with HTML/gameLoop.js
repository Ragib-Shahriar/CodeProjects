var iter = 0;

var canvas;
var context;
var score;
var iter;
var pressedKey;
var interval;
var snake;
var points;
var debug;
var running;

// initializing the variables
function start(){
    score = 0;
    running = true;
    debug = false;
    canvas = document.getElementById("myCanvas");
    canvas.width = 300;
    canvas.height = canvas.width;

    context = canvas.getContext("2d");
    iter=0;
    pressedKey = '';
    interval = setInterval(update, 100);
    window.addEventListener("keydown",keyCheck,true); // Key down event is added to window
    snake = new Snake(20,20,10);
    points = new Points();

    // touch event is added to canvas, to use in mobile
    canvas.addEventListener("touchstart", function(event){ 
        const rect = canvas.getBoundingClientRect() //returns the bounding box size
        var w = rect.width
        var h = rect.height
        
        var x = event.touches[0].clientX - rect.left;
        var y = event.touches[0].clientY  - rect.top;

        if(x<w/4){
            pressedKey="a"
        }
        else if(x>w-w/4){
            pressedKey="d"
        }
        if(y<h/4){
            pressedKey = "w"
        }
        else if(y>h-h/4){
            pressedKey = "s"
        }

        if(debug){ // debug section
            document.getElementById("debug").innerHTML = "touched "+x+" "+y+"<br>"+"window: "+w+" "+h;
        }
    } , false);
    
    function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        console.log("x: " + x + " y: " + y)
        var w = rect.width
        var h = rect.height
        console.log(w+' '+h)

    }
    
    canvas.addEventListener('mousemove', function(e) { // not needed for the game
        getCursorPosition(canvas, e)
    })
}

// Snake class
class Snake{
    bodyArr = []; // the body index of the array in grid
    movDir = 'd';
    static axisLength = 7;
    longAxisLength = 7; // Fill size for each part of the snake
    smallAxisLenght = 7;
    xFillLenght = this.longAxisLength;
    yFillLenght = this.smallAxisLenght;
    prevXFillLenght = this.xFillLenght;
    prevYFillLenght = this.yFillLenght;

    constructor(posx, posy, size){
        this.posx = posx;
        this.posy = posy;
        this.size = size;
        for(var i=0;i<this.size;i++){
            this.bodyArr.push([posx-i,posy]);
        }
    }

    update(){
        var xincr = 0;
        var yincr = 0;
        if(pressedKey != ''){
            this.movDir = pressedKey;
        }
        if(this.movDir == 'd'){
            xincr = 1;
        }
        else if(this.movDir == 'w'){
            yincr = -1;
        }
        else if(this.movDir == 's'){
            yincr = 1;
        }
        else if(this.movDir == 'a'){
            xincr = -1;
        }
        
        // Moving the the whole body to it's next body index position, except the head of the snake
        for(var i=this.bodyArr.length-1;i>0;i--){
            this.bodyArr[i]=[this.bodyArr[i-1][0],this.bodyArr[i-1][1]];
        }
        this.bodyArr[0]=[this.bodyArr[0][0]+xincr,this.bodyArr[0][1]+yincr]; // moving the head

        // Checking if snake has collided with it self
        for(var i=this.bodyArr.length-1;i>0;i--){
            if(this.bodyArr[i][0]==this.bodyArr[0][0] && this.bodyArr[i][1]==this.bodyArr[0][1] ){
                running=false;
                document.getElementById("score").innerHTML="Game Over";
            }
        }
        

        var gridSize = Math.floor(canvas.width/Snake.axisLength); //Grid size is the numerical representation of the whole canvas
        // Teleporting through left to right or up to down or so on...
        if(this.bodyArr[0][0]>gridSize){
            this.bodyArr[0][0] = 0;
        }
        else if(this.bodyArr[0][0]<0){
            this.bodyArr[0][0] = gridSize;
        }
        if(this.bodyArr[0][1]>gridSize){
            this.bodyArr[0][1] = 0;
        }
        else if(this.bodyArr[0][1]<0){
            this.bodyArr[0][1] = gridSize;
        }

        // Checking collision with points. Updating score.
        for(var i=0;i<points.pointsData.length;i++){
            if(points.pointsData[i][0]==this.bodyArr[0][0] && points.pointsData[i][1]==this.bodyArr[0][1]){
                points.pointsData.splice(0,1);
                points.generateNewPoint = true;
                score = score+1;
                document.getElementById("score").innerHTML = 'score: '+score;
                this.bodyArr.push([-10,0]);
                this.bodyArr.push([-10,0]);
                this.bodyArr.push([-10,0]);
            }
        }

    }


    render(){
        context.beginPath();
        for(var i=0;i<this.bodyArr.length;i++){
            // bodyArr consist grid size, grid indices are filled with the length xFillLenght and yFillLenght in canvas
            context.rect(this.bodyArr[i][0]*this.xFillLenght, this.bodyArr[i][1]*this.yFillLenght, this.xFillLenght, this.yFillLenght);
            context.fillStyle = "red";
            context.fill();
            context.strokeStyle = "black";
            context.lineWidth = 1;
            context.stroke();
        }
    }

    printData(){
        console.log('Snake Detail - > posx: '+this.posx+' posy: '+this.posy+' size: '+this.size);
    }
    printBody(){
        for(var i=0;i<this.bodyArr.length;i++){
            console.log('Snake Body - > '+this.bodyArr[i].toString());
        }
    }
}

// Point class. This needed not to be a class. In case for multiple points in sigle frame this could be used.
class Points{
    pointsData = [];
    gridSize = null;
    pointFillSize = Snake.axisLength;
    generateNewPoint = true;
    constructor(){
        this.gridSize = Math.floor(canvas.width/Snake.axisLength);
    }

    update(){
        var rn = Math.random();
        if(this.generateNewPoint){ // Just generate on point if generateNewPoint is toogled to true
            this.pointsData.push([Math.floor(Math.random() * this.gridSize),Math.floor(Math.random() * this.gridSize)]);
            // console.log(this.gridSize);
            this.generateNewPoint = false;
        }
        
    }
    render(){
        context.beginPath();
        context.fillStyle = "black";
        for(var i=0;i<this.pointsData.length;i++){
            context.rect(this.pointsData[i][0]*this.pointFillSize,this.pointsData[i][1]*this.pointFillSize,this.pointFillSize,this.pointFillSize);
        }
        context.fill();
        context.stroke();
    }
    printBody(){
        for(var i=0;i<this.pointsData.length;i++){
            console.log('Point Body - > '+this.pointsData[i].toString());
        }
    }
}




function update(){      
    console.log("updating");
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    
    iter=iter+1;
    
    
    if(pressedKey == 'q' || running==false){
        clearInterval(interval);        // stop running
    }
    snake.update();
    snake.render();
    points.update();
    points.render();
    // points.printBody();
    // snake.printBody();
}

function keyCheck(event){ // key code event listner, which was added to window.
    var code = event.keyCode;
    
    if(code == 87 || code ==119){
        pressedKey = 'w';
    }
    else if(code == 65 || code == 97){
        pressedKey = 'a';
    }
    else if(code == 83 || code==115){
        pressedKey = 's';
    }
    else if(code == 68 || code == 100){
        pressedKey = 'd';
    }
    else if(code == 81 || code == 113){
        pressedKey = 'q';
    }
    else{
        pressedKey = '';
    }
    if(pressedKey!=''){
        console.log("pressed key : "+pressedKey);
        if(debug){
            document.getElementById("debug").innerHTML = code;
        }
    }
}
            