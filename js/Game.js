class Game {
  constructor() {
    this.resetTittle = createElement("h2")
    this.resetButton = createButton("")

  }
  //BP
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  //BP
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  // TA
  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    fuels = new Group ()
    coins = new Group ()

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];

    this.addSprites(fuels,4,fuelImg,0.02)
    this.addSprites(coins,18,coinImg,0.03)
  }

  //BP
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTittle.html("RESET GAME")
    this.resetTittle.position(width - 200,40)

    this.resetButton.class("resetButton")
    this.resetButton.position(width - 150,100 )
  }

  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        playerCount : 0,
        gameState : 0,
        players : {},
      })
      window.location.reload()
    })
  }

  handlePlayersControls(){
    if(keyIsDown(UP_ARROW)){
      player.positionY+=10
      player.update()
    }
    if(keyIsDown(LEFT_ARROW) && player.positionX>width/3 - 50){

      player.positionX-=5
      player.update()
    }
    if(keyIsDown(RIGHT_ARROW) && player.positionX<width/2 + 300){
      player.positionX+=5
      player.update()
    }
  }
  //SA
  play() {

    this.handleElements();
    this.handleResetButton()

    Player.getPlayersInfo(); //added

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);


      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index].position.x = x;
        cars[index].position.y = y;


        //add 1 to the index for every loop
        index = index + 1;

        
        if (index ===  player.index){
          ellipse (x,y,60,60)

          this.handleCoins(index)
          this.handleFuel(index)

          camera.position.x = width/2
          camera.position.y = cars[index-1].position.y
           
          }
      
      }

      // handling keyboard events
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10;
        player.update();
      }
      this.handlePlayersControls()
      
      
      drawSprites();
    }
  }
    addSprites(spritesGroup,numderOfSprite,spritesImg,scale){

      for(var i = 0; i<numderOfSprite;i++){
        var x,y 
        x = random(width/2+150,width/2-150)
        y = random(-height*4.5,height-400)
        var sprites = createSprite(x,y)
        sprites.addImage(spritesImg)
        sprites.scale = scale
        spritesGroup.add(sprites)
      
      }
    }

    handleFuel(index){
      cars[index-1].overlap(fuels,function(coller,colleted){
        player.fuels+= 185
        colleted.remove()
      })
    }
    handleCoins(index){
      cars[index-1].overlap(coins,function(coller,colleted){
        player.score+= 21
        player.update()
        colleted.remove()
        player.update()
      })
    }
    
}

