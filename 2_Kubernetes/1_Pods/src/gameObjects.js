//*******************************************Main Character*************************
	var dude = function(){
		this.xaxis= 600; //x pos
		this.yaxis= 100; //y pos
		this.defaultSpeed = 6; //x movement speed
		this.character = new Image();
		this.character.src = "images/Geek-Character.png";
		this.gravity = 0.15;
		this.gravitySpeed =0;
		this.allowJump = false;
		this.jumpVelocity = 0;
		this.jumpSpeed = -9
		this.width = 345;
		this.visible = true;
		//draw the geek
		this.draw = function (){
			//movement utiltiy
			this.xspeed = 0;
			this.yspeed =0;
			//set movement speed
			if (myGame.keys && myGame.keys[37]) {this.xspeed = - this.defaultSpeed; }
			if (myGame.keys && myGame.keys[39]) {this.xspeed = this.defaultSpeed; }
			if (myGame.keys && myGame.keys[32]) {
				 if(this.allowJump){
					this.jump();
				 	this.allowJump = false;
				 }
			
			}
			
			this.xaxis += this.xspeed;
			this.yaxis += this.yspeed + this.gravitySpeed + this.jumpVelocity;
			//actuall moving part NOTE: Collision should be 
			if(arguments.length >0){
				for (i=0;i<arguments.length;i++){
						//console.log(this.collision(arguments[i]));\
						if(this.collision(arguments[i])){
							console.log(this.collision(arguments[i]));
							arguments[i].visible = false;
						}
				}
			}



			if (this.yaxis + 300 >(myGame.canvas.height - 30)){
				//hit bottom
				 if (this.allowJump == false){
				 	this.gravitySpeed = 0;
				 	this.jumpVelocity = 0;
				 	this.allowJump = true;
				}
				 if (this.allowJump){
					this.gravitySpeed = 0;
				}
				
			} else{
				this.gravitySpeed += this.gravity;
			}
			
			
		
		//draw the image
		myGame.context.drawImage(this.character,this.xaxis ,this.yaxis);
		}
		this.jump = function(){
			this.jumpVelocity = this.jumpSpeed;
		}
		
		this.collision = function(gamePiece){
			var myleft = this.xaxis+165;
			var myright = this.xaxis+165+180;
			var mytop = this.yaxis;
			var mybottom = this.yaxis+310;
			var otherleft = gamePiece.xaxis;
			var otherright = gamePiece.xaxis + gamePiece.width;
			var othertop = gamePiece.yaxis;
			var otherbottom = gamePiece.yaxis + gamePiece.height;
			//uncompleted collision
			if (((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright))) {
               	return false;

    	}
    	else if(gamePiece.visible == true){
    		return gamePiece.charID;
    	}

	}
	}
//Floor
	function floor(x, y, width, height){
		this.xaxis = x;
		this.yaxis = y;
		this.width = width;
		this.height = height;
		this.charID = 2;
		this.visible = true;
		this.draw = function(){
			myGame.context.fillRect(this.xaxis,this.yaxis,this.width,this.height);	
		}
	}


//level1 Background

    function level1BackgroundObject(){
        this.xaxis = 0;
        this.yaxis = 0;
        this.length = 9710;
        this.height = 1080;
        this.levelImage = new Image;
            this.levelImage.src = "images/Level_1_v2.png";
        this.draw = function(){
            myGame.context.drawImage(this.levelImage,0,-180);
        }
    }



//Milk
    function MikeMilk (x,y){
        this.xaxis = x;
        this.yaxis = y;
        this.width = 57;
        this.height = 130;
        this.visible = true;
        this.charID = 3;
        this.MilkImage = new Image;
            this.MilkImage.src = "images/MikeMilk.png";
        this.draw =function(){
            myGame.context.drawImage(this.MilkImage,this.xaxis,this.yaxis);
        }
    }


//trashcan
    function trashCan (x,y){
        this.xaxis = x;
        this.yaxis = y;
        this.width = 102;
        this.height = 114;
        this.visible = true;
        this.charID = 90;
        this.trashImage = new Image;
            this.trashImage.src ="images/trashcan.png";
        this.draw = function(){
            myGame.context.drawImage(this.trashImage, this.xaxis, this.yaxis);
        }
    }


//WineBottle

    function wineBottle(x,y){
        this.xaxis = x;
        this.yaxis = y;
        this.width = 90;
        this.height = 160;
        this.visible = true;
        this.charID = 4;
        this.bottleImage = new Image;
            this.bottleImage.sr = "images/WineBottle.png";
        this.draw = function(){
            myGame.context.drawImage(this.bottleImage, this.xaxis, this.yaxis);
        }
            
    }


//CecylingBin

    function recylingBin(x,y){
        this.xaxis = x;
        this.yaxis = y;
        this.width = 146;
        this.height = 115;
        this.visible = true;
        this.charID =5;
        this.binImage = new Image;
            this.binImage.src = "images/recyclingbin.png";
        this.draw = function(){
            myGame.context.drawImage(this.binImage, this.xaxis, this.yaxis);   
        }
    }


//pizza
    function pizzaBox(x,y){
        this.xaxis = x;
        this.yaxis = y;
        this.width = 129;
        this.height = 105;
        this.visible = true;
        this.charID =6;
        this.pizzaBoxImage = new Image;
            this.pizzaBoxImage.src = "images/PizzaBox.png";
        this.draw = function(){
            myGame.context.drawImage(this.pizzaBoxImage, this.xaxis, this.yaxis);   
        }
    }

//newspaper 

    function newsPaper(x,y){
        this.xaxis = x;
        this.yaxis = y;
        this.width = 132;
        this.height = 131;
        this.visible = true;
        this.charID =7;
        this.newsPaperImage = new Image;
            this.newsPaperImage.src = "images/PizzaBox.png";
        this.draw = function(){
            myGame.context.drawImage(this.newsPaperImage, this.xaxis, this.yaxis);   
        }
    }

//dumpster
    function dumpster(x,y){
        this.xaxis = x;
        this.yaxis = y;
        this.width = 154;
        this.height = 146;
        this.visible = true;
        this.charID =8;
        this.dumpsterImage = new Image;
            this.dumpsterImage.src = "images/dumpster.png";
        this.draw = function(){
            myGame.context.drawImage(this.dumpsterImage, this.xaxis, this.yaxis);   
        }
    }


//BagOfCans

    function bagOfCans(x,y){
        this.xaxis = x;
        this.yaxis = y;
        this.width = 154;
        this.height = 146;
        this.visible = true;
        this.charID =9;
        this.bagOfCansImage = new Image;
            this.bagOfCansImage.src = "images/BagOfCans.png";
        this.draw = function(){
            myGame.context.drawImage(this.bagOfCansImage, this.xaxis, this.yaxis);   
        }
    }






























	
