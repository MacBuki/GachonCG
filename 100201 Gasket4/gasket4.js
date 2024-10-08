var points = [];
var colors = [];

var NumTimesToSubdivide = 3;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Initialize our data for the Sierpinski Gasket
    // First, initialize the vertices of our 3D gasket
    // Four vertices on the unit circle
    // Initial tetrahedron with equal length sides
    var vertices = [
        vec3(0.0000, 0.0000, -1.0000),
        vec3(0.0000, 0.9428, 0.3333),
        vec3(-0.8165, -0.4714, 0.3333),
        vec3(0.8165, -0.4714, 0.3333)
    ];

    divideTetra(vertices[0], vertices[1], vertices[2], vertices[3], NumTimesToSubdivide);

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Enable hidden-surface removal
    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Create a buffer object, initialize it, and associate it with the vertex attribute in the vertex shader
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
};

function triangle(a, b, c, color) {
    // Add colors and vertices for one triangle
    var baseColors = [
        vec3(1.0, 0.0, 0.0),  // R
        vec3(0.0, 1.0, 0.0),  // G
        vec3(0.0, 0.0, 1.0),  // B
        vec3(0.0, 0.0, 0.0)   // Black
    ];

    colors.push(baseColors[color]);
    points.push(a);
    colors.push(baseColors[color]);
    points.push(b);
    colors.push(baseColors[color]);
    points.push(c);
}

function tetra(a, b, c, d) {
    // Tetrahedron with each side using a different color
    triangle(a, c, b, 0);  // Triangle, Red
    triangle(a, c, d, 1);  // Triangle, Green
    triangle(a, b, d, 2);  // Triangle, Blue
    triangle(b, c, d, 3);  // Triangle, Black
}

function divideTetra(a, b, c, d, count) {
    // Check for end of recursion
    if (count === 0) {
        tetra(a, b, c, d);
    } else {
        // Find midpoints of sides
        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var ad = mix(a, d, 0.5);
        var bc = mix(b, c, 0.5);
        var bd = mix(b, d, 0.5);
        var cd = mix(c, d, 0.5);

        --count;

        // Divide tetrahedron into four smaller tetrahedra
        divideTetra(a, ab, ac, ad, count);
        divideTetra(ab, b, bc, bd, count);
        divideTetra(ac, bc, c, cd, count);
        divideTetra(ad, bd, cd, d, count);
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
}
