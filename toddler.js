var animalImages;
var animalCalls;
var animalNames;
var animalText;
var buttons;
var whileDragging = false;
var imageSize = 200;
var dir = "./content/animals/";
var speakImage;

function preload(){
	loadFileNames();
	speakImage = loadImage("./content/speaker.png");
}

function setup() {
	createButtons();
	positionButtons();
	createCanvas(windowWidth, windowHeight-10);
	background(0);
	textSize(62);
	fill(255);
}

function draw() {
	background(0);
	for(var i = 0 ; i < buttons.length ; i++){
		buttons[i].display();
	}
}

function mouseDragged(){
	whileDragging = true;
	for(var i = 0 ; i < buttons.length ; i++){
		// buttons[i].x=buttons[i].x+(mouseX-pmouseX);
		buttons[i].y=buttons[i].y+(mouseY-pmouseY);
		// if(buttons[0].y>-imageSize*buttons.length && buttons[0].y<1){
		// 	buttons[i].y=buttons[i].y+(mouseY-pmouseY);
		// } else if(buttons[0].y>=1) buttons[0].y=0;
		// else if(buttons[0].y<=-imageSize*buttons.length) buttons[0].y=-imageSize*buttons.length+1;
	}
}

function mouseReleased(){
	if(!whileDragging){
		for(var i = 0 ; i < buttons.length ; i++){
			buttons[i].mouseReleased();
		}
	}
	whileDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionButtons();
}

function loadFileNames(){
	loadStrings(dir+"filenames.txt",loadAnimals);
}

function loadAnimals(result){
	animalCalls = [];
	animalNames = [];
	animalImages = [];
	animalText = [];
	
	print("started loading");
	for( var i = 0 ; i < result.length ; i+=3){
		animalCalls.push(loadSound(dir+result[i]));
		animalNames.push(loadSound(dir+result[i+1]));
		animalImages.push(loadImage(dir+result[i+2]));
		animalText.push(split(result[i+2],".")[0].replace("_"," ").toUpperCase());
		print(Math.trunc(i / result.length*100.0));
	}
	print("finished loading");
}

function createButtons(){
	buttons = [];
	for(var i = 0 ; i < animalImages.length ; i++){
		buttons.push(new Button(0,0,imageSize,imageSize,animalImages[i],animalCalls[i],animalNames[i],animalText[i],false));
	}
	buttons[0].active=true;
}

function positionButtons(){
	for(var i = 0 ; i < buttons.length ; i++){
		buttons[i].x=0;
		buttons[i].y=i*imageSize;
	}
}

class Button {
  
  constructor(inX, inY, w, h, inImg, myCall, myName, myText, myActive) {
    this.x = inX;
    this.y = inY;
    this.width = w;
    this.height = h;
    this.img = inImg;
    this.call = myCall;
    this.animalName = myName;
    this.animalText = myText;
    this.active = myActive;
    this.speakX = imageSize+20;
    this.speakY = 31;
    this.speakWidth = 50;
    this.speakHeight = 50;
  }
  
  display() {
    image(this.img, this.x, this.y, this.width, this.height);
    if(this.active){
    	var w = windowWidth*.5;
    	if(w<300)w=300;
    	image(this.img, imageSize+10, 100, w, w);
    	image(speakImage, this.speakX, this.speakY, this.speakWidth, this.speakHeight);
    	text(this.animalText,imageSize+80,80);
    }
  }
  
  over() {
    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
      return true;
    } else {
      return false;
    }
  }

  overSpeaker(){
  	if (mouseX > this.speakX && mouseX < this.speakX + this.speakWidth && 
  		mouseY > this.speakY && mouseY < this.speakY + this.speakHeight) {
      return true;
    } else {
      return false;
    }	
  }

  playCallSound(){
  	if(!this.call.isPlaying()) this.call.play();
  }

  playNameSound(){
  	if(!this.animalName.isPlaying()) this.animalName.play();	
  }

  mouseReleased(){
  	if(mouseX<imageSize){
	  	if(this.over()) {
	  		this.playCallSound();
	  		this.active = true;
	  	} else {
	  		this.active = false;
	  	}
  	} else {
  		if(this.overSpeaker() && this.active){
  			this.playNameSound();
  		}
  	}
  }
}