var gl; // Global WebGL context

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    // Initialize WebGL
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
        return;
    }

    // Define vertex positions for a square (two triangles)
    var vertices = [
        vec2(-0.5, 0.5),  // Top-left
        vec2(-0.5, -0.5), // Bottom-left
        vec2(0.5, -0.5),  // Bottom-right
        vec2(0.5, 0.5)    // Top-right
    ];

    // Configure WebGL viewport and background color
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the vertex positions into the buffer
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Draw the square using two triangles
    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // First triangle (top-left, bottom-left, bottom-right)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}
