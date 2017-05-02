var express = require('express')
var app = express();
var http = require('http').Server(app);
var path = require('path');
var map = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];
var bots = [[0, 0, [0,0]],[0, 0, [0,0]],[0, 0, [0,0]],[0, 0, [0,0]],[0, 0, [0,0]],[0, 0, [0,0]],[0, 0, [0,0]],[0, 0, [0,0]],[0, 0, [0,0]],[0, 0, [0,0]],[1, 0, [9,9]],[1, 0, [9,9]],[1, 0, [9,9]],[1, 0, [9,9]],[1, 0, [9,9]],[1, 0, [9,9]],[1, 0, [9,9]],[1, 0, [9,9]],[1, 0, [9,9]],[1, 0, [9,9]],[1, 0, [9,9]]];

function checkLegal(id, move) {
  if(bots[id][2][0]===0 && move[0] === -1) {
    return false;
  } else if(bots[id][2][0]===9 && move[0] === 1) {
    return false;
  } else if(bots[id][2][1]===0 && move[1] === -1) {
    return false;
  } else if(bots[id][2][1]===9 && move[1] === 1) {
    return false;
  };
  return true;
};

function resolve(id, move) {
  console.log(map[bots[id][2][1] + move[1]]);
  console.log(map[bots[id][2][1] + move[1]][bots[id][2][0] + move[0]]);
  if(map[bots[id][2][1] + move[1]][bots[id][2][0] + move[0]]===0) {
    map[bots[id][2][1]][bots[id][2][0]] = 0;
    map[bots[id][2][1] + move[1]][bots[id][2][0] + move[0]] = id;
    bots[id][2][0] = bots[id][2][0] + move[0];
    bots[id][2][1] = bots[id][2][1] + move[1];
    return true;
  } else if(bots[map[bots[id][2][1] + move[1]][bots[id][2][0] + move[0]]][0] === bots[id][0]) {
    map[bots[id][2][1]][bots[id][2][0]] = 0;
    map[bots[id][2][1] + move[1]][bots[id][2][0] + move[0]] = id;
    bots[id][2][0] = bots[id][2][0] + move[0];
    bots[id][2][1] = bots[id][2][1] + move[1];
    return true;
  } else {
    var count = [0, 0, 1];
    while(count[0] === count[1]) {
      if(bots[map[bots[id][2][1]+move[1]*(count[2]+1)][bots[id][2][0]+move[0]*(count[2]+1)]][0]!=bots[id][0]&&bots[map[bots[id][2][1]+move[1]*(count[2]+1)][bots[id][2][0]+move[0]*(count[2]+1)]][0]!=0) {
        count[1] += 1;
      }else{
        count[0] += 1;
        break
      };
      if(bots[map[bots[id][2][1]-move[1]*count[2]][bots[id][2][0]-move[0]*count[2]]][0]===bots[id][0]&&bots[map[bots[id][2][1]-move[1]*count[2]][bots[id][2][0]-move[0]*count[2]]][0]!=0) {
        count[2] +=1;
      }else{
        break
      };
    };
    if(count[0]>count[1]) {
      map[bots[id][2][1]][bots[id][2][0]] = 0;
      map[bots[id][2][1] + move[1]][bots[id][2][0] + move[0]] = id;
      bots[id][2][0] = bots[id][2][0] + move[0];
      bots[id][2][1] = bots[id][2][1] + move[1];
      return true;
    }else{
      map[bots[id][2][1]][bots[id][2][0]] = 0;
      bots[id][2][0] = bots[id][0]*9;
      bots[id][2][1] = bots[id][0]*9;
      return false;
    };
  };
};

function location(id) {
  var returner = [[0, 0, 0],[0, 0, 0],[0, 0, 0]]
  var x = bots[id][2][0];
  var y = bots[id][2][1];
  if(x-1<0||y-1<0) {
    returner[0][0]= -1;
  } else {
    returner[0][0]= map[bots[id][2][1]-1][bots[id][2][0]-1];
  };
  if(y-1<0) {
    returner[0][1]= -1;
  } else {
    returner[0][1]= map[bots[id][2][1]-1][bots[id][2][0]];
  };
  if(x+1>9||y-1<0) {
    returner[0][2]= -1;
  } else {
    returner[0][2]= map[bots[id][2][1]-1][bots[id][2][0]+1];
  };

  if(x-1<0) {
    returner[1][0]= -1;
  } else {
    returner[1][0]= map[bots[id][2][1]][bots[id][2][0]-1];
  };
  returner[1][1] = id;
  if(x+1>9) {
    returner[1][2]= -1;
  } else {
    returner[1][2]= map[bots[id][2][1]][bots[id][2][0]+1];
  };

  if(x-1<0||y+1>9) {
    returner[2][0]= -1;
  } else {
    returner[2][0]= map[bots[id][2][1]+1][bots[id][2][0]-1];
  };
  if(y+1>9) {
    returner[2][1]= -1;
  } else {
    returner[2][1]= map[bots[id][2][1]+1][bots[id][2][0]];
  };
  if(x+1>9||y+1>9) {
    returner[2][2]= -1;
  } else {
    returner[2][2]= map[bots[id][2][1]+1][bots[id][2][0]+1];
  };
  return returner;
};

app.use(express.static(path.join(__dirname, '/pub')));

app.get('/', function(req, res){

  res.render('index.ejs', { data: 'var data =', vars: stringbase});
});

app.get('/play/:id/:x/:y', function(req, res){
  var move = [Number(req.params.x),Number(req.params.y)]
  var id = Number(req.params.id);
  if (checkLegal(id, move)) {
      if(resolve(id, move)) {
        res.send(location(id));
      }else{
        res.send(false);
      };
  } else {
    res.send(false);
  };
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
