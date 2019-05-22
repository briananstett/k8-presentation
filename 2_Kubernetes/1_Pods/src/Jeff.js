	var Jeff = function(options){
		//Jeff's sprite properties
		this.frameindex = 0;
		this.tickCount = 0;
		this.ticksPerFrame= options.ticksPerFrame; // how man ticks before changing frame
		this.numberOffFrames = options.numberOfFrames; // how many frames/images in the sprite doc
		this.context = options.context; //where to to draw the sprite--> pass the main game board
		this.width = options.width; // width of the ENTIRE sprite page
		this.fakeWidth = this.width/ this.numberOffFrames; //"Camera ready width" the width of any given frame in the sprite
		this.height = options.height; //height of the ENTIRE sprite page
		this.yaxis = options.yaxis;
		this.xaxis= options.xaxis; 
		this.lastDirrection = "right";
		//**************Jeff's movement properties
		this.defaultSpeed = 6; //x movement speed
		this.gravity = 0.15;
		this.gravitySpeed =0;
		this.allowJump = false;
		this.jumpVelocity = 0;
		this.jumpSpeed = -9
		this.visible = true;
        //Jeff's iamges
		this.jumpRight = new Image;
			this.jumpRight.src = "images/jumping_right.png";
		this.jumpLeft = new Image;
			this.jumpLeft.src = "images/jumping_left.png";
		this.standingRight = new Image;
			this.standingRight.src = "images/stand_right.png";
		this.standingLeft = new Image;
			this.standingLeft.src = "images/stand_left.png";
        this.imageRight = new Image;
		  this.imageRight.src = "images/spritegrid_jeff_v1.png";
        this.imageLeft = new Image;
		  this.imageLeft.src = "images/spritegrid_jeff_v1_left.png";
        //jeff's Backpack
        this.inventory = [];
		
		
		this.spriteUpdateDraw = function(direction){//based off of direction, draw different sprites
			if (direction){
		    	this.tickCount +=1;
        			if (this.tickCount > this.ticksPerFrame){//mech for moving through sprite annimations within sprite image
        				this.tickCount = 0;
        				if (this.frameindex < this.numberOffFrames - 1){
        					this.frameindex +=1;	
        				}else{
        					this.frameindex = 0;
        				}
        			}
				if(direction == "left"){//if direction left move through sprite-moving-left.pic
					this.context.drawImage(
					this.imageLeft,
					this.frameindex * this.width / this.numberOffFrames,
					0,
					this.width /this.numberOffFrames,
					this.height,
					this.xaxis,
					this.yaxis,
					this.width / this.numberOffFrames,
					this.height
					);
				}else if (direction == "right"){//if direction right move through sprite-moving-right.pic
					this.context.drawImage(
					this.imageRight,
					this.frameindex * this.width / this.numberOffFrames,
					0,
					this.width /this.numberOffFrames,
					this.height,
					this.xaxis,
					this.yaxis,
					this.width / this.numberOffFrames,
					this.height
					);
				}else if (direction == "jump"){//if direction jump determine which direction to jump
					if(this.lastDirrection == "right"){//if we are facing right, draw jump-right
						this.context.drawImage(this.jumpRight,this.xaxis, this.yaxis);	
					}else{//if we are facing left, draw jump left
						this.context.drawImage(this.jumpLeft,this.xaxis, this.yaxis);
					}
				    
				 }
			}else{//updatesprite was called but no value was passed
				if(this.lastDirrection == "right"){//if facing right draw standing right
					this.context.drawImage(this.standingRight, this.xaxis, this.yaxis);	
				}else{//if facing left draw standing left
					this.context.drawImage(this.standingLeft, this.xaxis, this.yaxis);	
				}
			}
		};
		
		
		this.gravityFunction = function(){
		    if (this.yaxis + this.height >(myGame.canvas.height - 30)){//hit rock bottom
				 if (this.allowJump == false){//just hit the ground, stop gravity, allow jump
				 	this.gravitySpeed = 0;
				 	this.jumpVelocity = 0;
				 	this.allowJump = true;
				}
				 if (this.allowJump){//been on the ground for at least one frame, allow to jump
					this.gravitySpeed = 0;
				}
				
			} else{//in the air some where
				this.gravitySpeed += this.gravity;
				 this.spriteUpdateDraw("jump");
			}
		}
		
		
		this.jump = function(){
			this.jumpVelocity = this.jumpSpeed;
		}
		
		
		this.collision = function(gamePiece){
			var myleft = this.xaxis;
			var myright = this.xaxis + (this.fakeWidth - 30);
			var mytop = this.yaxis;
			var mybottom = this.yaxis + this.height;
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
		
		
		this.draw = function(gamePieceObject){
		    this.xspeed = 0;
			this.yspeed =0;
		    if (myGame.keys && myGame.keys[37]) {
		    	if(this.allowJump){
		    		this.lastDirrection = "left";
		    	}
		    	this.xspeed = - this.defaultSpeed;
			}
			 if (myGame.keys && myGame.keys[39]) {
		    	if(this.allowJump){
		    		this.lastDirrection = "right";
		    	}
			    this.xspeed = this.defaultSpeed;
			    }
			if (myGame.keys && myGame.keys[32]) {
				  if(this.allowJump){
				 	this.jump();
				  	this.allowJump = false;
				 }
			}
		
			if(this.allowJump && myGame.keys &&  ( myGame.keys[37] || myGame.keys[39]))
				this.spriteUpdateDraw(this.lastDirrection);
			else{ 
				if(this.allowJump){
					this.spriteUpdateDraw();
				}
			}
		    this.xaxis += this.xspeed;
			this.yaxis += this.yspeed + this.gravitySpeed + this.jumpVelocity;
             for (var key in gamePieceObject) {
                    if (gamePieceObject.hasOwnProperty(key)) {
                        if(this.collision(gamePieceObject[key])){
                            if(this.collision(gamePieceObject[key]) >= 90){//Any bad objec that will end the game needs to have a charId 90 or higher
                                myGame.stop();//game over
                                alert("Game Over!")
                                //Place game over code here !=! 
                            }
                            console.log(this.collision(gamePieceObject[key]));
                            this.inventory.push(gamePieceObject[key].charID);
                            gamePieceObject[key].visible = false;
                            
                        }
			         }
             }
			this.gravityFunction();
			
		}
        
        
        this.inventoryReset = function(){
            //resests the inveroty after level completion
            this.inventory =[];
        }
	}
	