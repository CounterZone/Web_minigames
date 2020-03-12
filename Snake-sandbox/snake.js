var moves=[];
var size=10;
var canvas=document.getElementById("board");
var board_width=canvas.clientWidth;
var save=[];
canvas.width=board_width;
canvas.height=board_width;
var cell_width=board_width/size;
var snake=[];
var head=0;
var tail=0;
var max_length=size**2;
var pen=canvas.getContext('2d');
function valid(cell){
if (cell[0]<0 || cell[0]>=size || cell[1]<0 || cell[1]>=size)return false;
for(let i=(tail);i!=head;i=(i+1)%max_length)if (i!= tail && snake[i][0]==cell[0] && snake[i][1]==cell[1])return false;
return true;
}
function reset(){
  snake=[]
  head=0;
  tail=0;
  moves=[];
  init(0,0);
  size=document.getElementById("size").value;max_length=size**2;
  cell_width=board_width/size;
  draw();
}


function init(i,j){
snake=[[i,j]];
}
function extend(direc){
  var new_cell;
  var h=snake[head];
  if (direc=="w"){new_cell=[h[0],h[1]-1];}
  else if (direc=="s") {new_cell=[h[0],h[1]+1];}
  else if (direc=="a"){new_cell=[h[0]-1,h[1]];}
  else if (direc=="d"){new_cell=[h[0]+1,h[1]];}
  if (!valid(new_cell))return false;
  snake[(head+1)%max_length]=new_cell;
  head=(head+1)%max_length;
  moves.push("e");
  return true;
}
function undo(){
  if(moves.length==0)return;
  var s=moves.pop();
  if (s=="e"){
    head=(head-1+max_length)%max_length;
  }else{
    head=(head-1+max_length)%max_length;
    tail=(tail-1+max_length)%max_length;
    snake[tail]=s;
  }
}
function move(direc){
  if( extend(direc)){
    moves.pop();
    moves.push(snake[tail].slice());
    tail=(tail+1)%max_length;
    return true;
  }
  return false;
}
function draw(){
  pen.clearRect(0,0,board_width,board_width)
  for(let i=tail;i!=head;i=(i+1)%max_length){
    x=snake[i][0];
    y=snake[i][1];
  pen.beginPath();
  pen.fillStyle="black";
  pen.rect(x*cell_width, y*cell_width, cell_width-1, cell_width-1);
  pen.fill();
}
for(let i=tail;i!=head;i=(i+1)%max_length){
pen.beginPath();
pen.strokeStyle="red";
pen.lineWidth=5;
pen.moveTo((snake[i][0]+0.5)*cell_width, (snake[i][1]+0.5)*cell_width);
pen.lineTo((snake[(i+1)%max_length][0]+0.5)*cell_width, (snake[(i+1)%max_length][1]+0.5)*cell_width);
pen.stroke();
}
pen.beginPath();
pen.fillStyle="red";
pen.rect(snake[head][0]*cell_width, snake[head][1]*cell_width, cell_width-1, cell_width-1);
pen.fill();
}
