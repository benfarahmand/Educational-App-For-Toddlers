var animalImages;
var animalCalls;
var animalNames;
var animalText;
var letterSounds;
var buttons;
var textfontsize = 78;
var whileDragging = false;
var speakerWidth = 70;
var speakerHeight = 70;
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
	textSize(textfontsize);
	textAlign(LEFT,TOP)
	fill(255);
}

function draw() {
	background(0);
	for(var i = 0 ; i < buttons.length ; i++){
		buttons[i].display();
	}
}

function mouseDragged(){
	if(mouseX<imageSize){
		whileDragging = true;
		for(var i = 0 ; i < buttons.length ; i++){
			buttons[i].y=buttons[i].y+(mouseY-pmouseY);
		}
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

function mouseWheel(event){
	return false;
	// for(var i = 0 ; i < buttons.length ; i++){
	// 	buttons[i].y=buttons[i].y+event.delta;
	// }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionButtons();
}

function loadFileNames(){
	print("started loading");
	loadStrings("./content/lettersounds.txt",loadLetterSounds)
	loadStrings(dir+"filenames.txt",loadAnimals);
	print("finished loading");
}

function loadLetterSounds(result){
	letterSounds=[];
	for(var i = 0 ; i < result.length ; i++){
		letterSounds.push(loadSound("./content/alphabet/"+result[i]));
	}
}

function loadAnimals(result){
	animalCalls = [];
	animalNames = [];
	animalImages = [];
	animalText = [];
	for( var i = 0 ; i < result.length ; i+=3){
		animalCalls.push(loadSound(dir+result[i]));
		animalNames.push(loadSound(dir+result[i+1]));
		animalImages.push(loadImage(dir+result[i+2]));
		animalText.push(split(result[i+2],".")[0].replace(/_/g," ").toUpperCase());
	}
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

class Letter {

	constructor(_c,_x,_y,_w,_h,_soundArrayRef){
		this.c=_c;
		this.x = _x;
		this.y = _y;
		this.width = _w;
		this.height = _h;
		this.soundArrayRef=_soundArrayRef;
	}

	over() {
	    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
	      return true;
	    } else {
	      return false;
	    }
	}

	mouseReleased(){
		if(this.over()) {
			this.playSound();
		}
	}

	playSound(){
		if(!letterSounds[this.soundArrayRef].isPlaying()) letterSounds[this.soundArrayRef].play();
	}

}

class Letters {

	constructor(_w,_x,_y){
		this.word = _w;
		this.characters = [];
		this.count = _w.length;
		this.x = _x;
	    this.y = _y;
	    textSize(textfontsize);
	    this.width = textWidth(_w);
	    this.height = textfontsize;
	    var xLoc = _x;
	    for(var i = 0 ; i < this.count ; i ++){
	    	var l = this.word.charAt(i);
	    	var letterWidth = textWidth(l);
	    	this.characters.push(new Letter(l,xLoc,this.y,letterWidth,textfontsize,alphabetPosition(l)-1));
	    	xLoc = xLoc + letterWidth;
	    }
	}

	over() {
	    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
	      return true;
	    } else {
	      return false;
	    }
	}

	display(){
		for(var i = 0 ; i < this.characters.length ; i++){
			text(this.characters[i].c,this.characters[i].x,this.characters[i].y);
		}
	}

	mouseReleased(){
		for(var i = 0 ; i < this.characters.length ; i++){
			this.characters[i].mouseReleased();
		}
	}
}

class Button {
  
  constructor(inX, inY, w, h, inImg, myCall, myName, myText, myActive) {
    this.x = inX;
    this.y = inY;
    this.width = w;
    this.height = h;
    this.img = inImg;
    this.imgX = imageSize+10;
    this.imgY = 100;
    this.imgWidth = windowWidth*.5;
    this.call = myCall;
    this.animalName = myName;
    this.animalText = new Letters(myText,imageSize+speakerWidth+40,20);
    this.active = myActive;
    this.speakX = imageSize+20;
    this.speakY = 21;
    this.speakWidth = speakerWidth;
    this.speakHeight = speakerHeight;
  }
  
  display() {
    image(this.img, this.x, this.y, this.width, this.height);
    if(this.active){
    	if(this.imgWidth<300)this.imgWidth=300;
    	if(this.imgWidth>windowHeight-200)this.imgWidth=windowHeight-200;
    	image(this.img, this.imgX, this.imgY, this.imgWidth, this.imgWidth);
    	image(speakImage, this.speakX, this.speakY, this.speakWidth, this.speakHeight);
    	this.animalText.display();
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

  overLargeImage(){
  	if (mouseX > this.imgX && mouseX < this.imgX + this.imgWidth && 
  		mouseY > this.imgY && mouseY < this.imgY + this.imgWidth) {
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
  		if(this.active){
	  		if(this.overSpeaker()) this.playNameSound();
	  		else if(this.overLargeImage()) this.playCallSound();
	  		else this.animalText.mouseReleased();
  		}
  	}
  }
}

function alphabetPosition(text) {
  var result = "";
  for (var i = 0; i < text.length; i++) {
    var code = text.toUpperCase().charCodeAt(i)
    if (code > 64 && code < 91) result += (code - 64) + " ";
  }

  return result.slice(0, result.length - 1);
}