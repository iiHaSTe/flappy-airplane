//========================================================================================================================================================================================================//
kaboom({
  background: "black"
});

// load sprite by image path
loadSprite("dripstone-down", "images/dripstone-down.png");
loadSprite("dripstone-top", "images/dripstone-top.png");
loadSprite("bg", "images/bg.png"); // load background
loadSprite("plr", "images/player.png"); // load player


layers(['bg', 'obj', 'ui'], 'obj'); // game layers

// player
const player = add([
  sprite("plr"),
  scale(0.6),
  pos(100, 0),
  area(),
  body({
    weight: 0.8
  }),
  origin("center"),
  "player",
]);
function fly(){
  player.jump(400);
}
window.onclick = () => {
  fly();
};
player.onUpdate(() => {
  if (player.pos.y >= window.innerHeight)
    lose();
});
onKeyPress("space", ()=>{
  fly();
});

// ui
const speedText = add([
  text("time: 0", {
    size: 30,
    width: 1000
  }),
  pos(5, 15),
  color([255, 255, 255]),
  layer("ui"),
]);
const scoreText = add([
  text("score: 0", {
    size: 30,
    width: 1000
  }),
  pos(5, 45),
  color([0, 255, 0]),
  layer("ui"),
  {
    score: 0
  }
]);
// background
function animateBg(x){
  add([
    sprite("bg"),
    pos(x, 0),
    layer("bg"),
    scale(1, 3),
    area(),
    "bg",
    {
      speed: -20
    }
  ]);
}
let bgs = 0;
animateBg(0);
onUpdate("bg", (bg)=>{ // animation
  bg.move(bg.speed, 0);
  let pos = bg.pos.x+bg.width;
  if (pos<=window.innerWidth&&bgs<2){
    animateBg(pos);
    bgs += 1;
  }
  if (pos<=0){
    destroy(bg);
    bgs -= 1
  }
});

// dripstone spowner
function spawnPipes(){
  let y = Math.floor(Math.random() * -550);
  if (y > -230)
    y = -230;
  let black = 130;
  add([
    sprite("dripstone-top"),
    pos(window.innerWidth, y),
    color([black, black, black]),
    area(),
    "pipe",
    "top-pipe",
    {
      tacked: false,
    }
  ]);
  add([
    sprite("dripstone-down"),
    pos(window.innerWidth, (600 + y) + 200),
    color([black, black, black]),
    area(),
    "pipe",
    "down-pipe",
    {
      tacked: true
    }
  ]);
}
let lp = setInterval(spawnPipes, 2000);

// lose function
function lose(e){
  destroy(player);
  shake(10);
  clearInterval(lp);
  wait(0.2, ()=>{
    let g = document.createElement("a");
    g.setAttribute("href", "game-over.html");
    g.appendChild(document.createTextNode("gh"))
    document.body.appendChild(g);
    g.click();
  });
  
  every("pipe", e => {
    wait(0.2, ()=>{
      destroy(e);
    });
  });
}

// score system and lose system
let speed = 100;
onUpdate("pipe", (e)=>{
  speed += Math.floor(dt()) % 2 == 0 ? 0.01 : 0;
  speedText.text = `speed: ${speed.toString().slice(0, 7)}`;
  e.move(-speed, 0);
  e.onCollide("player", _=>lose(e));
  if (e.pos.x <= player.pos.x)
    if (!e.tacked){
      scoreText.text = `score: ${++scoreText.score}`;
      e.tacked = true;
    }
  if (e.pos.x < -45)
    destroy(e);
});
onCollide("top-pipe", "down-pipe", (t, d)=>{
  destroy(t);
  destroy(d);
});
