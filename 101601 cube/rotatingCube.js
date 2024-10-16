var gl;
var points = [];
var colors = [];
var theta = [0, 0, 0];
var thetaLoc;
var axis = 0;
var NumVertices = 36;
var deltaTheta = 5.0 * Math.PI / 180.0;  // 회전할 각도 (라디안)

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Define the cube vertices and colors
    colorCube();

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load data into GPU
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // Uniform variable for rotation
    thetaLoc = gl.getUniformLocation(program, "theta");

    // Event listeners for buttons to rotate along each axis
    document.getElementById("xButton").onclick = function () {
        axis = 0;
        theta[axis] += deltaTheta;  // X축 회전
        render();
    };

    document.getElementById("yButton").onclick = function () {
        axis = 1;
        theta[axis] += deltaTheta;  // Y축 회전
        render();
    };

    document.getElementById("zButton").onclick = function () {
        axis = 2;
        theta[axis] += deltaTheta;  // Z축 회전
        render();
    };

    render();  // 초기 렌더링
};

function colorCube() {
    quad(1, 0, 3, 2, 0); // front face - red
    quad(2, 3, 7, 6, 1); // right face - green
    quad(3, 0, 4, 7, 2); // bottom face - blue
    quad(6, 5, 1, 2, 3); // top face - yellow
    quad(4, 5, 6, 7, 4); // back face - magenta
    quad(5, 4, 0, 1, 5); // left face - cyan
}

function quad(a, b, c, d, colorIndex) {
    var vertices = [
        vec4(-0.5, -0.5,  0.5, 1.0), // 0
        vec4(-0.5,  0.5,  0.5, 1.0), // 1
        vec4( 0.5,  0.5,  0.5, 1.0), // 2
        vec4( 0.5, -0.5,  0.5, 1.0), // 3
        vec4(-0.5, -0.5, -0.5, 1.0), // 4
        vec4(-0.5,  0.5, -0.5, 1.0), // 5
        vec4( 0.5,  0.5, -0.5, 1.0), // 6
        vec4( 0.5, -0.5, -0.5, 1.0)  // 7
    ];

    var vertexColors = [
        [1.0, 0.0, 0.0, 1.0], // red
        [0.0, 1.0, 0.0, 1.0], // green
        [0.0, 0.0, 1.0, 1.0], // blue
        [1.0, 1.0, 0.0, 1.0], // yellow
        [1.0, 0.0, 1.0, 1.0], // magenta
        [0.0, 1.0, 1.0, 1.0]  // cyan
    ];

    var indices = [a, b, c, a, c, d];

    // 각 면에 동일한 색상 할당
    for (var i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]]);
        colors.push(vertexColors[colorIndex]); // 동일한 색상 사용
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 회전각을 쉐이더에 전달
    gl.uniform3fv(thetaLoc, theta);

    // 큐브 그리기
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
