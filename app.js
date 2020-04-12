/*
- OpenGL is a state machine
	- context is the tool that calls graphics fns, eg.g clear screen


- Sends stuff to graphics card
- then draw


- Everything is made up of triangles

- Vertex shader
	- takes all points defining all the triangles
	- takes points in 3D space and puts it in 2D space
		- Given each vertex's 3D poision (+ meta info, e.g. color)
		- Then rasterize (i.e. pixel shader). It fills the 2D traingles made by the vertex shader.
		- Then all this date goes to frame-buffer
		- which goes to the screen
		 
	- opengl has its own coordinate system
*/


var vertexShaderText = [
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'',
'void main()',
'{',
	' gl_Position = vec4(vertPosition, 0.0, 1.0);',

'}',
].join('\n');

// -----------------------------------------
var fragmentShaderText = [
'precision mediump float;',
'',
'void main()',
'{',
	' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
'}',
].join('\n');

var InitDemo = function() {
	console.log('This wrks');	
	// first step is to init webgl

	var canvas=document.getElementById('GameSurface');

	/*
	- OpenGL is a state machine
	- context is the tool that calls graphics fns, eg.g clear screen
	*/
	var gl = canvas.getContext('webgl')
	if(!gl){
		console.log('No WebGL');
	}

	/*
	for Dynamiccaly sized canvas.
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	gl.viewport(0, 0, window.innerWidth, window.innerHeight)
	*/

	// Flat clear, set the color to clear to.
	gl.clearColor(0.28, 0.8, 0.1, 1.0);
	// Then actually clear both buffers.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

	// We now 

	// There are multiple buffers that a graphics application uses.
	// e.g. color buffer, depth buffer etc
	// Color buffer is what stores what color pixels should be.
	// Depth buffer stores how far each pixel is from the screen.

	// Vertex Shader
	// Write inline as strings
	// Input: 
	// 		Attributes: vec2 vertPosition
	// 					vec3 vertColor
	// Output:
	//      varying: vec3 fragColor

	// Fragment Shader

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	gl.compileShader(fragmentShader);
};

