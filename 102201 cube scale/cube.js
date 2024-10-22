var canvas;
var gl;
var points = [];
var colors = [];
var theta = [0, 0, 0];
var thetaLoc;
var time = 0.0;
var timeLoc;
var dt = 1.0 / 60.0; // 60 FPS

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var numVertices = 36; // 총 36개의 정점 (6면 * 6정점)

var flag = true; // 애니메이션을 켜고 끄는 플래그

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    colorCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // 셰이더를 로드하고 속성 버퍼를 초기화합니다.
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
    timeLoc = gl.getUniformLocation(program, "time");

    // 버튼 이벤트 리스너 설정
    document.getElementById("xButton").onclick = function () {
        axis = xAxis;
    };
    document.getElementById("yButton").onclick = function () {
        axis = yAxis;
    };
    document.getElementById("zButton").onclick = function () {
        axis = zAxis;
    };
    document.getElementById("toggleButton").onclick = function () {
        flag = !flag; // 애니메이션 플래그 전환
    };

    render();
}

function colorCube() {
    quad(1, 0, 3, 2);   // 파란색 면
    quad(2, 3, 7, 6);   // 노란색 면
    quad(3, 0, 4, 7);   // 초록색 면
    quad(6, 5, 1, 2);   // 청록색 면
    quad(4, 5, 6, 7);   // 빨간색 면
    quad(5, 4, 0, 1);   // 자홍색 면
}

function quad(a, b, c, d) {
    var vertices = [
        vec4(-0.5, -0.5, 0.5, 1.0),     // 0번 정점
        vec4(-0.5, 0.5, 0.5, 1.0),      // 1번 정점
        vec4(0.5, 0.5, 0.5, 1.0),       // 2번 정점
        vec4(0.5, -0.5, 0.5, 1.0),      // 3번 정점
        vec4(-0.5, -0.5, -0.5, 1.0),    // 4번 정점
        vec4(-0.5, 0.5, -0.5, 1.0),     // 5번 정점
        vec4(0.5, 0.5, -0.5, 1.0),      // 6번 정점
        vec4(0.5, -0.5, -0.5, 1.0)      // 7번 정점
    ];

    var vertexColors = [
        [0.0, 0.0, 0.0, 1.0],  // 검정색
        [1.0, 0.0, 0.0, 1.0],  // 빨간색
        [1.0, 1.0, 0.0, 1.0],  // 노란색
        [0.0, 1.0, 0.0, 1.0],  // 초록색
        [0.0, 0.0, 1.0, 1.0],  // 파란색
        [1.0, 0.0, 1.0, 1.0],  // 자홍색
        [0.0, 1.0, 1.0, 1.0],  // 청록색
        [1.0, 1.0, 1.0, 1.0]   // 흰색
    ];

    var indices = [a, b, c, a, c, d];

    for (var i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]]);
        colors.push(vertexColors[a]);
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (flag) {
        theta[axis] += 2.0; // 각도 업데이트
        time += dt; // 시간 업데이트
    }

    gl.uniform3fv(thetaLoc, theta);
    gl.uniform1f(timeLoc, time);

    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    requestAnimFrame(render);
}
