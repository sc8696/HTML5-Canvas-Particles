/*global console*/

(function(){

	"use strict";
	
	//===Canvas Setup======
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d');

	//==Canvas handlers====
	function resizeCanvas(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// draw();
	}
	window.addEventListener('resize', resizeCanvas, false);
	resizeCanvas();

	//===Mouse handlers====
	var mouseX = window.innerWidth/2, mouseY = window.innerHeight/2,
		mouseClicked = false,
		mouseXPrev = -1, mouseYPrev = -1,
		mouseTimePrev,
		mouseTravelX = 0, mouseTravelY = 0;

	function changeMousePosition(event){

		event = event || window.event;
		mouseX = event.clientX || event.touches[0].clientX;
		mouseY = event.clientY || event.touches[0].clientY;

		if (mouseXPrev > -1){
			mouseTravelX += mouseX - mouseXPrev;
			mouseTravelY += mouseY - mouseYPrev;
		}

	}
	window.onmousemove = changeMousePosition;
	window.ontouchmove = function(e){
		changeMousePosition(e);
	}

	window.onmousedown = function(e){
		e.preventDefault();
		mouseClicked = true;
	};
	window.onmouseup = function(){
		mouseClicked = false;
	};
	window.addEventListener('touchstart', function(e){
		e.preventDefault();
		mouseClicked = true;
		changeMousePosition(e);
			
	});
	window.addEventListener('touchend', function(e){
		e.preventDefault();
		mouseClicked = false;
		changeMousePosition(e);
		
	});

	//===Main drawing stuff==
	var particles = [],
		drawing = [],
		point,
		speedLimitX = 0.5,
		speedLimitY = 1,
		sizeLimit = 20,
		frameRate = 10,
		gravity = 0.05,
		reductionRate = 0.97,
		opacityLimit = 0,
		opacityReductionRate = 0.985,
		lineWidth = 1,
		wallDampening = 2,
		i;

	function draw(){

		//Keep track of the mouse's movement in relation to time passed
		var date = new Date(),
			timenow = date.getTime();

		if(mouseTimePrev && mouseTimePrev !== timenow - frameRate){
			mouseTravelX *= 0.2;
			mouseTravelY *= 0.2;
		}

		mouseTimePrev = timenow;
		//====================================

		var particle = {
			x: mouseX,
			y: mouseY,
			xS: (Math.random()*speedLimitX) - speedLimitX/2 + mouseTravelX/7,
			yS: (Math.random()*speedLimitY) - speedLimitY/2 + mouseTravelY/7,
			size: sizeLimit
		};
		var drawPoint = {
			x: mouseX,
			y: mouseY,
			xPrev: mouseXPrev,
			yPrev: mouseYPrev,
			size: 2,
			opacity: 1
		};

		ctx.clearRect(0,0,canvas.width,canvas.height);

		if(mouseClicked){
			particles.push(particle);
			drawing.push(drawPoint);
		}
		for(i = 0; i < particles.length; i+=1){

			particle = particles[i];

			particle.x += particle.xS;
			particle.y += particle.yS;

			ctx.fillStyle = "#ffffff";
			ctx.beginPath();
			ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI, false);
			ctx.fill();
			// ctx.stroke();

			particle.size *= reductionRate;
			particle.yS += gravity;

			wallCollision(particle);

			// Be sure to clear the array of the particles that got too small!
			if (particle.size < 0.2){
				particles.splice(i,1);
			}
		}

		for(i = 0; i < drawing.length; i+=1){

			point = drawing[i];

			point.opacity *= opacityReductionRate;
			// Be sure to clear the array of lines that have disappeared
			if (point.opacity < opacityLimit + 0.01){
				point.opacity = opacityLimit;

				if(point.opacity <= 0.01){
					drawing.splice(i,1);
				}
				
			}
			// ctx.lineJoin = 'round';
			// ctx.lineCap = 'round';
			ctx.strokeStyle = "rgba(255,255,255," + point.opacity + ")";
			ctx.beginPath();
			ctx.lineWidth = lineWidth;

			ctx.moveTo(point.xPrev, point.yPrev);

			ctx.lineTo(point.x, point.y);

			// var c = (point.xPrev + point.x)/2,
			// 	d = (point.yPrev + point.y)/2;

			// ctx.quadraticCurveTo(point.xPrev, point.yPrev, c, d);
			// ctx.quadraticCurveTo(point.xPrev, point.yPrev, point.x, point.y);
			
			// ctx.closePath();
			ctx.stroke();

		}
	}

	function wallCollision(particle){
		if(particle.x - particle.size < 0 || particle.x + particle.size > canvas.width){
			particle.xS *= -0.6;
		}
		if(particle.y - particle.size <= 0 || particle.y + particle.size >= canvas.height){
			particle.yS *= -0.6;
		}
	}

	setInterval(function(){
		draw();
		mouseXPrev = mouseX;
		mouseYPrev = mouseY;
	}, frameRate);

}());

function print(toPrint){
	"use strict";
	console.log(toPrint);
}

