/*
- OpenGL is a state machine, a collection of variables that define how OpenGL should currently operate. 
	- This is known as the OpenGL 'context'
	- is the tool that calls graphics fns, eg.g clear screen

	- There are several state-changing functions that change the context 
	-  Several state-using functions that perform some operations based on context


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

var vertexShaderText = `
precision mediump float;
attribute vec3 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;
uniform mat4 mWorld; // cube rotation in 3D space
uniform mat4 mView; 
uniform mat4 mProj; 
void main()
{
	fragColor = vertColor;
	gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}`
// -----------------------------------------

// This is a Fragment Shader specified in-line with JS.
var fragmentShaderText = `
precision mediump float;
varying vec3 fragColor;
void main()
{
	gl_FragColor = vec4(fragColor, 1.0);
}`

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
	gl.clearColor(0.8, 0.8, 0.8, 1.0);
	// Then actually clear both buffers.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);

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
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
		console.error('Error compiling vertex Shader')
	}
	gl.compileShader(fragmentShader);
		if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
		console.error('Error compiling fragment Shader')
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.error('Linker error for Vertex Shader', gl.getProgramInfoLog(program));
		return;
	}
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.error('Linker error for fragment Shader');
		return;
	}
	// gl.validateProgram(program); //

	// Create Buffer
	// Basic triangle, without color.
	var boxVertices = [
	// XYZ           RGB
	0.0, 0.0, 0.0, 1.0, 1.0, 1.0, // 0
	1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // 1
	1.0, 0.0, 1.0, 0.0, 0.0, 0.0, // 2
	0.0, 0.0, 1.0, 0.0, 0.0, 0.0, // 3

	0.0, 1.0, 0.0, 1.0, 0.0, 0.0, // 4
	1.0, 1.0, 0.0, 0.0, 1.0, 1.0, // 5
	1.0, 1.0, 1.0, 0.0, 0.0, 0.0, // 6
	0.0, 1.0, 1.0, 0.0, 0.0, 0.0, // 7
	] // CCW ordering, seems CW to me

	var boxIndices = [
	1, 0, 5,
	0, 4, 5,		// face

	3, 7, 0,
	7, 4, 0,

	3, 0, 2, 
	2, 0, 1,	// face
	// 4, 5, 6,
	7, 6, 4,	// face
	6, 5, 4,

	2, 1, 6,
	6, 1, 5,

	3, 2, 6, 
	3, 6, 7
	]

	var boxColors = [
	// XYZ           RGB
	1.0, 0.0, 0.0, // R
	0.0, 1.0, 0.0, // G
	0.0, 0.0, 1.0, // 2
	] // CCW ordering, seems CW to me

	var boxVertexBuffer = gl.createBuffer(); // << memory alloc on GPU
	// Bind newly created buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBuffer);
	// buffers triangle data to last bound buffer object
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBuffer = gl.createBuffer(); // << memory alloc on GPU
	// Bind newly created buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffer);
	// buffers triangle index data to last bound buffer object
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);


	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute Location
		3, // number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of individual vertex
		0// offset from beginning of vertex list
		);

		gl.vertexAttribPointer(
		colorAttribLocation, // Attribute Location
		3, // number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT// offset from beginning of vertex list
		);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	// Tell OpenGL state machine which program is active.
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	var projMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var worldMatrix = new Float32Array(16);
	glMatrix.mat4.identity(worldMatrix);
	glMatrix.mat4.identity(viewMatrix);
	glMatrix.mat4.lookAt(viewMatrix, [1, 2, -3], [0.2, 0.1, 0], [0, 1, 0]);
	glMatrix.mat4.identity(projMatrix);
	glMatrix.mat4.perspective(projMatrix, 3.15159 * 45.0/180.0, canvas.width/canvas.height, 0.1, 1000.0)

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix); // second argument: Set to True to transpose the matrix.
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);



	// Main Render Loop
	// 

	var angle = -0.05;
	var identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);
	var loop = function(){
		
		gl.clearColor(0.0, 0.0, 0.2, 1.0 );
		gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
		// rotation angle
		glMatrix.mat4.rotate(worldMatrix, worldMatrix, angle, [0.1, 1.0, 0.0]);
		
		// set values and render.
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix); // second argument: Set to True to transpose the matrix.
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
		requestAnimationFrame(loop);
	// 	updateworld();
	// 	renderworld();
	}
	requestAnimationFrame(loop);
};

