"use strict";

var canvas;
var gl;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];

var thetaLoc;

var flag = false;

var rotationSpeed = 5.0; // 초기 회전 속도

var points = [];
var colors = [];

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // 구 생성
    var mySphere = sphere();
    mySphere.scale(0.5, 0.5, 0.5);
    mySphere.translate(0.0, 0.75, 0.0); // 구의 위치를 위로 이동
    points = points.concat(mySphere.TriangleVertices);
    colors = colors.concat(mySphere.TriangleVertexColors);

    // 원통 생성
    var myCylinder = cylinder(36, 1, true);
    myCylinder.scale(0.3, 0.75, 0.3);
    myCylinder.translate(0.0, 0.0, 0.0); // 원통을 구 아래에 붙도록 위치 조정
    points = points.concat(myCylinder.TriangleVertices);
    colors = colors.concat(myCylinder.TriangleVertexColors);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");

    // 비디오 요소 가져오기
    var video = document.querySelector("video");

    document.getElementById("xButton").onclick = function () {
        axis = xAxis;
    };
    document.getElementById("yButton").onclick = function () {
        axis = yAxis;
    };
    document.getElementById("zButton").onclick = function () {
        axis = zAxis;
    };
    document.getElementById("ButtonT").onclick = function () {
        flag = !flag;
        if (flag) {
            video.muted = false; // 음소거 해제
            video.play();        // 비디오 재생
        } else {
            video.muted = true;  // 음소거 설정
            video.pause();       // 비디오 일시 정지
        }
    };

    document.getElementById("speedSlider").oninput = function (event) {
        rotationSpeed = parseFloat(event.target.value);
    };

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (flag) theta[axis] += rotationSpeed;

    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);

    requestAnimationFrame(render);
}
