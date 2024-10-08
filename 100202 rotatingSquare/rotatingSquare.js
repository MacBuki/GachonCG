var gl;
var theta = 0.0; // Rotation angle
var thetaLoc;
var delay = 100; // Control the speed of rotation
var direction = true; // Control the direction of rotation
var intervalId;

// Initialize the WebGL context and set up the scene
window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Define vertices for a square
    var vertices = [
        vec2(0, 1), 
        vec2(-1, 0), 
        vec2(1, 0),
        vec2(0, -1)
    ];

    // Load data into the GPU
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate vertex shader variables with buffer data
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");

    render();
};

// Render function to draw and animate the square
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    theta += 0.9;
    gl.uniform1f(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}
