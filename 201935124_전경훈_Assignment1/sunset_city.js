var gl;
var points = [];
var colors = [];

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Define the gradient background
    defineBackground();

    defineBackgroundRectangle();

    // Define mountain silhouette
    defineMountain();

    defineNamsanTower()

    defineLotteTower()

    defineApartments()

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load position buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Load color buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    render();
};

function defineBackground() {
    // Define points for the background as a single large rectangle
    points.push(
        vec4(-1, -1, 0, 1), // bottom left
        vec4(1, -1, 0, 1),  // bottom right
        vec4(1, 1, 0, 1),   // top right
        vec4(-1, -1, 0, 1), // bottom left
        vec4(1, 1, 0, 1),   // top right
        vec4(-1, 1, 0, 1)   // top left
    );

    // Apply gradient colors explicitly to the background
    colors.push(
        vec4(0.6, 0.3, 0.4, 1.0),  // bottom left (grayish purple)
        vec4(0.6, 0.3, 0.4, 1.0),  // bottom right (grayish purple)
        vec4(1.0, 0.6, 0.2, 1.0),  // top right (orange)

        vec4(0.6, 0.3, 0.4, 1.0),  // bottom left (grayish purple)
        vec4(1.0, 0.6, 0.2, 1.0),  // top right (orange)
        vec4(1.0, 0.6, 0.2, 1.0)   // top left (orange)
    );
}

function defineBackgroundRectangle() {
    var x = -1.0;       
    var y = -1.4;       
    var width = 3.0;    
    var height = 0.7;  

    defineRectangle(x, y, width, height, vec4(0.3, 0.3, 0.3, 1.0)); 
}


function defineMountain() {
    // Define points for a slightly larger trapezoid-shaped mountain, shifted further left and up
    points.push(
        vec4(-0.8, -0.7, 0.0, 1.0),  // bottom left of mountain
        vec4(-0.2, -0.7, 0.0, 1.0),  // bottom right of mountain
        vec4(-0.3, -0.5, 0.0, 1.0),  // top right of mountain

        vec4(-0.8, -0.7, 0.0, 1.0),  // bottom left of mountain
        vec4(-0.3, -0.5, 0.0, 1.0),  // top right of mountain
        vec4(-0.6, -0.5, 0.0, 1.0)   // top left of mountain
    );

    // Apply black color to each point of the mountain silhouette
    colors.push(
        vec4(0.0, 0.0, 0.0, 1.0),  // color for bottom left of mountain
        vec4(0.0, 0.0, 0.0, 1.0),  // color for bottom right of mountain
        vec4(0.0, 0.0, 0.0, 1.0),  // color for top right of mountain

        vec4(0.0, 0.0, 0.0, 1.0),  // color for bottom left of mountain
        vec4(0.0, 0.0, 0.0, 1.0),  // color for top right of mountain
        vec4(0.0, 0.0, 0.0, 1.0)   // color for top left of mountain
    );
}


function defineNamsanTower() {
    // Variables to control position offset
    var xOffset = -0.45; // Move left by 30%
    var yOffset = -0.25; // Move down by 20%

    // Define a smaller, narrower rectangular base for the tower, with offset applied
    points.push(
        vec4(-0.0064 + xOffset, -0.25 + yOffset, 0.0, 1.0),  // bottom left of the tower
        vec4(0.0064 + xOffset, -0.25 + yOffset, 0.0, 1.0),   // bottom right of the tower
        vec4(0.0064 + xOffset, -0.14 + yOffset, 0.0, 1.0),   // top right of the tower

        vec4(-0.0064 + xOffset, -0.25 + yOffset, 0.0, 1.0),  // bottom left of the tower
        vec4(0.0064 + xOffset, -0.14 + yOffset, 0.0, 1.0),   // top right of the tower
        vec4(-0.0064 + xOffset, -0.14 + yOffset, 0.0, 1.0)   // top left of the tower
    );

    // Define the triangular top part of the tower, with offset applied
    points.push(
        vec4(-0.0192 + xOffset, -0.14 + yOffset, 0.0, 1.0),  // bottom left of the triangular top
        vec4(0.0192 + xOffset, -0.14 + yOffset, 0.0, 1.0),   // bottom right of the triangular top
        vec4(0.0 + xOffset, -0.08 + yOffset, 0.0, 1.0)       // top of the triangular top
    );


    // Apply dark gray color to the rectangular base of the tower
    for (var i = 0; i < 6; i++) {
        colors.push(vec4(0.2, 0.2, 0.2, 1.0)); // dark gray for tower base
    }

    // Apply darker gray color for the triangular top
    for (var i = 0; i < 3; i++) {
        colors.push(vec4(0.15, 0.15, 0.15, 1.0)); // slightly darker gray for triangle
    }

}

function defineLotteTower() {
    // Variables to control position offset for Lotte Tower
    var xOffset = 0.7;   // Horizontal position adjustment (slightly to the right)
    var yOffset = -0;  // Vertical position adjustment

    // Define the main shape of the tower as a trapezoidal structure with increased size
    points.push(
        vec4(-0.075 + xOffset, -0.75 + yOffset, 0.0, 1.0), // bottom left (50% larger)
        vec4(0.075 + xOffset, -0.75 + yOffset, 0.0, 1.0),  // bottom right
        vec4(0.03 + xOffset, 0.6 + yOffset, 0.0, 1.0),     // top right (narrower than bottom)

        vec4(-0.075 + xOffset, -0.75 + yOffset, 0.0, 1.0), // bottom left
        vec4(0.03 + xOffset, 0.6 + yOffset, 0.0, 1.0),     // top right
        vec4(-0.03 + xOffset, 0.6 + yOffset, 0.0, 1.0)     // top left
    );

    // Define the rectangular cutout at the top of the tower with increased size
    points.push(
        vec4(-0.015 + xOffset, 0.525 + yOffset, 0.0, 1.0), // bottom left of the cutout
        vec4(0.015 + xOffset, 0.525 + yOffset, 0.0, 1.0),  // bottom right of the cutout
        vec4(0.015 + xOffset, 0.6 + yOffset, 0.0, 1.0),    // top right of the cutout

        vec4(-0.015 + xOffset, 0.525 + yOffset, 0.0, 1.0), // bottom left of the cutout
        vec4(0.015 + xOffset, 0.6 + yOffset, 0.0, 1.0),    // top right of the cutout
        vec4(-0.015 + xOffset, 0.6 + yOffset, 0.0, 1.0)    // top left of the cutout
    );

    // Apply dark gray color to the tower's main body
    for (var i = 0; i < 6; i++) {
        colors.push(vec4(0.3, 0.3, 0.3, 1.0)); // dark gray for the main body
    }

    // Apply slightly darker gray for the cutout at the top
    for (var i = 0; i < 6; i++) {
        colors.push(vec4(0.2, 0.2, 0.2, 1.0)); // darker gray for the cutout
    }
}

var maxBuildingHeight = 0.5; // 아파트의 최대 높이 오프셋 조정 가능

function defineApartments() {
    var numBuildings = 100; // 아파트의 수
    var xOffset, yOffset = -1.0; // 바닥에 고정
    var buildingWidth, buildingHeight;

    for (var i = 0; i < numBuildings; i++) {
        // 랜덤 위치와 크기 설정
        xOffset = -1.0 + Math.random() * 2.0; // 화면 내 랜덤 위치
        buildingWidth = 0.1 + Math.random() * 0.05; // 건물 폭
        buildingHeight = 0.1 + Math.random() * (maxBuildingHeight - 0.1); // 건물 높이 (최대 높이 이하로 제한)

        // 아파트 건물 정의
        defineRectangle(xOffset, yOffset, buildingWidth, buildingHeight, vec4(0.3, 0.3, 0.3, 1.0));

        // 창문 추가
        defineWindows(xOffset, yOffset, buildingWidth, buildingHeight);
    }
}

function defineRectangle(x, y, width, height, color) {
    // 직사각형을 정의하여 건물이나 창문으로 사용
    points.push(
        vec4(x, y, 0, 1),
        vec4(x + width, y, 0, 1),
        vec4(x + width, y + height, 0, 1),

        vec4(x, y, 0, 1),
        vec4(x + width, y + height, 0, 1),
        vec4(x, y + height, 0, 1)
    );

    for (var i = 0; i < 6; i++) {
        colors.push(color);
    }
}

function defineWindows(buildingX, buildingY, buildingWidth, buildingHeight) {
    var numRows = 4; // 창문의 행 수
    var numCols = 3; // 창문의 열 수
    var windowWidth = buildingWidth / (numCols + 1); // 창문의 폭
    var windowHeight = buildingHeight / (numRows + 1); // 창문의 높이

    // 창문 위치 조정용 오프셋
    var xAdjustment = buildingWidth * 0.4; // X축으로 10% 이동
    var yAdjustment = buildingHeight * 0.4; // Y축으로 10% 이동

    for (var row = 1; row <= numRows; row++) {
        for (var col = 1; col <= numCols; col++) {
            // 창문의 위치 계산 (오프셋 추가)
            var windowX = buildingX + col * windowWidth - (buildingWidth / 2) + xAdjustment;
            var windowY = buildingY + row * windowHeight - (buildingHeight / 2) + yAdjustment;

            // 야경을 표현하기 위해 창문을 랜덤하게 노란색으로 설정
            var color = Math.random() < 0.3 ? vec4(1.0, 0.9, 0.3, 1.0) : vec4(0.0, 0.0, 0.0, 1.0);
            defineRectangle(windowX, windowY, windowWidth * 0.7, windowHeight * 0.7, color);
        }
    }
}



function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
}
