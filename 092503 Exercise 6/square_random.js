var gl;       // Global WebGL context
var program;  // Global shader program
var uColor;   // Global uniform location for color
var uResolution; // Global uniform location for resolution
var positionBuffer; // Global buffer for positions
var canvas;   // Global canvas element

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    // Initialize the WebGL context
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
        return;
    }

    // Set the viewport and clear color
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0); // Clear to transparent black

    // Initialize shaders and program
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Create a buffer for the position of the rectangles' vertices
    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Look up where the vertex data needs to go
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vPosition);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // Data type is 32bit floats
    var normalize = false; // Don't normalize the data
    var stride = 0;        // Move forward size * sizeof(type) each iteration
    var offset = 0;        // Start at the beginning of the buffer
    gl.vertexAttribPointer(vPosition, size, type, normalize, stride, offset);

    // Get the location of the resolution uniform
    uResolution = gl.getUniformLocation(program, "uResolution");
    // Set the resolution
    gl.uniform2f(uResolution, canvas.width, canvas.height);

    // Get the location of the color uniform
    uColor = gl.getUniformLocation(program, "uColor");

    // Start rendering
    render();
};

function render() {
    // Clear the canvas before drawing
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw 50 random rectangles in random colors
    for (var ii = 0; ii < 50; ++ii) {
        // Set up a random rectangle
        setRectangle(
            gl, randomInt(canvas.width), randomInt(canvas.height),
            randomInt(canvas.width / 2), randomInt(canvas.height / 2)
        );

        // Set a random color
        gl.uniform4f(uColor, Math.random(), Math.random(), Math.random(), 1);

        // Draw the rectangle
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;  // Each rectangle uses 6 vertices (2 triangles)
        gl.drawArrays(primitiveType, offset, count);
    }
}

// Returns a random integer from 0 to range - 1
function randomInt(range) {
    return Math.floor(Math.random() * range);
}

// Fills the buffer with the values that define a rectangle
function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;

    // Create an array of positions for the rectangle
    var positions = new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ]);

    // Bind the position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Update the buffer data with the new rectangle vertices
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}
