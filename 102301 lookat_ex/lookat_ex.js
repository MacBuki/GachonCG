var canvas;
var gl;
var numVertices = 36;
var pointsArray = [];
var colorsArray = [];

var vertices = [
    vec3(-0.5, -0.5, 0.5), 
    vec3(-0.5, 0.5, 0.5),  
    vec3(0.5, 0.5, 0.5),   
    vec3(0.5, -0.5, 0.5),  
    vec3(-0.5, -0.5, -0.5),
    vec3(-0.5, 0.5, -0.5), 
    vec3(0.5, 0.5, -0.5),  
    vec3(0.5, -0.5, -0.5)  
];

var faceColors = [
    vec4(1.0, 0.0, 0.0, 1.0), // 빨강
    vec4(0.0, 1.0, 0.0, 1.0), // 초록
    vec4(0.0, 0.0, 1.0, 1.0), // 파랑
    vec4(1.0, 1.0, 0.0, 1.0), // 노랑
    vec4(1.0, 0.0, 1.0, 1.0), // 자홍
    vec4(0.0, 1.0, 1.0, 1.0)  // 청록
];

var radius = 0.5;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI / 180.0;

var mvMatrix, pMatrix;
var modelView, projection;
var eye;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

function quad(a, b, c, d, color) {
    pointsArray.push(vertices[a]);
    colorsArray.push(color);
    pointsArray.push(vertices[b]);
    colorsArray.push(color);
    pointsArray.push(vertices[c]);
    colorsArray.push(color);
    pointsArray.push(vertices[a]);
    colorsArray.push(color);
    pointsArray.push(vertices[c]);
    colorsArray.push(color);
    pointsArray.push(vertices[d]);
    colorsArray.push(color);
}

function colorCube() {
    quad(1, 0, 3, 2, faceColors[0]); // 앞면
    quad(2, 3, 7, 6, faceColors[1]); // 오른쪽면
    quad(3, 0, 4, 7, faceColors[2]); // 아래면
    quad(6, 5, 1, 2, faceColors[3]); // 윗면
    quad(4, 5, 6, 7, faceColors[4]); // 뒷면
    quad(5, 4, 0, 1, faceColors[5]); // 왼쪽면
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelView = gl.getUniformLocation(program, "modelView");
    projection = gl.getUniformLocation(program, "projection");

    document.getElementById("Button1").onclick = function () {
        radius *= 1.1; console.log("radius:", radius); console.log("eye:", eye);
    };
    document.getElementById("Button2").onclick = function () {
        radius *= 0.9; console.log("radius:", radius); console.log("eye:", eye);
    };
    document.getElementById("Button3").onclick = function () {
        theta += dr; console.log("theta:", theta); console.log("eye:", eye);
    };
    document.getElementById("Button4").onclick = function () {
        theta -= dr; console.log("theta:", theta); console.log("eye:", eye);
    };
    document.getElementById("Button5").onclick = function () {
        phi += dr;
        console.log("phi:", phi);
        console.log("eye:", eye);
    };
    document.getElementById("Button6").onclick = function () {
        phi -= dr;
        console.log("phi:", phi);
        console.log("eye:", eye);
    };

    render();
};

var render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // eye 벡터 계산
    eye = vec3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta),
        radius * Math.cos(theta) * Math.cos(phi)
    );

    mvMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    requestAnimFrame(render);
};
