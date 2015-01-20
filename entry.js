/**
 * Here's something you need to know.
 *
 * This stuff can be minified with uglifyjs. 
 * Install node, run `npm install` once. And then `node make` to build.
 *
 * In order to make golfing easy and still keep source readable, some
 * prepocessing is used.
 *
 * Variables with names containing only CAPS letters, digits and underscores
 * and starting with letter is considered constants, it is evaluated at the
 * build stage and inlined by value (they won't be in the output as is).
 * The constants parser is dumb (made on regexps), use the following style only:
 * var CONSTANT_NAME = 'constant value';
 *
 * Another feature is inlining. Variables starting with `__inline_` are inlined.
 * Think of it as a macros. For example, the following code:
 *     __inline_foo = foo();
 *     __inline_bar = bar(__inline_foo) + 2;
 *     baz(1, 2, 3, !__inline_bar);
 * will be transformed into:
 *     baz(1, 2, 3, ! (bar( (foo()) ) + 2) );
  * Again, this stuff is based on regexps and may work incorrectly.
 * Use it to nest expressions while keeping source readable. But beware, this
 * may break long runs of identical text, so RegPack would work worse.
 * I've warned you!
 */

// Dimensions of the card itself
var VIEWPORT_WIDTH = 400; // constant
var VIEWPORT_HEIGHT = 600; // constant

var pattern;
var patternMovementAngle;
var patternCanvas = a.cloneNode();
var patternCtx = patternCanvas.getContext('2d');

var t = 0;

function updatePattern(){
	// Both set size and reset canvas
	patternCanvas.width = patternCanvas.height = 16;
	var hue = Math.random()*360;
	patternCtx.fillStyle = 'hsl(' + hue + ',50%,50%)';
	patternCtx.fillRect(0, 0, 16, 16);
	patternCtx.strokeStyle = patternCtx.fillStyle = 'hsl(' + (hue + 120) % 360 + ',50%,50%)';
	var random = Math.random() * 4; // Float [0; 3.9)
	if (random & 2){
		// 3 or 2
		patternCtx.arc(8, 8, Math.random() * 5 + 2, 0, Math.PI*2);
		if (random & 1){
			patternCtx.stroke();
		} else {
			patternCtx.fill();
		}
	} else {
		// 0 or 1
		if (random & 1){
			patternCtx.moveTo(0,0);
			patternCtx.lineTo(16,16);
			patternCtx.moveTo(0,16);
			patternCtx.lineTo(16,0);
		} else {
			patternCtx.moveTo(8,0);
			patternCtx.lineTo(8,16);
			patternCtx.moveTo(0,8);
			patternCtx.lineTo(16,8);
		}
		patternCtx.lineWidth = Math.random() * 5 + 2;
		patternCtx.stroke();
	}
	pattern = c.createPattern(patternCanvas, '');
	patternMovementAngle = Math.random() * 2 * Math.PI;
}

function drawLogoText(){ // Actually, a procedure
	c.beginPath();
	c.lineWidth=4;
	// Save point
	c.save();
	// Transformatin matrix. This is the only way to get skew transform
	// Scale up by factor 4 (makes all coordinates shorter), once we already have to call this
	// Askew with parameter -3. Some hard Math here. It's easier to guess.
	var __inline_transform = c.transform(2, 0, -1.5, 2, 0, 0);

	// S
	// Line just started, so there's not implicit lineTo
	c.arc(-7, -6, 5, -0.7, 2.5, !__inline_transform);
	// Implicit lineTo
	c.arc(-9, 6, 5, -0.7, 2.5);


	// J
	c.moveTo(-20, -13); // Top of J stem
	// Implicit lineTo
	c.arc(-24, 7, 4, 0, 2.5); // Bottom J arc

	// 1
	c.moveTo(2, -11);
	c.lineTo(8, -11);
	c.lineTo(8, 13);

	// K

	c.moveTo(17, -13);
	// A short vertical line to correct the line end
	// It causes small view glitch, but it anyway looks much better this way
	c.lineTo(17, 13);
	c.moveTo(26, -13);
	c.lineTo(26, -12.5);
	c.lineTo(21, 0);
	c.lineTo(26, 12.5);
	// Again, short vertical line to correct the line end
	c.lineTo(26, 13);
	c.stroke();

	c.restore();
}

setInterval(function(){
	// Reset canvas and its state (including transforms)
	a.width^=0;
	c.globalAlpha = .1;
	c.fillRect(0,0,a.width,a.height);
	c.globalAlpha = 1;
	// Set coordinate origin to the center of the screen
	// Otherwise it would be hard to do rotations
	c.translate(a.width/2, a.height/2);
	// Scale context so logical viewport fits into physical
	var scalingCoefficient = Math.min(a.width / VIEWPORT_WIDTH, a.height / VIEWPORT_HEIGHT);
	c.scale(scalingCoefficient, scalingCoefficient);

	c.clearRect(-VIEWPORT_WIDTH/2 + 10, -VIEWPORT_HEIGHT/2 + 10, VIEWPORT_WIDTH - 20, VIEWPORT_HEIGHT - 20);

	// From on now we have rect (-VW/2, -VH/2) to (+VW/2, +VH/2).
	// Everything outside this rect is transparent

	c.lineWidth = 15;

	var phase = t % 150;
	t++;
	phase || updatePattern();

	var alpha = (phase - 100) / 10;
	if (alpha < 0 || alpha > Math.PI){
		alpha = 0;
	}


	c.save();
		// Common rotation
		c.rotate(alpha - Math.PI/4);

		// Partial drawing af lines
		c.setLineDash([14e3, 1e3]);
		c.strokeStyle = 'red';
		c.lineDashOffset  = 14e3 - phase * 100;

		c.beginPath();
		c.save();
		c.scale(Math.abs(Math.cos(alpha + 1)), 1);
		c.arc(0, 0, 200, 0, Math.PI * 2, false);
		c.restore();
		c.stroke();

		c.beginPath();
		c.save();
		c.scale(1, Math.abs(Math.sin(alpha + 0.55)));
		c.arc(0, 0, 200, -Math.PI, Math.PI, false);
		c.restore();
		c.stroke();
	c.restore();


	c.save();
		c.scale(3, 3);
		c.textAlign = 'center';

		c.fillText(2015, 0, 20);

		c.save();
			c.globalCompositeOperation = 'source-atop';
			c.fillStyle = pattern;
			c.rect(-250, -250, 500, 500);
			c.setTransform(1,0,0,1,0,0); // Unlike regular transform(), it is not multiplied with previous value
			c.translate(t * Math.cos(patternMovementAngle) % 16, t * Math.sin(patternMovementAngle) % 16);
			c.fill();
		c.restore();

		c.fillText('We want to invite you', 0, -80);
		c.fillText('— to —', 0, -70);
		c.fillText('——', 0, 70);
		c.fillText('a huge compo', 0, 80);
		c.fillText('of tiny js code', 0, 90);
	c.restore();


	drawLogoText();


}, 40);
