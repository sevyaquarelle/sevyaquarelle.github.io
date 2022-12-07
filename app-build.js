// ------------------------------------------------------------
// ASSETS
//
const assetsPath = "./assets/custom-mono/";
const glyphFile = "bitmap/bsp0t_";
const glyphFileFormat = ".png";
const srcFontFile = assetsPath + "font/Bsp0tCustom-Mono.ttf";



// ------------------------------------------------------------
// TYPEFACE
//
const ZERO = 'O';
const SRC_TXT = "BLINDSP" + ZERO + "T";

const SRC_FONT_SIZE     = 126; 	
const SRC_FONT_HEIGHT   = 126;	// Glyph height
const SRC_FONT_WIDTH    = 82;	// Glyph width
let zeroId;
let SRC_FONT;



// ------------------------------------------------------------
// GUI
// 
let CONFIG = {
	
	// Global scale ratio
	scale: 			0.75,	//	Relative to SRC_FONT_SIZE (125 px)

	// Physics
	maxForce: 		0.27,    //0.37,	//1,
	maxSpeed: 		5,		//5,
	arriveMass: 	0.75,	//1,
	fleeMass: 		3.5,		//5,
	fleeMaxF: 		0.37,   //0.7, 	// factor * by SRC_FONT_WIDTH 
	arriveMaxF: 	0.3,   //0.5,	// factor * by SRC_FONT_WIDTH

	// Physics mouse
	maxForceMouse:		0.7,
	maxSpeedMouse:		5,
	fleeMaxFMouse: 		0.8,   //0.7, 	// factor * by SRC_FONT_WIDTH 
	arriveMaxFMouse: 	0.64,   //0.5,	// factor * by SRC_FONT_WIDTH

	// Physics zeroLoop
	maxForceZero:		0.27,
	maxSpeedZero:		3,
	fleeMaxFZero: 		0.31,   //0.7, 	// factor * by SRC_FONT_WIDTH 
	arriveMaxFZero: 	0.2,   //0.5,	// factor * by SRC_FONT_WIDTH

	// Computed values
	fleeMaxDist:  SRC_FONT_WIDTH * 0.37 * 0.75, // * self.scl * self.fleeMaxF,
	arriveMaxDist:  SRC_FONT_WIDTH * 0.36 * 0.75, // * self.scl * self.arriveMaxF,

	// Type settings
	glyphPerLine: 5

}

// -------------------------------------------------
// GLOBAL VARIABLES
//

let TXT_WIDTH = 0;
let TXT_HEIGHT = 0;

let TEXT_AREA = new p5.Vector();	// PVector Text area for moving targets
let ZERO_AREA = new p5.Vector(); 	// PVector Zero area for moving targets

let NB_LINES = Math.ceil(SRC_TXT.length / CONFIG.glyphPerLine);

let glyphImgSrc = [];
let glyphs = [];

let OFFx = 0;
let OFFy = 0;


let cnv;	// Canvas

let vehicle;
let zeroOrigin = new p5.Vector();

let areaWander;

// Padding for text area
let padTxtX = 0.25;
let padTxtY = 0.55;
let padWanderX = 0.75;
let padWanderY = 0.75;



// ------------------------------------------------------------
// PRELOAD GLYPH IMAGES AND FONT FILE
//
function preload() {
	// Load images
	for(let i=0; i < SRC_TXT.length; i++){
		let img = loadImage(assetsPath + glyphFile + SRC_TXT[i] + glyphFileFormat);
		glyphImgSrc.push(img);
	}
	// Load font
	SRC_FONT = loadFont(srcFontFile);	  
}


// ------------------------------------------------------------
// SETUP
//
function setup() {
	cnv = createCanvas(windowWidth, windowHeight, WEBGL);
	var density = displayDensity();
	pixelDensity(1);

	checkScreenSize();


	ZERO_AREA = createVector(SRC_FONT_WIDTH, SRC_FONT_HEIGHT);

	// Create glyphs objects
	for(let i=0; i < SRC_TXT.length; i++) {  
		//Get zero id
		if(SRC_TXT.charAt(i) == ZERO){
			zeroId = i;
		}
		let img = glyphImgSrc[i]; 
		let g = new Glyph(SRC_TXT.charAt(i), i, 0, 0, img);
		glyphs.push(g);
	}

	// Create vehicle
	vehicle = new Vehicle(0,0);

	// Create area
	areaWander = new Area(0, 0, 0, 0);

	// Update
	update();

}


// ------------------------------------------------------------
//  DRAW
//
function draw() {
	
	// Update offset positions
	OFFx = TXT_WIDTH * 0.5 * CONFIG.scale;
	OFFy = glyphImgSrc[SRC_TXT.length-1].height * NB_LINES * 0.5 * CONFIG.scale; 

	//Update mouse area
	areaWander.setRect(
		-OFFx -ZERO_AREA.x * padWanderX * CONFIG.scale, 
		-OFFy -ZERO_AREA.y * padWanderY * CONFIG.scale, 
		(ZERO_AREA.x * padWanderX*2 + TEXT_AREA.x) * CONFIG.scale, 
		(ZERO_AREA.y * padWanderY*2 + TEXT_AREA.y) * CONFIG.scale
	);


	vehicle.update();

	//Update flee and arrive max dist
	CONFIG.fleeMaxDist		= CONFIG.fleeMaxF	* SRC_FONT_WIDTH *CONFIG.scale;
	CONFIG.arriveMaxDist	= CONFIG.arriveMaxF	* SRC_FONT_WIDTH *CONFIG.scale;


	background(0);
	noStroke();

	//fill(120, 0, 0);
	//areaWander.draw();

	push();
	translate(-OFFx,  -OFFy);

	for(let i=0; i<glyphs.length; i++) {
		glyphs[i].setTarget(vehicle.pos.x +OFFx, vehicle.pos.y+OFFy);
		glyphs[i].draw();
	}
	pop();

	vehicle.show();

}


// ------------------------------------------------------------
// RESIZE
//
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	checkScreenSize();
	update();
}

function checkScreenSize(){
	// XXL	≥1400px
	if(windowWidth >= 1400) {
		CONFIG.scale = 1.5;
		CONFIG.glyphPerLine = SRC_TXT.length;

	// XL	≥1200px
	} else if(windowWidth >= 1200) {
		CONFIG.scale = 1.25;
		CONFIG.glyphPerLine = SRC_TXT.length;

	// LG	≥992px
	} else if(windowWidth >= 992) {
		CONFIG.scale = 1.25;
		CONFIG.glyphPerLine = 5;

	//	MD	≥768px
	} else if(windowWidth >= 768) {
		CONFIG.scale = 1;
		CONFIG.glyphPerLine = 5;

	// SM	≥576px
	} else if(windowWidth >= 576) {
		CONFIG.scale = 0.75;
		CONFIG.glyphPerLine = 5;

	// XS <576px
	} else {
		CONFIG.scale = 0.75;
		CONFIG.glyphPerLine = 5;
	}

	CONFIG.fleeMaxDist		= CONFIG.fleeMaxF	* SRC_FONT_WIDTH *CONFIG.scale;
	CONFIG.arriveMaxDist	= CONFIG.arriveMaxF	* SRC_FONT_WIDTH *CONFIG.scale;
}


// ------------------------------------------------------------
// UPDATE
//
function update(){

	OFFx = TXT_WIDTH * 0.5 * CONFIG.scale;
	OFFy = glyphImgSrc[SRC_TXT.length-1].height*NB_LINES*0.5*CONFIG.scale; 



	vehicle.update();
	scaleValues();
	updateTextArea();


}



// ------------------------------------------------------------
// UPDATE Text Area
//
function updateTextArea(){
	let px = 0;
	let py = 0;

	TXT_HEIGHT = 0;
	TXT_WIDTH = 0;
	
	NB_LINES = Math.ceil(SRC_TXT.length / CONFIG.glyphPerLine);	

	for(let i = 0; i < SRC_TXT.length; i++){
		
		glyphs[i].updatePosition(px, py);
		
		if(i == zeroId){

			let zeroPos = createVector(px * CONFIG.scale, py * CONFIG.scale );
			zeroOrigin.set(zeroPos);
			vehicle.origin.set(zeroPos);
		}

		px += glyphImgSrc[i].width;

		if(i%CONFIG.glyphPerLine == CONFIG.glyphPerLine-1){
			if(px > TXT_WIDTH) {
				TXT_WIDTH = px;
			}
			px = 0;
			py += SRC_FONT_SIZE;
		}
	}

	if(px > TXT_WIDTH){
		TXT_WIDTH = px;
	}
	TXT_HEIGHT = (glyphs[glyphs.length-1].py + SRC_FONT_SIZE - glyphs[0].py); 

	TEXT_AREA.set(TXT_WIDTH, TXT_HEIGHT);
}



// ------------------------------------------------------------
// UPDATE PARTICLES VALUES (GUI)
// 
function scaleValues(){
	for(let g of glyphs) {
		g.scaleValues();
	}
}





///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
// PARTICLE

const radius = 4; // Particle radius

class Particle {

    constructor(x, y, oX, oY, id) {

        this.pos = createVector(x, y);  // SRC position
        this.initPosition(oX, oY);
        
        this.vel = createVector(); //p5.Vector.random2D();
        this.acc = createVector();
        
        this.initialRadius = radius;
        this.initialMaxForce = CONFIG.maxForce; // 1
        this.initialMaxSpeed = CONFIG.maxSpeed; // 5

        this.id = id;

        this.arriveMaxDist = CONFIG.arriveMaxDist;
        this.fleeMaxDist = CONFIG.fleeMaxDist;

        this.radius = this.initialRadius;

        this.maxspeed = this.initialMaxSpeed;
        this.maxforce = this.initialMaxForce;

        this.glyphActive = false;
        this.displayP = false;


        this.selfValue = 0.9 + Math.random() * 0.2;

        this.ellipse = false;
        
        if(random(1)>0.5){
            this.ellipse = true;
        }
    }

    initPosition(oX, oY){
        // Orginial position
        this.origin = createVector(oX, oY);

        // Display position (scale)
        this.displayPos = p5.Vector.mult(this.pos, CONFIG.scale);
        this.displayPos.add(this.origin);
        this.target = this.displayPos.copy();

    }



    scaleValues(){
        //this.displayPos.set(this.pos.x*CONFIG.scale, this.pos.y*CONFIG.scale);
        //this.displayPos.add(this.origin);
        this.target.set(this.displayPos);
        this.initialRadius = radius*CONFIG.scale;

    }

    behaviors(tx, ty) {
        this.maxspeed = CONFIG.maxSpeed * CONFIG.scale * this.selfValue;
        this.maxforce = CONFIG.maxForce * CONFIG.scale * this.selfValue;
        this.arriveMaxDist = CONFIG.arriveMaxDist * this.selfValue;
        this.fleeMaxDist = CONFIG.fleeMaxDist;// * this.selfValue;

        let arrive = this.arrive(this.target);
        let mouse = createVector(tx, ty);
        let flee = this.flee(mouse);
        
        // Apply mass 
        arrive.mult(CONFIG.arriveMass);
        flee.mult(CONFIG.fleeMass);
        
        // Apply force
        this.applyForce(arrive);
        this.applyForce(flee);

    }

    applyForce(f) {
        this.acc.add(f);
    }


    update() {

        this.displayPos.add(this.vel);
        this.vel.add(this.acc);

        
        let diff = p5.Vector.sub(this.target, this.displayPos);
        let d = diff.mag();
        
        d = Math.min(d, this.fleeMaxDist);
        
        // Particle move
        if(d > 1) {
            this.move = true;
            this.radius = this.initialRadius;
            let map_radius = map(d, 0, this.fleeMaxDist, this.radius, 1);
            this.radius = map_radius;
        // Particle stop
        } else {
            this.move = false;
            
            // Show particle
            if(this.glyphActive) {
                this.radius = this.initialRadius;
                this.displayP = true;
            
            // Reduce particle
            } else {
                if(this.radius > 0 && !this.glyphActive) {
                    this.radius -= 0.5*CONFIG.scale;
                } else {
                    this.radius = 0;
                    this.displayP = false;
                }
            }
        }

        this.acc.mult(0);
    }
      
    show() {
        if(this.displayP || this.glyphActive){
            noStroke();
            fill(255);
            if(this.ellipse){
                ellipse(this.displayPos.x , this.displayPos.y , this.radius, this.radius);         
            }else{
                rect(this.displayPos.x - this.radius*0.5, this.displayPos.y - this.radius*0.5, this.radius, this.radius);
            }
        }
    }
      
    arrive(target) {
        let desired = p5.Vector.sub(target, this.displayPos);
        let d = desired.mag();
        let speed = this.maxspeed;
        if (d < this.arriveMaxDist) {
          speed = map(d, 0, this.arriveMaxDist, 0, this.maxspeed);
        }
        desired.setMag(speed);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        return steer;
    }
      
    flee(target) {
        let desired = p5.Vector.sub(target, this.displayPos);
        let d = desired.mag();
        if (d < this.fleeMaxDist) {
          desired.setMag(this.maxspeed);
          desired.mult(-1);
          let steer = p5.Vector.sub(desired, this.vel);
          steer.limit(this.maxforce);
          return steer;
        } else {
          return createVector(0, 0);
        }
    }

}

///////////////////////////////////////////////////////////////
// AREA

class Area {

    constructor(_xMin,  _yMin, _xMax, _yMax) {
        this.setBounds(_xMin, _yMin, _xMax, _yMax);
    }

    setBounds(_xMin,  _yMin,  _xMax,  _yMax){
        this.xMin = _xMin;
        this.yMin = _yMin;
        this.xMax = _xMax;
        this.yMax = _yMax;        
    }

    setRect( _xMin,  _yMin,  _width,  _height) {
        this.xMin = _xMin;
        this.yMin = _yMin;
        this.xMax = _xMin + _width;
        this.yMax = _yMin + _height;          
    }

    getWidth(){
        return this.xMax - this.xMin;
    }
    getHeight(){
        return this.yMax - this.yMin;
    }

    draw() {
        rect(this.xMin, this.yMin, this.getWidth(), this.getHeight());
    }
}

///////////////////////////////////////////////////////////////
// GLYPH

const spacing = 2;

class Glyph {
    constructor(name, id, px, py, img) {
        this.name = name;
        //this.id = id;
        this.img = img;
        this.particleMode = false;
        this.srcPx = px;
        this.srcPy = py;
        this.px = px;
        this.py = py; 
        this.imgPixels = this.getPixels();
        this.particles = this.pixelsToParticles(this.px, this.py);

        this.particlesMove = false; 
        this.isActive = false;   
        this.steeringBehavior = false;

        this.target = createVector(0,0);
    }

    updatePosition(px, py){
        this.srcPx = px;
        this.srcPy = py;
        this.px = px;
        this.py = py; 
        this.updateParticlesPosition();
    }

    setTarget(x, y){
        this.target.set(x, y);
    }

    updateTypeSettings(){
        this.px = this.srcPx;
        this.py = this.srcPy;
    }

    draw() {
        this.particlesMove = false;
        for(let p of this.particles) {
            if(p.move){
                this.particlesMove = true;
                break;
            }
        }
        
        for(let p of this.particles) {
            p.glyphActive = this.particlesMove;
        }

        this.updateParticles();
        this.drawParticles();

        if(!this.particlesMove) {

            this.drawGlyph();
        }
    }

    updateParticles() {
        for(let p of this.particles) {
            p.behaviors(this.target.x, this.target.y);
            p.update();
        } 
    }

    drawParticles(){
        for(let p of this.particles) {
            p.show();
        }
    }

    drawGlyph(){
        push();
        fill(255);
        strokeWeight(1);
        stroke(255, 0, 0);
        textFont(SRC_FONT);
        textSize(SRC_FONT_SIZE * CONFIG.scale);
        text(this.name, this.px*CONFIG.scale, this.py*CONFIG.scale + this.img.height*CONFIG.scale*0.845);
        pop();
    }

    scaleValues(){
        for(let p of this.particles){
            p.scaleValues();
        }
    }



    /******************************************************
     * PIXELS TO PARTICLES
     */
    pixelsToParticles(oX=0, oY=0) {
        let particles = [];
        let id = 0;
        for (let px of this.imgPixels) {
            particles.push(new Particle(px.x, px.y, oX, oY, id));
            id++;
        }
        return particles;
    }

    updateParticlesPosition(){
        for(let p of this.particles){
            p.initPosition(this.px*CONFIG.scale, this.py*CONFIG.scale);
            p.scaleValues();
        }
    }

    // getPixels
    getPixels() {
        let px = [];
        this.img.loadPixels();
        for (let x = 0; x < this.img.width; x++) {
            for (let y = 0; y < this.img.height; y++) {
                if(x % spacing == 0 && y % spacing == 0) {
                    let index = x + y * this.img.width;
                    let c = this.img.pixels[index * 4];
                    let b = brightness(c);
                    if (b > 1) {
                        px.push({"x": x, "y": y});
                    }
                }
            }
        }   
        return px;
    }
}

///////////////////////////////////////////////////////////////
// VEHICLE

class Vehicle {

    constructor(x, y) {    
        this.pos = createVector(x, y);     			// Position
        this.vel = createVector(1, 0);     			// Velocity
        this.acc = createVector(0, 0);     			// Acceleration

		this.mousePos = createVector(0, 0);

        this.origin = this.pos.copy();           	// Origin
		this.currentTarget = this.origin.copy(); 	// Current target

		this.loopOnZero = true;

        this.maxSpeed = 4;          				// Max speed
        this.maxForce = 1.25;       				// Max force

		this.bounds = areaWander;   				// Bounds = Area() wander


        // PROPERTIES

        this.visible = true;				// Vehicle visible

        this.loopId = 0;             		// Loop id
        this.zeroLoopPct = 0;        		// Zero Loop Pct
        this.zeroLoopFrames = 90;    		// Zero Loop frames
        this.ellapsedFrames = 1;    		// Ellapsed frames

        this.zeroAdjustX = 0.9;      		// Zero adjust X position factor
        this.zeroAdjustY = 0.9;      		// Zero adjust Y poisition factor
 
    }

	// --------------------------------------------------------
	// CUSTOM BEHAVIORS


	// Loop on zero
	//
	zeroLoop() {
		this.zeroLoopPct = (this.ellapsedFrames % this.zeroLoopFrames) / this.zeroLoopFrames;
		let sinPct = Math.sin(TWO_PI * this.zeroLoopPct)*0.9;
		this.pos.set(
			this.origin.x -OFFx + SRC_FONT_WIDTH*0.5*CONFIG.scale 
			+ Math.cos(3 * TWO_PI * this.zeroLoopPct) * ZERO_AREA.x * CONFIG.scale * 0.4 * this.zeroAdjustX * sinPct ,
			
			this.origin.y -OFFy + SRC_FONT_HEIGHT*0.5 * CONFIG.scale
			+ Math.sin(3 * TWO_PI * this.zeroLoopPct) * ZERO_AREA.y * CONFIG.scale * 0.5 * this.zeroAdjustY * sinPct
		);
		this.ellapsedFrames++;
	}

    seek(target, arrival) {
        let force = p5.Vector.sub(target, this.pos);   
        let desiredSpeed = this.maxSpeed;      
        if (arrival) {
            let slowRadius = SRC_FONT_WIDTH*CONFIG.scale;
            let distance = force.mag();
            if (distance < slowRadius) {
                desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
            }
        } 
        force.setMag(desiredSpeed);
        force.sub(this.vel);
        force.limit(this.maxForce);
        return force;       
    }

	applyForce(force) {
        this.acc.add(force);
    }


	// --------------------------------------------------------
	// Update
	//
    update() {

		
		//this.currentTarget.set(this.origin.x -OFFx, this.origin.y -OFFy); 
		this.bounds = areaWander;
		this.mousePos.set(mouseX -width*0.5, mouseY - height*0.5);
		
		if(this.mouseIsInArea()){
			this.currentTarget.set(this.mousePos);
			this.maxSpeed = 20 * CONFIG.scale;
			this.loopOnZero = false;
			CONFIG.maxForce		= CONFIG.maxForceMouse;
			CONFIG.maxSpeed		= CONFIG.maxSpeedMouse;
			CONFIG.fleeMaxF 	= CONFIG.fleeMaxFMouse; 	// factor * by SRC_FONT_WIDTH
			CONFIG.arriveMaxF 	= CONFIG.arriveMaxFMouse;	// factor * by SRC_FONT_WIDTH

		}else {
			
			this.currentTarget.set(this.origin.x -OFFx + SRC_FONT_WIDTH*0.5*CONFIG.scale, this.origin.y -OFFy + SRC_FONT_HEIGHT*0.5 * CONFIG.scale  );
			
			if(this.pos.dist(this.currentTarget) < 0.1 || this.loopOnZero == true) {
				this.loopOnZero = true;
				this.maxSpeed = 0;
				CONFIG.maxForce		= CONFIG.maxForceZero;
				CONFIG.maxSpeed		= CONFIG.maxSpeedZero;
				CONFIG.fleeMaxF 	= CONFIG.fleeMaxFZero; 	// factor * by SRC_FONT_WIDTH
				CONFIG.arriveMaxF 	= CONFIG.arriveMaxFZero;	// factor * by SRC_FONT_WIDTH
				this.zeroLoop();
			} else {

				this.maxSpeed = 24 * CONFIG.scale;
			}
			
		}

		let f = this.seek(this.currentTarget, true);
		this.applyForce(f);
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.pos.add(this.vel);
		this.acc.set(0, 0);
		
    }


	mouseIsInArea(){
		if(this.mousePos.x > this.bounds.xMin && this.mousePos.x < this.bounds.xMax 
			&& this.mousePos.y > this.bounds.yMin && this.mousePos.y < this.bounds.yMax){
			return true;
		}else{
			return false;
		}
	}



	// --------------------------------------------------------
	// DISPLAY VEHICLE
	//
    show() {	
		push();
		noStroke();
		fill(255);
		translate(this.pos.x -SRC_FONT_WIDTH*CONFIG.scale*0.5, this.pos.y + SRC_FONT_HEIGHT*0.7*CONFIG.scale*0.5);
		textFont(SRC_FONT);
		textSize(SRC_FONT_SIZE * CONFIG.scale);
		text("0", 0, 0);
		pop();
		/*
		push();
		translate(this.pos.x , this.pos.y );
		noFill();
		stroke(0, 255, 0);
		ellipse(0, 0, CONFIG.fleeMaxDist, CONFIG.fleeMaxDist);
		stroke(255, 0, 0);
		ellipse(0, 0, CONFIG.arriveMaxDist, CONFIG.arriveMaxDist);
		pop();
		*/
    }

}

