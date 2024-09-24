var gl;
var points;

window.onload = function init() {

    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
        return;
    }

    // Define hexagon vertices
    var hexagonVertices = [
        vec2(-0.3, 0.6), 
        vec2(-0.4, 0.8), 
        vec2(-0.6, 0.8),
        vec2(-0.7, 0.6), 
        vec2(-0.6, 0.4), 
        vec2(-0.4, 0.4), 
        vec2(-0.3, 0.6)
    ];

    // Define triangle vertices
    var triangleVertices = [
        vec2(0.3, 0.4), 
        vec2(0.7, 0.4), 
        vec2(0.5, 0.8)
    ];

    // Define triangle colors
    var colors = [
        vec4(1.0, 0.0, 0.0, 1.0), // Red
        vec4(0.0, 1.0, 0.0, 1.0), // Green
        vec4(0.0, 0.0, 1.0, 1.0)  // Blue
    ];

    // Define strip vertices for yellow and black zigzag
    var stripVertices = [
        vec2(-0.5, 0.2),    //V0
        vec2(-0.4, 0.0),    //V1
        vec2(-0.3, 0.2),    //V2
        vec2(-0.2, 0.0),    //V3
        vec2(-0.1, 0.2),    //V4
        vec2(0.0, 0.0),     //V5
        vec2(0.1, 0.2),     //V6
        vec2(0.2, 0.0),     //V7
        vec2(0.3, 0.2),     //V8
        vec2(0.4, 0.0),     //V9
        vec2(0.5, 0.2),    //V10
        
        // Second strip for black zigzag
        vec2(-0.5, -0.3),   //V11
        vec2(-0.4, -0.5),   //V12
        vec2(-0.3, -0.3),   //V13
        vec2(-0.2, -0.5),   //V14
        vec2(-0.1, -0.3),   //V15
        vec2(0.0, -0.5),    //V16
        vec2(0.1, -0.3),    //V17
        vec2(0.2, -0.5),    //V18
        vec2(0.3, -0.3),    //V19
        vec2(0.4, -0.5),    //V20
        vec2(0.5, -0.3)     //V21
    ];

    // Set up WebGL viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //Associate shader variables with data buffers
    var vPosition = gl.getAttribLocation(program, "vPosition");
    var vColor = gl.getAttribLocation(program, "vColor");

    //Load data into to GPU
    ///////////////////////
    // hexagon vertex buffer
    var hexagonBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, hexagonBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(hexagonVertices), gl.STATIC_DRAW);

    //draw the hexagon
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.drawArrays(gl.LINE_STRIP, 0, 7);

    //////////////////////////
    // triangle vertex buffer
    var triangleBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(triangleVertices), gl.STATIC_DRAW);

    //draw the triangle
    var triangleColorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    //Associate shader variables with triangle data buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBufferId);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBufferId);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

    //draw the independent triangle
    gl.enableVertexAttribArray(vPosition);
    gl.enableVertexAttribArray(vColor); // Enable color attribute
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    //////////////////////////
    // strip vertex buffer
    var stripBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, stripBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(stripVertices), gl.STATIC_DRAW);

    //Associate shader variables with strip data buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, stripBufferId);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.disableVertexAttribArray(vColor); // Disable color attribute
    gl.vertexAttrib4f(vColor, 1.0, 1.0, 0.0, 1.0); // Set color to yellow

    //draw the yellow zigzag
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 11);

    //draw the black zigzag
    gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 1.0); // Set color to black
    gl.drawArrays(gl.LINE_STRIP, 0, 11);

    //draw another black zigzag
    gl.drawArrays(gl.LINE_STRIP, 11, 11);
};
