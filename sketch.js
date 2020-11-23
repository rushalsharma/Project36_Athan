//Create variables here
var dog, happyDog, database, foodS, foodStock;
var dogI,foodI, sdsafs;
var fedTime,lastFed=0,feed,addFood,foodObj;
var readingGameState,changeGameState
var bedI,gardenI,washroomI;
var currentTime;


function preload(){
dogI = loadImage("Dog.png")
sdsafs = loadImage("happy dog.png")
bedI = loadImage("Bed Room.png")
gardenI = loadImage("Garden.png")
washroomI = loadImage("Wash Room.png")

}

function setup() {
  createCanvas(500, 500);
  //background(46, 139, 87);
  database=firebase.database();

  foodObj=new food();

  foodStock=database.ref('food');
  foodStock.on("value",readStock);


  fedTime=database.ref('feedTime');
  fedTime.on("value",function(data){
  lastFed=data.val();
  });

  readingGameState=database.ref('gamestate');
  readingGameState.on("value",function(data){
    changeGameState=data.val();
  });

  dog = createSprite(250,250,20,20);
  dog.addImage(dogI);
  dog.scale=0.2;

  feed=createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("more food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}


function draw() {  
  currentTime=hour();
  
  if(currentTime===(lastFed+1)){
    update("playing");
    foodObj.garden();
  }
  else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("bathing");
    foodObj.washroom();
  }
  else{
    update("hungry");
    foodObj.display();
  }
  
  if(changeGameState!= "hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
  }
  else{
    //clear ();
    //background(46,139,87);
    feed.show();
    addFood.show();
    dog.addImage(dogI);
    //dog = createSprite(250,250,20,20);
    //og.addImage(dogI);
    //dog.scale=0.2;
  }

  drawSprites();

}


function addFoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  });

}

function feedDog(){
// dog.addImage(sdsafs);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
  food:foodObj.getFoodStock(),
  gamestate:"hungry",
    feedTime:hour()
  });
}



function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}

function writeStock(x){
  if(x<=0){
    x=0
  }else{
    x=x-1;
  }


  database.ref('/').update({
    food:x
  });
}


function update(state){
  database.ref('/').update({
    gamestate: state
  });
}

