	var sprite = function(options){
		//options you must send are ticks per frame, number of frames, context, width, height, image
		this.frameindex = 0;
		this.tickCount = 0;
		this.ticksPerFrame= options.ticksPerFrame; // how man ticks before changing frame
		this.numberOffFrames = options.numberOfFrames; // how many frames/images in the sprite doc
		this.context = options.context; //where to to draw the sprite--> pass the main game board
		this.width = options.width; // width of the ENTIRE sprite page
		this.height = options.height; //height of the ENTIRE sprite page
		this.image = options.image; //the actual image of the sprite
		this.yaxis = options.yaxis;
		this.xaxis= options.xaxis; 
		
		
		this.update = function(){
			this.tickCount +=1;
			if (this.tickCount > this.ticksPerFrame){
				this.tickCount = 0;
				if (this.frameindex < this.numberOffFrames - 1){
					this.frameindex +=1;	
				}else{
					this.frameindex = 0;
				}
			}
		};
		
		this.draw = function(){
				this.context.drawImage(
				this.image,
				this.frameindex * this.width / this.numberOffFrames,
				0,
				this.width /this.numberOffFrames,
				this.height,
				this.xaxis,
				this.yaxis,
				this.width / this.numberOffFrames,
				this.height
				);
		}
	};