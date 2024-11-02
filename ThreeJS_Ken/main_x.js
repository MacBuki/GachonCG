// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderer 설정
const renderer = new THREE.WebGLRenderer({ antialias: true }); // 안티앨리어싱 활성화
renderer.setSize(window.innerWidth, window.innerHeight); // 창 크기에 맞게 설정
renderer.setPixelRatio(window.devicePixelRatio); // 디스플레이 픽셀 밀도를 설정
document.body.appendChild(renderer.domElement);

// Light sources
// Ambient Light (형광등 색)
const ambientLight = new THREE.AmbientLight(0xb9d3ff, 1); // 형광등 색, 강도 2
scene.add(ambientLight);

// Point Light 1 (형광등 색)
const pointLight1 = new THREE.PointLight(0xb9d3ff, 1, 100); // 강도 조정
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

// Point Light 2 (형광등 색)
const pointLight2 = new THREE.PointLight(0xb9d3ff, 1, 100); // 강도 조정
pointLight2.position.set(-5, 5, 5);
scene.add(pointLight2);

// Point Light 3 (형광등 색)
const pointLight3 = new THREE.PointLight(0xb9d3ff, 1, 100); // 강도 조정
pointLight3.position.set(5, -5, 5);
scene.add(pointLight3);

// Point Light 4 (형광등 색)
const pointLight4 = new THREE.PointLight(0xb9d3ff, 1, 100); // 강도 조정
pointLight4.position.set(-5, -5, 5);
scene.add(pointLight4);

// Directional Light (형광등 색)
const directionalLight = new THREE.DirectionalLight(0xb9d3ff, 1); // 강도 2
directionalLight.position.set(0, 10, 0);
scene.add(directionalLight);

const loader = new THREE.GLTFLoader();
loader.load(
  './CarGltf/Elantra.gltf', // GLTF 파일 경로를 정확히 지정
  function (gltf) {
    const model = gltf.scene;
    model.position.set(0, 0, 0); // 모델 위치 설정
    model.rotation.set(0, 0, 0); // 모델 회전 설정

    model.traverse((object) => {
      if (object.isMesh) {
        object.material.metalness = 0.5; // 메탈릭 값을 조정
        object.material.roughness = 0.5; // 러프니스 값을 조정
      }
    });

    scene.add(model);

    // 애니메이션 함수
    function animate() {
      requestAnimationFrame(animate);
      model.rotation.x += 0.005; // 회전 속도
      renderer.render(scene, camera);
    }
    animate();
  },
  undefined,
  function (error) {
    console.error('An error occurred:', error);
  }
);

// 기존 카메라 설정
camera.position.set(0, 1, 2.5); // x, y, z 값 조정
camera.lookAt(0, 0, 0); // 카메라가 모델의 중심을 바라보게 설정
