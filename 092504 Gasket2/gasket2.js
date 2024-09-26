var gl;
var points = [];

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
        return;
    }

    // Define the initial vertices of the main triangle
    var vertices = [
        vec2(-1, -1),
        vec2(0, 1),
        vec2(1, -1)
    ];

    // Recursion depth (you can adjust this to control the level of detail)
    var recursionDepth = 10;

    // Subdivide the triangle based on the recursion depth
    divideTriangle(vertices[0], vertices[1], vertices[2], recursionDepth);

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Set background color to white

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate our shader variables with the data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
};

// Function to create a triangle and push its vertices into the points array
function triangle(a, b, c) {
    points.push(a, b, c);
}

// Recursive function to subdivide a triangle
function divideTriangle(a, b, c, count) {
    if (count === 0) {
        // Base case: if recursion ends, draw the triangle
        triangle(a, b, c);
    } else {
        // Find the midpoints of each side
        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);

        // Recursively subdivide the smaller triangles
        --count;
        divideTriangle(a, ab, ac, count);
        divideTriangle(c, ac, bc, count);
        divideTriangle(b, bc, ab, count);
    }
}

// Render the triangles on the canvas
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
}
