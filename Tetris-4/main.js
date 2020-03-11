width=12;
height=17;
var poses=[
  [[[0,0],[-1,0],[1,0],[0,1]],[[0,0],[0,-1],[0,1],[-1,0]],[[0,0],[-1,0],[1,0],[0,-1]],[[0,0],[0,-1],[0,1],[1,0]]],//T
[[[0,0],[1,0],[0,1],[0,2]],[[0,0],[0,1],[-1,0],[-2,0]],[[0,0],[0,-1],[-1,0],[0,-2]],[[0,0],[0,-1],[1,0],[2,0]]],//J
[[[0,0],[0,-1],[0,1],[0,2]],[[0,0],[-1,0],[-2,0],[1,0]]]//I
,[[[0,0],[-1,0],[0,1],[0,2]],[[0,0],[0,-1],[-1,0],[-2,0]],[[0,0],[0,-1],[1,0],[0,-2]],[[0,0],[0,1],[1,0],[2,0]]]//L
,[[[0,0],[0,1],[1,0],[-1,1]],[[0,0],[0,-1],[1,0],[1,1]]]//Z
,[[[0,0],[-1,0],[0,1],[1,1]],[[0,0],[0,1],[1,0],[1,-1]]]//S
,[[[0,0],[0,1],[1,1],[1,0]]]//O
];
var direcs={"w":[0,-1],"a":[-1,0],"s":[0,1],"d":[1,0]}
var canvas=document.getElementById("board");
var board_width=canvas.clientWidth;

canvas.width=board_width;
canvas.height=board_width;
var cell_width=(board_width-10)/(width+height*2);
var pen=canvas.getContext('2d');
pen.textBaseline="middle";
pen.textAlign="center";
class board{
constructor(){this.start();}
start(){

  this.score=0;
  this.over=false;
  this.cells=null;
  this.pre_loc=[];
  this.grid=new Array(width+height*2);
  for (var i=0;i<width+height*2;i+=1)this.grid[i]=new Array(width+height*2);



function* bag (){
  let perm=[0,1,2,3,4,5,6];
  let index=0;
  while(1){
    if (index==999)
      for (let i=0;i<7;i+=1){
        var target=i+Math.floor(Math.random()*(7-i));
        var tmp=perm[target];
        perm[target]=perm[0];
        perm[0]=tmp;
      }
    index=(index+1)%7;
    yield perm[index];
  }
}

this.next_pos_generator=bag();
this.drawborder();
this.pre_block();
this.new_block();
}
drawborder(){
  pen.font= "30px Calibri";
  pen.fillText("NEXT",cell_width*height/4+5,5+cell_width*height/4); pen.fillText("HOLD",cell_width*height*0.75+5,5+cell_width*height/4);

  pen.fillText("SCORE",cell_width*(height*1.5+width)+5,5+cell_width*height/4);
  pen.fillText(this.score,cell_width*(height*1.5+width)+5,60+cell_width*height/4);
  pen.fillText(this.score,cell_width*(height*1.5+width)+5,60+cell_width*height/4);
  pen.fillText("WASD => Move",cell_width*height/2+5,cell_width*(height*1.5+width)+5-30);
pen.fillText("Space => Drop",cell_width*height/2+5,cell_width*(height*1.5+width)+5+30);
pen.fillText("R => Rotate",cell_width*(height*1.5+width)+5,cell_width*(height*1.5+width)+5-30);
pen.fillText("H => Hold",cell_width*(height*1.5+width)+5,cell_width*(height*1.5+width)+5+30);


pen.beginPath();
  pen.rect(height*cell_width+5,5,width*cell_width,board_width-10);
pen.stroke();
pen.rect(5,5+height*cell_width,board_width-10,width*cell_width);
pen.stroke();
pen.clearRect(5+height*cell_width,5+height*cell_width,width*cell_width,width*cell_width);
}
pre_block(){


this.next_pos=this.next_pos_generator.next().value;
var cells=[];
for (var i=0;i<4;i+=1) cells[i]=[poses[this.next_pos][0][i][0]+Math.floor(height/4)-1,poses[this.next_pos][0][i][1]+Math.floor(height/2)-1];
this.next_cells=cells;
}
gameover(){
this.over=true;

pen.clearRect(0,0,board_width,board_width);
this.drawborder();
pen.font= "40px Arial";
pen.fillText("Game Over",board_width/2,board_width/2);
pen.font= "20px Arial";
pen.fillText("Press R to Restart",board_width/2,board_width/2+50);

}
new_block(){
//types=["T","L","I","J","Z","S","O"];
this.pos=this.next_pos;
this.pre_block();
this.conformation=0;
var pos=poses[this.pos][0];
var cells=[];
for (var i=0;i<4;i+=1) cells[i]=[pos[i][0]+height+Math.floor(width/2),pos[i][1]+height+Math.floor(width/2)];
this.cells=cells;
this.pre_drop();
this.repaint();
}
rotate(){
  this.conformation=(1+this.conformation)%poses[this.pos].length;
   for (var i=0;i<4;i+=1)this.cells[i]=[this.cells[0][0]+poses[this.pos][this.conformation][i][0],this.cells[0][1]+poses[this.pos][this.conformation][i][1]];
this.wall_kick();
 this.pre_drop();
 this.repaint();
}
wall_kick(){
  var min_x,min_y,max_x,max_y;
  [min_x,min_y,max_x,max_y]=[Math.min(...this.cells.map((a)=>{return a[0];})),Math.min(...this.cells.map((a)=>{return a[1];})),Math.max(...this.cells.map((a)=>{return a[0];})),Math.max(...this.cells.map((a)=>{return a[1];}))];
  if(min_x<height)this.cells.map((a)=>{a[0]+=height-min_x;});
  else if(max_x>=width+height)this.cells.map((a)=>{a[0]-=max_x-height-width+1;});
  if(min_y<height)this.cells.map((a)=>{a[1]+=height-min_y;});
  else if(max_y>=width+height)this.cells.map((a)=>{a[1]-=max_y-height-width+1;});
}
hold(){
  var t=this.pos;
  if(this.hold_cells){this.pos=this.hold_pos;for (var i=1;i<4;i+=1) this.cells[i]=[poses[this.pos][0][i][0]+this.cells[0][0],poses[this.pos][0][i][1]+this.cells[0][1]];this.wall_kick();}
  else{ this.new_block();this.hold_cells=[];}
  this.hold_pos=t;
  for (var i=0;i<4;i+=1) this.hold_cells[i]=[poses[this.hold_pos][0][i][0]+Math.floor(height*0.75)-1,poses[this.hold_pos][0][i][1]+Math.floor(height/2)-1];

  this.pre_drop();
  this.repaint();
}

paintcell(x,y,style="black"){
  pen.beginPath();
  pen.fillStyle=style;
  pen.rect(5.5+x*cell_width, 5.5+y*cell_width, cell_width-1, cell_width-1);
  pen.fill();
}
paint_cells(){
  if(this.cells)
    for (var i of this.cells)this.paintcell(i[0],i[1]);
    if(this.next_cells)
      for (var i of this.next_cells)this.paintcell(i[0],i[1]);
      if(this.hold_cells)
        for (var i of this.hold_cells)this.paintcell(i[0],i[1]);
}
paint_pre_loc(){if(this.pre_loc)
  for (var i in this.pre_loc)
    for (var j in this.pre_loc[i])
      this.paintcell(this.pre_loc[i][j][0],this.pre_loc[i][j][1],"red");
}
move(direc){
  var new_pos=[];
  for (var i=0;i<4;i+=1){
    new_pos[i]=[this.cells[i][0]+direcs[direc][0],this.cells[i][1]+direcs[direc][1]];
    if(new_pos[i][0]<height || new_pos[i][0]>=height+width ||new_pos[i][1]< height || new_pos[i][1]>=height+width){return false;}
  };
  this.cells=new_pos;
  this.pre_drop();
  this.repaint();
}

pre_drop(){
for (var direc in direcs){
  var new_pos=[];
  var pos=[];
  for (var i=0;i<4;i+=1)new_pos[i]=[this.cells[i][0],this.cells[i][1]];
  var crush=false;
  while(!crush){
  for (var i=0;i<4;i+=1)pos[i]=[new_pos[i][0],new_pos[i][1]];
  for (var i=0;i<4;i+=1){
    new_pos[i]=[new_pos[i][0]+direcs[direc][0],new_pos[i][1]+direcs[direc][1]];
    if (new_pos[i][0]<0 || new_pos[i][0]>=2*height+width || new_pos[i][1]>= 2*height+width || new_pos[i][1]<0 || this.grid[new_pos[i][0]][new_pos[i][1]]==1){
      crush=true;
      break;}
}
}
this.pre_loc[direc]=pos;
}
}
drop(){
  for (var i in this.pre_loc){
    for (var j in this.pre_loc[i])
    this.grid[this.pre_loc[i][j][0]][this.pre_loc[i][j][1]]=1;
    var to_check=new Set();
    var elim=[];// full rows

    if (i=="a" || i=="d")for (var j in this.pre_loc[i])to_check.add(this.pre_loc[i][j][0]);
    else for (var j in this.pre_loc[i])to_check.add(this.pre_loc[i][j][1]);
      for (let row of to_check){
        var full=true;
        for(let col=height;col<height+width;col+=1){
        if (i=="w" || i=="s"){var c=row;var r=col;}else{var r=row;var c=col;}
            if( this.grid[r][c]!=1){full=false;break;}
          }
        if (full)elim[elim.length]=row;
      }
      if (elim.length==0)continue;
      this.score+=elim.length;
        if (i=="a" || i=="w"){var d=1;elim.sort(function(a, b){return b-a});}else{var d=-1;elim.sort(function(a, b){return a-b});}
      for (let base_row of elim)for (let row=base_row;row<height-elim.length ||row>= height+width+elim.length;row+=d)
        for(let col=height;col<height+width;col+=1)
            {if (i=="w" || i=="s"){var c=row;var r=col;}else{var r=row;var c=col;}
              var r_set=r+d;
              var c_set=c;
              if (i=="w" || i=="s"){c_set=c+d;r_set=r}
              this.grid[r][c]= this.grid[r_set][c_set];
                this.grid[r_set][c_set]=undefined;
            }
}
for (let i=height;i<width+height;i+=1)for (let j=height;j<width+height;j+=1) if (this.grid[i][j]==1){this.gameover();return;}
this.new_block();

this.repaint();
}
repaint(){
 pen.clearRect(0,0,board_width,board_width);
this.drawborder();
this.paint_pre_loc();
this.paint_cells();
  for(var i =0;i<this.grid.length;i+=1)
    for (var j=0;j<this.grid[0].length;j+=1)
      if (this.grid[i][j]==1)
        this.paintcell(i,j);
}
}
var b=new board();

document.addEventListener('keydown', (event) => {
key=event.key.toLowerCase();
if (!b.over){
  if ("wasd".includes(key))
  b.move(key);
else if (key=="r")b.rotate();else if (key=="h")b.hold();
else if (key==" ")b.drop();}else if (key=="r") b.start();
})
