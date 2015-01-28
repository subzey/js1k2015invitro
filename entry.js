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
var VIEWPORT_WIDTH = 120; // constant
var VIEWPORT_HEIGHT = 180; // constant

// Variables that holds certain values between setInterval calls
// Very unlikely these can be reused
var pattern;
var patternMovementAngle;
if (typeof __RegPack === 'undefined'){
	g = null;
}
var textState;

var __inline_intervalId = textState = 40;

// Variables that can (and should) be reused
var v01, v02, v03;


setInterval(function(){
	v01 = a.width;
	v02 = a.height;

	// g is a global state
	if (!g){
		// UPDATE PATTERN
		// Both set size and reset canvas
		a.width = a.height = 16;
		v03 = Math.random()*360;
		c.fillStyle = 'hsl(' + v03 + ',50%,50%)';
		c.fillRect(0, 0, 16, 16);
		c.strokeStyle = c.fillStyle = 'hsl(' + (v03 + 120) + ',50%,50%)';
		if (Math.random() < 0.5){
			c.arc(8, 8, 5 * Math.random() + 2, 0, 7);
			if (Math.random() < 0.5){
				c.stroke();
			} else {
				c.fill();
			}
		} else {
			if (Math.random() < 0.5){
				c.moveTo(0,0);
				c.lineTo(16,16);
				c.moveTo(0,16);
				c.lineTo(16,0);
			} else {
				c.moveTo(8,0);
				c.lineTo(8,16);
				c.moveTo(0,8);
				c.lineTo(16,8);
			}
			c.lineWidth = 5 * Math.random() + 2;
			c.stroke();
		}
		pattern = c.createPattern(a, '');
		patternMovementAngle = Math.random() * 44;
		textState = ++textState % 4;
	}
	g = ++g%150;

	// Reset canvas and its state (including transforms)
	var __inline_canvasWidth = a.width = v01;
	var __inline_canvasHeight = a.height = v02;
	var __inline_canvasAlpha = c.globalAlpha = .1;
	c.fillRect(0, 0, __inline_canvasWidth, __inline_canvasHeight, __inline_canvasAlpha);
	// Set coordinate origin to the center of the screen
	// Otherwise it would be hard to do rotations
	c.translate(v01/2, v02/2);
	// Scale context so logical viewport fits into physical
	v03 = Math.min(v01 / VIEWPORT_WIDTH, v02 / VIEWPORT_HEIGHT);
	c.scale(v03, v03);
	c.clearRect(-VIEWPORT_WIDTH/2 + 3, -VIEWPORT_HEIGHT/2 + 3, VIEWPORT_WIDTH - 6, VIEWPORT_HEIGHT - 6);
	c.strokeRect(-VIEWPORT_WIDTH/2 + 3, -VIEWPORT_HEIGHT/2 + 3, VIEWPORT_WIDTH - 6, VIEWPORT_HEIGHT - 6);
	// c.stroke();
	c.globalAlpha = 1;

	// From on now we have rect (-VW/2, -VH/2) to (+VW/2, +VH/2).
	// Everything outside this rect is transparent

	c.lineWidth = 4;
	c.textAlign = 'center';



	c.fillText(['Have a', 'The compo', '1k of JS', 'js1k.com'][textState], 0, -63);
	c.fillText(['good trip!', 'is back!', 'Tons of awesome', 'February'][textState], 0, 70);

	var __inline_clearHeight = v03 = Math.abs(80-g);
	c.clearRect(-50, __inline_clearHeight, 100, -v03*2);

	c.fillText(2015, 0, 16);


	var __inline_alpha = v03 = Math.PI/4 - Math.PI/(1+Math.exp(g/7.5-10));


	c.save();
		// Common rotation
		c.rotate(__inline_alpha);

		// Partial drawing af lines
		c.setLineDash([
			3500
		]);
		c.lineDashOffset  = 3500 - g * 25;

		c.beginPath();
		c.save();
			c.scale(Math.abs(Math.sin(v03 - .2)), 1);
			c.arc(0, 0, 50, 0, 7);
		c.restore();
		c.stroke();

		c.beginPath();
		c.save();
			c.scale(1, Math.abs(Math.sin(v03 + 1.8)));
			c.arc(0, 0, 50, -9, 0);
		c.restore();
		c.stroke();
	c.restore();




// Everythind drawn until this point will be covered with pattern
	c.save();
		c.globalCompositeOperation = 'source-atop';
		c.fillStyle = pattern;
		c.setTransform(
			1,
			0,
			0,
			1,
			Math.cos(patternMovementAngle) * g % 16,
			Math.sin(patternMovementAngle) * g % 16
		); // Unlike regular transform(), it is not multiplied with previous state
		c.rect(-16, -16, 3500, 3500); // I hope, that's enough
		c.fill();
	c.restore();

// DRAW LOGO

		// c.lineWidth=4;
		c.beginPath();
		// Save point
		c.save();
		// Transformatin matrix. This is the only way to get skew transform
		// Scale up by factor 4 (makes all coordinates shorter), once we already have to call this
		// Askew with parameter -3. Some hard Math here. It's easier to guess.
		var __inline_transform = c.transform(.6, 0, -.5, .6, 0, 0);

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

		
//	c.restore();



}, __inline_intervalId);
