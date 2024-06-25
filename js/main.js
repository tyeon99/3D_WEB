import * as THREE from './libs/three.module.js';
import { OrbitControls } from './libs/OrbitControls.js';

// 페이지가 로드되면 실행될 함수
window.addEventListener('load', init);

function init() {
  // canvas 엘리먼트 생성
  const canvas = document.createElement('canvas');

  // canvas 크기 설정
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // HTML 문서의 body 요소에 canvas 추가
  document.body.appendChild(canvas);

  // WebGLRenderer 생성 및 설정
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.width, canvas.height);

  // 씬(Scene) 생성
  const scene = new THREE.Scene();

  // 카메라(Camera) 생성 (원근 투영 카메라)
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 20;

  // OrbitControls 생성 및 설정
  const controls = new OrbitControls(camera, renderer.domElement);

  // 텍스처 로더 생성
  const textureLoader = new THREE.TextureLoader();

  // 태양 생성
  const sunTexture = textureLoader.load('./textures/sun.png');
  const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  // 지구 생성
  const earthTexture = textureLoader.load('./textures/earth.jpg');
  const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
  const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earth.position.x = 10; // 태양으로부터 10 단위 거리
  scene.add(earth);

  // 달 생성
  const moonTexture = textureLoader.load('./textures/moon.jpg');
  const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.x = 2; // 지구로부터 2 단위 거리
  earth.add(moon); // 달을 지구에 추가

  // 마우스 이벤트 리스너 등록
  document.addEventListener('mousemove', onDocumentMouseMove, false);

  // 애니메이션 함수
  function animate() {
    requestAnimationFrame(animate);

    // 태양 중심으로 지구 회전
    earth.position.x = 10 * Math.cos(Date.now() * 0.001);
    earth.position.z = 10 * Math.sin(Date.now() * 0.001);

    // 지구 중심으로 달 회전
    moon.position.x = 2 * Math.cos(Date.now() * 0.01);
    moon.position.z = 2 * Math.sin(Date.now() * 0.01);

    controls.update(); // OrbitControls 업데이트

    renderer.render(scene, camera);
  }

  animate();

  // 마우스 이동 이벤트 핸들러
  function onDocumentMouseMove(event) {
    event.preventDefault();

    // 마우스 위치를 정규화된 장치 좌표(NDC)로 변환
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // 카메라와 객체들을 회전시키는 로직 추가
    const rotationSpeed = 0.1;
    camera.rotation.y = mouseX * rotationSpeed;
    camera.rotation.x = mouseY * rotationSpeed;
  }
}
