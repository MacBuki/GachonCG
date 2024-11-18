var gl;
var points = [];
var colors = [];

// Layer speeds
const LAYER_SPEEDS = {
    BACKGROUND: 0.3,
    ROAD: 8.0,
    OUTER_CARS: 1.5,
};

let multiplier = 1; // 속도 조절 변수
function setMultiplier(value) {
    multiplier = value;
}

function syncPointsAndColors() {
    const program = gl.getParameter(gl.CURRENT_PROGRAM);

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
}

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // initialize
    initialize();

    render();
};

function defineBackground() {
    // Define points and colors for the background
    points.push(
        vec4(-1, -0.5, 0, 1),
        vec4(1, -0.5, 0, 1),
        vec4(1, 1, 0, 1),

        vec4(-1, -0.5, 0, 1),
        vec4(1, 1, 0, 1),
        vec4(-1, 1, 0, 1)
    );

    colors.push(
        vec4(0.2, 0.3, 0.5, 1), // Background color gradient
        vec4(0.2, 0.3, 0.5, 1),
        vec4(0.1, 0.1, 0.2, 1),

        vec4(0.2, 0.3, 0.5, 1),
        vec4(0.1, 0.1, 0.2, 1),
        vec4(0.1, 0.1, 0.2, 1)
    );
}

// 건물 정보를 생성하고 저장하는 임시 Queue
const buildingQueue = [];

function initialize() {
    initializeBuildings();
    initializeTrees();
    initializeStars();
}

function initializeBuildings() {
    // make 1.0 (-0.5~0.5) offset for sliding window for buildings

    let xStart = -1.5;
    while (xStart < 1.5) {
        const building = generateBuilding(xStart);
        buildingQueue.push(building);

        xStart = building.x + building.width; // Move to the next building
    }
}

function generateBuilding(x) {
    let buildingWidth = Math.random() * 0.2 + 0.1; // Random building width
    let buildingHeight = Math.random() * 0.3 + 0.2; // Random building height

    const building = {
        x,
        width: buildingWidth,
        height: buildingHeight,
        windowConfig: [],
    }

    // Windows
    let windowRows = Math.floor(buildingHeight / 0.05);
    let windowCols = Math.floor(buildingWidth / 0.05);

    for (let row = 0; row < windowRows; row++) {
        const rowWindowConfig = [];
        for (let col = 0; col < windowCols; col++) {
            let isLightOn = Math.random() > 0.7;
            rowWindowConfig.push({
                isLightOn,
            });
        }

        building.windowConfig.push(rowWindowConfig);
    }

    return building;

} 

function updateBuildings() {
    // remove buildings that's x + width is less than -1.0
    buildingQueue.forEach((building, index) => {
        building.x += LAYER_SPEEDS.BACKGROUND * 0.01 * multiplier;
        buildingQueue[index] = building;
    });

    buildingQueue.forEach((building, index) => {
        if (building.x + building.width < -1.0) {
            buildingQueue.splice(index, 1);
        }
    });

    // Add new buildings
    let minX = 1.0;
    let x = -1.0;
    buildingQueue.forEach(building => {
        x = Math.max(x, building.x + building.width);
        minX = Math.min(minX, building.x);
    });

    while (x < 1.5) {
        const building = generateBuilding(x);
        buildingQueue.push(building);

        x = building.x + building.width;
    }

    while (minX > -1.5) {
        const building = generateBuilding(minX);
        building.x = minX - building.width;
        buildingQueue.push(building);

        minX = building.x;
    }
}

function renderBuildings() {
    buildingQueue.forEach(building => {
        renderBuilding(building);
    });
}

function renderBuilding(building) {
    // Define buildings
    const buildingColors = vec4(0.1, 0.1, 0.1, 1.0);
    const lightOnColor = vec4(1.0, 1.0, 0.8, 1.0);
    const lightOffColor = vec4(0.2, 0.2, 0.2, 1.0);

    const {x, width, height, windowConfig} = building;

    if ([x, width, height].find(n => typeof n !== 'number')) throw new Error('invalid building configuration');
    if (windowConfig.length === 0) throw new Error('Missing building window configuration matrix');

    const availableWindowRows = Math.floor(height / 0.05);
    const availableWindowCols = Math.floor(width / 0.05);

    if (windowConfig.length > availableWindowRows) throw new Error('invalid windowConfig matrix size');
    if (windowConfig.find(n => n.length > availableWindowCols)) throw new Error('invalid windowConfig matrix size');

    const xStart = x;
    const xEnd = x + width;

    // Building shape
    points.push(
        vec4(xStart, -0.5, 0, 1), // Adjusted to match river
        vec4(xEnd, -0.5, 0, 1),
        vec4(xEnd, -0.5 + height, 0, 1),

        vec4(xStart, -0.5, 0, 1),
        vec4(xEnd, -0.5 + height, 0, 1),
        vec4(xStart, -0.5 + height, 0, 1)
    );

    colors.push(
        buildingColors,
        buildingColors,
        buildingColors,

        buildingColors,
        buildingColors,
        buildingColors
    );

    for (let row = 0; row < windowConfig.length; row++) {
        const rowWindowConfig = windowConfig[row];

        for (let col = 0; col < rowWindowConfig.length; col++) {
            let windowXStart = xStart + col * 0.05;
            let windowYStart = -0.5 + row * 0.05; // Adjusted for building base

            let windowXEnd = windowXStart + 0.03;
            let windowYEnd = windowYStart + 0.03;

            points.push(
                vec4(windowXStart, windowYStart, 0, 1),
                vec4(windowXEnd, windowYStart, 0, 1),
                vec4(windowXEnd, windowYEnd, 0, 1),

                vec4(windowXStart, windowYStart, 0, 1),
                vec4(windowXEnd, windowYEnd, 0, 1),
                vec4(windowXStart, windowYEnd, 0, 1)
            );

            let isLightOn = false;
            const configValue = rowWindowConfig[col];
           
            if (typeof configValue === 'object') {
                isLightOn = configValue.isLightOn;
            } else if (typeof configValue === 'boolean') {
                isLightOn = configValue;
            }

            let windowColor = isLightOn ? lightOnColor : lightOffColor;

            colors.push(
                windowColor,
                windowColor,
                windowColor,

                windowColor,
                windowColor,
                windowColor
            );
        }
    }
}

function defineRiverAndBuildings() {
    // Define river
    points.push(
        vec4(-1, -0.5, 0, 1), // Adjusted to match buildings
        vec4(1, -0.5, 0, 1),
        vec4(1, -0.7, 0, 1),

        vec4(-1, -0.5, 0, 1),
        vec4(1, -0.7, 0, 1),
        vec4(-1, -0.7, 0, 1)
    );

    colors.push(
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),

        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    );

    renderBuildings();
}

const trees = [];

function initializeTrees() {
    const treeSpacing = 1.5; // Spacing between trees

    let x = -1.0;
    while (x < 1.0) {
        trees.push({
            x,
        });

        x += treeSpacing;
    }
}

function updateTrees() {
    trees.forEach(tree => {
        tree.x += LAYER_SPEEDS.ROAD * 0.01 * multiplier;
    });

    trees.forEach((tree, index) => {
        if (tree.x > 1.0) {
            trees.splice(index, 1);
        }
    });

    let x = -1.0;
    let minX = 1.0;
    trees.forEach(tree => {
        x = Math.max(x, tree.x);
        minX = Math.min(minX, tree.x);
    });

    while (x < 1.0) {
        trees.push({
            x,
        });

        x += 1.5;
    }

    while (minX > -1.0) {
        trees.push({
            x: minX - 1.5,
        });

        minX -= 1.5;
    }
}

function defineTree(tree) {
    // Define trees
    const treeBaseWidth = 0.14; // Trunk width
    const treeBaseHeight = 0.7; // Adjusted trunk height
    const treeCanopyWidth = 0.36; // Canopy width
    const treeCanopyHeight = 1.0 - (-0.9 + treeBaseHeight); // Calculate to reach 1.0

    const { x } = tree;

    // Tree trunk
    points.push(
        vec4(x, -0.9, 0, 1),                           // Bottom
        vec4(x + treeBaseWidth, -0.9, 0, 1),          // Bottom right
        vec4(x + treeBaseWidth, -0.9 + treeBaseHeight, 0, 1), // Top right

        vec4(x, -0.9, 0, 1),                           // Bottom
        vec4(x + treeBaseWidth, -0.9 + treeBaseHeight, 0, 1), // Top right
        vec4(x, -0.9 + treeBaseHeight, 0, 1)          // Top left
    );
    colors.push(
        vec4(0.4, 0.2, 0.1, 1.0),  // Brown trunk color
        vec4(0.4, 0.2, 0.1, 1.0),
        vec4(0.4, 0.2, 0.1, 1.0),

        vec4(0.4, 0.2, 0.1, 1.0),
        vec4(0.4, 0.2, 0.1, 1.0),
        vec4(0.4, 0.2, 0.1, 1.0)
    );

    // Tree canopy
    points.push(
        vec4(x - treeCanopyWidth / 2, -0.9 + treeBaseHeight, 0, 1),
        vec4(x + treeBaseWidth + treeCanopyWidth / 2, -0.9 + treeBaseHeight, 0, 1),
        vec4(x + treeBaseWidth / 2, 1.0, 0, 1) // Top of canvas
    );
    colors.push(
        vec4(0.0, 0.3, 0.0, 1.0),  // Green canopy color
        vec4(0.0, 0.3, 0.0, 1.0),
        vec4(0.0, 0.3, 0.0, 1.0)
    );
}

function defineRoad() {
    // Define trees
    trees.forEach(tree => {
        defineTree(tree);
    });

    // Define the guardrail as a thicker horizontal bar across the screen
    points.push(
        vec4(-1.0, -0.8, 0, 1),  // Bottom left
        vec4(1.0, -0.8, 0, 1),   // Bottom right
        vec4(1.0, -0.6, 0, 1),  // Top right (thicker)

        vec4(-1.0, -0.8, 0, 1),  // Bottom left
        vec4(1.0, -0.6, 0, 1),  // Top right (thicker)
        vec4(-1.0, -0.6, 0, 1)  // Top left
    );
    colors.push(
        vec4(0.3, 0.3, 0.3, 1.0),  // Gray color
        vec4(0.3, 0.3, 0.3, 1.0),
        vec4(0.3, 0.3, 0.3, 1.0),

        vec4(0.3, 0.3, 0.3, 1.0),
        vec4(0.3, 0.3, 0.3, 1.0),
        vec4(0.3, 0.3, 0.3, 1.0)
    );
    
    // Add vertical guardrail supports
    const postWidth = 0.1;
    const postHeight = 0.1;
    for (let i = -0.95; i <= 0.95; i += 0.6) {
        points.push(
            vec4(i, -0.9, 0, 1),                    // Bottom left
            vec4(i + postWidth, -0.9, 0, 1),       // Bottom right
            vec4(i + postWidth, -0.8, 0, 1),       // Top right

            vec4(i, -0.9, 0, 1),                    // Bottom left
            vec4(i + postWidth, -0.8, 0, 1),       // Top right
            vec4(i, -0.8, 0, 1)                    // Top left
        );
        colors.push(
            vec4(0.3, 0.3, 0.3, 1.0),  // Same gray color as guardrail
            vec4(0.3, 0.3, 0.3, 1.0),
            vec4(0.3, 0.3, 0.3, 1.0),

            vec4(0.3, 0.3, 0.3, 1.0),
            vec4(0.3, 0.3, 0.3, 1.0),
            vec4(0.3, 0.3, 0.3, 1.0)
        );
    }
}

let carOffset = 0;
function defineCar() {
    const realOffset = (carOffset + 3) % 3 - 1.5;
    renderCar(realOffset);
}

function updateCar() {
    carOffset += LAYER_SPEEDS.OUTER_CARS * 0.01 * multiplier;
}

function renderCar(offset = 0) {
    // 차량 색상
    const carColor = vec4(0.5, 0.5, 0.5, 1.0); // 회색
    const windowColor = vec4(0.2, 0.2, 0.8, 1.0); // 파란색 (창문)
    const headlightColor = vec4(1.0, 1.0, 0.0, 1.0); // 노란색 (헤드라이트)
    const rearlightColor = vec4(1.0, 0.0, 0.0, 1.0); // 빨간섹 (헤드라이트)

    // 차체
    points.push(
        vec4(-0.6 + offset, -1.0, 0, 1), // Bottom-left
        vec4(0.6 + offset, -1.0, 0, 1),  // Bottom-right
        vec4(0.6 + offset, -0.4, 0, 1),  // Top-right

        vec4(-0.6 + offset, -1.0, 0, 1), // Bottom-left
        vec4(0.6 + offset, -0.4, 0, 1),  // Top-right
        vec4(-0.6 + offset, -0.4, 0, 1)  // Top-left
    );
    colors.push(
        carColor, carColor, carColor,
        carColor, carColor, carColor
    );

    // 차체2
    points.push(
        vec4(-0.4 + offset, -0.4, 0, 1), // 윗부분 Left
        vec4(0.4 + offset, -0.4, 0, 1),  // 윗부분 Right
        vec4(0.4 + offset, 0.2, 0, 1),  // 윗부분 Top (30% 증가)

        vec4(-0.4 + offset, -0.4, 0, 1), // 윗부분 Left
        vec4(0.4 + offset, 0.2, 0, 1),  // 윗부분 Top
        vec4(-0.4 + offset, 0.2, 0, 1)  // 윗부분 Top Left
    );
    colors.push(
        carColor, carColor, carColor,
        carColor, carColor, carColor
    );

    // 창문
    points.push(
        vec4(-0.4 + offset, -0.4, 0, 1), // Bottom-left of window
        vec4(0.0 + offset, -0.4, 0, 1),  // Bottom-right of window
        vec4(0.0 + offset, 0.1, 0, 1),   // Top-right of window

        vec4(-0.4 + offset, -0.4, 0, 1), // Bottom-left of window
        vec4(0.0 + offset, 0.1, 0, 1),   // Top-right of window
        vec4(-0.4 + offset, 0.1, 0, 1)   // Top-left of window
    );
    colors.push(
        windowColor, windowColor, windowColor,
        windowColor, windowColor, windowColor
    );

    points.push(
        vec4(0.1 + offset, -0.4, 0, 1),  // Bottom-left of window
        vec4(0.4 + offset, -0.4, 0, 1),  // Bottom-right of window
        vec4(0.4 + offset, 0.1, 0, 1),   // Top-right of window

        vec4(0.1 + offset, -0.4, 0, 1),  // Bottom-left of window
        vec4(0.4 + offset, 0.1, 0, 1),   // Top-right of window
        vec4(0.1 + offset, 0.1, 0, 1)    // Top-left of window
    );
    colors.push(
        windowColor, windowColor, windowColor,
        windowColor, windowColor, windowColor
    );

    // 헤드라이트
    points.push(
        vec4(0.5 + offset, -0.7, 0, 1),  // Bottom-left of headlight
        vec4(0.6 + offset, -0.7, 0, 1),  // Bottom-right of headlight
        vec4(0.6 + offset, -0.6, 0, 1),  // Top-right of headlight

        vec4(0.5 + offset, -0.7, 0, 1),  // Bottom-left of headlight
        vec4(0.6 + offset, -0.6, 0, 1),  // Top-right of headlight
        vec4(0.5 + offset, -0.6, 0, 1)   // Top-left of headlight
    );
    colors.push(
        rearlightColor, rearlightColor, rearlightColor,
        rearlightColor, rearlightColor, rearlightColor
    );

    points.push(
        vec4(-0.6 + offset, -0.7, 0, 1), // Bottom-left of headlight
        vec4(-0.5 + offset, -0.7, 0, 1), // Bottom-right of headlight
        vec4(-0.5 + offset, -0.6, 0, 1), // Top-right of headlight

        vec4(-0.6 + offset, -0.7, 0, 1), // Bottom-left of headlight
        vec4(-0.5 + offset, -0.6, 0, 1), // Top-right of headlight
        vec4(-0.6 + offset, -0.6, 0, 1)  // Top-left of headlight
    );
    colors.push(
        headlightColor, headlightColor, headlightColor,
        headlightColor, headlightColor, headlightColor
    );
}

function onFrame() {
    updateBuildings();
    updateTrees();
    updateCar();
}

function defineInterior() {
    const pillarColor = vec4(0.1, 0.1, 0.1, 1.0); // 테두리 색상
    const resolution = 20; // 곡선 품질 (삼각형 개수)

    // 둥근 삼각형 (A-필러 테두리)
    const baseX = 0.8; // 곡선 기준점 (오른쪽 아래)
    const baseY = -1.0;
    const radiusOuter = 2.7; // 외부 곡선 반지름
    const radiusInner = 1.8; // 내부 곡선 반지름 (테두리 두께 조절)

    const bPillarWidth = .3; // 차량 B필러 너비
    const doorFrameHeight = .2; // 문짝 프레임 높이

    for (let i = 0; i < resolution; i++) {
        const theta1 = Math.PI - (Math.PI * i) / resolution;
        const theta2 = Math.PI - (Math.PI * (i + 1)) / resolution;

        const x1Outer = baseX + radiusOuter * Math.cos(theta1);
        const y1Outer = baseY + radiusOuter * Math.sin(theta1);
        const x2Outer = baseX + radiusOuter * Math.cos(theta2);
        const y2Outer = baseY + radiusOuter * Math.sin(theta2);

        const x1Inner = baseX + radiusInner * Math.cos(theta1);
        const y1Inner = baseY + radiusInner * Math.sin(theta1);
        const x2Inner = baseX + radiusInner * Math.cos(theta2);
        const y2Inner = baseY + radiusInner * Math.sin(theta2);

        // 외부 삼각형 (테두리 바깥쪽)
        points.push(
            vec4(x1Outer, y1Outer, 0, 1),
            vec4(x2Outer, y2Outer, 0, 1),
            vec4(x1Inner, y1Inner, 0, 1)
        );
        colors.push(pillarColor, pillarColor, pillarColor);

        // 내부 삼각형 (테두리 안쪽)
        points.push(
            vec4(x2Outer, y2Outer, 0, 1),
            vec4(x2Inner, y2Inner, 0, 1),
            vec4(x1Inner, y1Inner, 0, 1)
        );
        colors.push(pillarColor, pillarColor, pillarColor);
    }

    // B 필러 구현
    points.push(
        vec4(baseX, baseY, 0, 1),   // 내부 아래
        vec4(baseX + bPillarWidth, baseY, 0, 1),   // 외부 아래
        vec4(baseX, 1.0, 0, 1),    // 외부 위

        vec4(baseX + bPillarWidth, baseY, 0, 1),   // 내부 아래
        vec4(baseX + bPillarWidth, 1.0, 0, 1),    // 외부 위
        vec4(baseX, 1.0, 0, 1)     // 내부 위
    );
    colors.push(
        pillarColor, pillarColor, pillarColor,
        pillarColor, pillarColor, pillarColor
    );

    // 차량 차체 프레임
    points.push(
        vec4(-1, baseY, 0.0, 1), // 좌측 하단
        vec4(baseX, baseY, 0.0, 1), // 우측 하단
        vec4(baseX, baseY + doorFrameHeight, 0.0, 1), // 우측 상단 (프레임 기준)
        vec4(baseX, baseY + doorFrameHeight, 0.0, 1), // 우측 상단 (프레임 기준)
        vec4(-1, baseY + doorFrameHeight, 0.0, 1), // 좌측 상단
        vec4(-1, baseY, 0.0, 1),
    )
    colors.push(
        pillarColor, pillarColor, pillarColor,
        pillarColor, pillarColor, pillarColor
    )
}

function flushAll() {
    points = [];
    colors = [];
    
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 레이어 업데이트
    onFrame();

    // Define layers
    defineBackground();          // Layer 6: Background
    defineStars();               // Layer 5: Stars
    defineRiverAndBuildings();   // Layer 4: River and buildings
    defineRoad();                // Layer 3: Road, guardrails, and trees
    defineCar();                 // Layer 2: Car
    defineInterior();            // Layer 1: Car interior

    syncPointsAndColors();

    // 모든 레이어를 렌더링
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
    flushAll();

    // 애니메이션이 필요하면 업데이트 로직 추가 가능
    requestAnimationFrame(render);
}

function reverseDirection() {
    multiplier *= -1;
}

const stars = [];
function initializeStars() {
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
            size: Math.pow(Math.random(), 2) * 0.01,
        });
    }
}

function addStar(x, y, size) {
    stars.push({
        x,
        y,
        size: size || Math.random() * 0.01,
    });
}

function defineStars() {
    stars.forEach(star => {
        drawStarAt(star.x, star.y, star.size);
    });
}

function drawStarAt(x, y, size = 0.01) {
    points.push(
        vec4(x - size, y - size, 0, 1),
        vec4(x + size, y - size, 0, 1),
        vec4(x + size, y + size, 0, 1),

        vec4(x - size, y - size, 0, 1),
        vec4(x + size, y + size, 0, 1),
        vec4(x - size, y + size, 0, 1)
    );

    const starColor = vec4(1.0, 1.0, 1.0, 1.0);

    colors.push(
        starColor,
        starColor,
        starColor,
        starColor,
        starColor,
        starColor,
    );
}