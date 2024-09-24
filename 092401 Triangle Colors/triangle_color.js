var gl; // Define gl in the global scope

var points;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas); // Initialize gl here
    if (!gl) {
        alert("WebGL isn't available");
        return;
    }

    // Define vertex positions
    var vertices = [
        vec2(0, 0.5),   // Vertex 0 (Top, Red)
        vec2(-0.5, -0.5), // Vertex 1 (Bottom Left, Green)
        vec2(0.5, -0.5)   // Vertex 2 (Bottom Right, Blue)
    ];

    // Define vertex colors (R, G, B, A)
    var colors = [
        vec4(1.0, 0.0, 0.0, 1.0), // Red for vertex 0
        vec4(0.0, 1.0, 0.0, 1.0), // Green for vertex 1
        vec4(0.0, 0.0, 1.0, 1.0)  // Blue for vertex 2
    ];

    // Configure WebGL
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

    // Load the vertex colors into the buffer
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // Render the scene
    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
