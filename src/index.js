import * as THREE from 'three'
import { WEBGL } from './webgl'
import './modal'
import { GLTFLoader } from '../GLTFLoader'
import { Star } from './star'
import { Rock } from './rock'
import { MoveEnemy } from './moveEnemy'
import { Missile } from './missile'
import { AttackMissile } from './attackMissile'
import { Plane } from './plane'

var starData, rockData, moveEnemyData, missileData, attackMissileData, starNum = 0, rockNum = 0, updScene = 0, starMaxRow = 4, rockMaxRow = 4;
var starMinNum = 0, rockMinNum = 0, moveEnemyNum = 0, moveEnemyMinNum = 0, missileMinNum = 0, attackMissileMinNum = 0;
var stars = [], rocks = [], moveEnemies = [], missiles = [], attackMissiles = [], plane = '', launchDelay = 0;
var score = 0, health = 150, text2 = "", cube11 = "", alreadyMoveL = 0, alreadyMoveR = 0, text3 = "", gameOver = 0, text4 = "", fstTime = 0;

if (WEBGL.isWebGLAvailable()) {
  var camera, scene, renderer
  var mouse,
    raycaster,
    isShiftDown = false

  var rollOverMesh, rollOverMaterial
  var cubeGeo, cubeMaterial

  var objects = []


  init()
  render()

  function init() {
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
    camera.position.set(0, -18, 10)
    camera.lookAt(0, -13, 0)

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xb2bcdb)

    var rollOverGeo = new THREE.BoxGeometry(50, 50, 50)
    rollOverMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.5,
      transparent: true,
    })
    rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial)
    scene.add(rollOverMesh)

    cubeGeo = new THREE.BoxBufferGeometry(50, 50, 50)
    cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xfeb74c,
      map: new THREE.TextureLoader().load('static/textures/square.png'),
    })


    text2 = document.createElement('div');
    text2.style.position = 'absolute';
    text2.style.width = 100;
    text2.style.height = 100;
    text2.innerHTML = "Score : " + score;
    text2.style.top = 4 + 'px';
    text2.style.left = 1100 + 'px';
    document.body.appendChild(text2);

    text3 = document.createElement('div');
    text3.style.position = 'absolute';
    text3.style.width = 100;
    text3.style.height = 100;
    text3.innerHTML = "Health : " + health;
    text3.style.top = 25 + 'px';
    text3.style.left = 1100 + 'px';
    document.body.appendChild(text3);

    text4 = document.createElement('div');
    text4.style.position = 'absolute';
    text4.style.width = 100;
    text4.style.height = 100;
    text4.innerHTML = "Game Over !";
    text4.style.top = 330 + 'px';
    text4.style.left = 600 + 'px';


    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()

    var geometry = new THREE.PlaneBufferGeometry(13000, 9000)
    // geometry.rotateX(-Math.PI / 2)
    const material = new THREE.MeshBasicMaterial({ color: 0x90ee90, side: THREE.DoubleSide });
    const basePlane = new THREE.Mesh(geometry, material);
    scene.add(basePlane);
    basePlane.position.z -= 6000;
    basePlane.position.y -= 1000;
    basePlane.receiveShadow = true;

    var ambientLight = new THREE.AmbientLight(0x606060)
    scene.add(ambientLight)
    scene.fog = new THREE.Fog(0x4c545f, 1, 10000)
    var directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(0, 0, 1).normalize()
    scene.add(directionalLight)

    for (let i = 0; i < 25; i++) {
      var geometry13 = new THREE.BoxGeometry(200, 200, 300);
      var material13 = new THREE.MeshBasicMaterial({ color: 0x380d08 });
      if (Math.random() > 0.5) {
        var material13 = new THREE.MeshBasicMaterial({ color: 0xa60d64 });
      }
      var cube = new THREE.Mesh(geometry13, material13);
      scene.add(cube);
      cube.position.z -= 6000;
      cube.position.y += 3000 * Math.random();
      cube.position.x -= 10000 * Math.random();
    }
    for (let i = 0; i < 25; i++) {
      var geometry13 = new THREE.BoxGeometry(200, 200, 500);
      var material13 = new THREE.MeshBasicMaterial({ color: 0xa60d64 });
      if (Math.random() > 0.5) {
        var material13 = new THREE.MeshBasicMaterial({ color: 0x380d08 });
      }
      var cube = new THREE.Mesh(geometry13, material13);
      scene.add(cube);
      cube.position.z -= 6000;
      cube.position.y += 3000 * Math.random();
      cube.position.x += 10000 * Math.random();
    }


    var loader = new GLTFLoader();
    loader.load('../plane.glb', handle_load);



    function handle_load(gltf) {
      console.log(gltf);
      var planeData = gltf.scene;
      plane = new Plane(planeData, 0, -10, -20)
      // console.log(plane.planeData);

      scene.add(plane.planeData);
    }


    loader.load('../star.glb', handle_load2);

    function handle_load2(gltf) {
      // console.log(gltf);
      starData = gltf.scene;
      // console.log(starData);
      for (let i = 0; i < 1000; i++) {
        for (let j = 0; j < 5; j++) {
          if (Math.random() <= 0.6) {
            var cpVal = starData.clone();
            stars.push(new Star(cpVal, -20 + 10 * j, 3 + 30 * i, -20));
          }
        }
      }
      for (let i = 0; i < stars.length; i++) {
        if (stars[i].rowNum < starMaxRow) {
          scene.add(stars[i].starData);
          starNum += 1;
        }
        else {
          break;
        }
      }
    }

    loader.load('../rock.glb', handle_load3);

    function handle_load3(gltf) {
      // console.log(gltf);
      rockData = gltf.scene;
      // console.log(starData);
      for (let i = 0; i < 1000; i++) {
        for (let j = 0; j < 5; j++) {
          if (Math.random() <= 0.6) {
            var cpVal = rockData.clone();
            rocks.push(new Rock(cpVal, -20 + 10 * j, 13 + 30 * i, -20));
          }
        }
      }
      for (let i = 0; i < rocks.length; i++) {
        if (rocks[i].rowNum < rockMaxRow) {
          scene.add(rocks[i].rockData);
          rockNum += 1;
        }
        else {
          break;
        }
      }
    }

    loader.load('../moveEnemy.glb', handle_load4);

    function handle_load4(gltf) {
      // console.log(gltf);
      moveEnemyData = gltf.scene;
      // console.log(starData);
      for (let i = 0; i < 1000; i++) {
        var cpVal = moveEnemyData.clone();
        if (Math.random() < 0.5) {
          moveEnemies.push(new MoveEnemy(cpVal, -20, 23 + 30 * i, -20, 1));//last 1 represents move right
        }
        else {
          moveEnemies.push(new MoveEnemy(cpVal, 20, 23 + 30 * i, -20, 0));
        }
      }
      scene.add(moveEnemies[moveEnemyNum].moveEnemyData);
      moveEnemyNum += 1;
    }

    loader.load('../missile.glb', handle_load5);

    function handle_load5(gltf) {
      missileData = gltf.scene;
    }

    loader.load('../attackMissile.glb', handle_load6);

    function handle_load6(gltf) {
      attackMissileData = gltf.scene;
    }



    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // document.addEventListener('mousemove', onDocumentMouseMove, false)
    // document.addEventListener('mousedown', onDocumentMouseDown, false)
    document.addEventListener('keydown', onDocumentKeyDown, false)
    // document.addEventListener('keyup', onDocumentKeyUp, false)
    window.addEventListener('resize', onWindowResize, false)
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function onDocumentMouseMove(event) {
    event.preventDefault()

    mouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    )

    raycaster.setFromCamera(mouse, camera)

    var intersects = raycaster.intersectObjects(objects)

    if (intersects.length > 0) {
      var intersect = intersects[0]

      rollOverMesh.position.copy(intersect.point).add(intersect.face.normal)
      rollOverMesh.position
        .divideScalar(50)
        .floor()
        .multiplyScalar(50)
        .addScalar(25)
    }
  }

  var setv = 1;
  function moveLeft() {
    plane.setPosX(-0.3);
  }
  function moveRight() {
    plane.setPosX(0.3);
  }
  function moveUp() {
    if (plane.planeData.position.y - camera.position.y <= 30) {
      plane.setPosY(0.3);
    }
  }
  function moveDown() {
    if (plane.planeData.position.y - camera.position.y >= 5) {
      plane.setPosY(-0.3);
    }
  }
  function launchMissile() {
    var cpVal = missileData.clone();
    var target = new THREE.Vector3();
    plane.planeData.children[3].getWorldPosition(target);
    var target2 = new THREE.Vector3();
    plane.planeData.children[4].getWorldPosition(target2);
    missiles.push(new Missile(cpVal, target.x, target.y, target.z));
    scene.add(missiles[missiles.length - 1].missileData);
    var cpVal2 = missileData.clone();
    missiles.push(new Missile(cpVal2, target2.x, target2.y, target2.z));
    scene.add(missiles[missiles.length - 1].missileData);
  }

  function launchAttackMissile(idx) {
    var cpVal = attackMissileData.clone();
    var target = new THREE.Vector3();
    moveEnemies[idx].moveEnemyData.children[5].getWorldPosition(target);
    var target2 = new THREE.Vector3();
    moveEnemies[idx].moveEnemyData.children[4].getWorldPosition(target2);
    var target3 = new THREE.Vector3();
    plane.planeData.children[3].getWorldPosition(target3);
    var target4 = new THREE.Vector3();
    plane.planeData.children[4].getWorldPosition(target4);
    attackMissiles.push(new AttackMissile(cpVal, target.x, target.y, target.z, target3.x, target3.y));
    scene.add(attackMissiles[attackMissiles.length - 1].attackMissileData);
    var cpVal2 = attackMissileData.clone();
    attackMissiles.push(new AttackMissile(cpVal2, target2.x, target2.y, target2.z, target4.x, target4.y));
    scene.add(attackMissiles[attackMissiles.length - 1].attackMissileData);
  }

  function detectCollision(object1, object2) {

    object1.updateMatrixWorld();
    object2.updateMatrixWorld();
    var box1 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    box1.setFromObject(object1);
    var box2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    box2.setFromObject(object2);
    return box1.intersectsBox(box2);
  }

  const moveKeys = { LEFT: 65, UP: 87, RIGHT: 68, DOWN: 83, SHOOT: 32 };

  function onDocumentKeyDown(event) {
    var upd = 0;
    switch (event.keyCode) {
      case 65://A
        if (alreadyMoveL == 1 || alreadyMoveR == 1) {
          break;
        }
        if (plane.planeData.position.x < -19) {
          break;
        }
        // moveLeft()
        var kk = plane.planeData.position.x;
        if (kk < -9) {
          plane.toMoveX = -20;
          plane.toMoveXMid = -15;
          plane.toMoveDir = 1;
        }
        else if (kk < 1) {
          plane.toMoveDir = 1;
          plane.toMoveX = -10;
          plane.toMoveXMid = -5;
        }
        else if (kk < 11) {
          plane.toMoveDir = 1;
          plane.toMoveX = 0;
          plane.toMoveXMid = 5;
        }
        else if (kk < 21) {
          plane.toMoveDir = 1;
          plane.toMoveX = 10;
          plane.toMoveXMid = 15;
        }
        alreadyMoveL = 1;
        break;
      case 68://D
        if (alreadyMoveL == 1 || alreadyMoveR == 1) {
          break;
        }
        if (plane.planeData.position.x > 19) {
          break;
        }
        var kk = plane.planeData.position.x;
        if (kk < -19) {
          plane.toMoveX = -10;
          plane.toMoveDir = 2;
          plane.toMoveXMid = -15;
        }
        else if (kk < -9) {
          plane.toMoveX = 0;
          plane.toMoveDir = 2;
          plane.toMoveXMid = -5;
        }
        else if (kk < 1) {
          plane.toMoveX = 10;
          plane.toMoveDir = 2;
          plane.toMoveXMid = 5;
        }
        else if (kk < 11) {
          plane.toMoveX = 20;
          plane.toMoveDir = 2;
          plane.toMoveXMid = 15;
        }
        alreadyMoveR = 1;
        break;
      case moveKeys.UP://W
        moveUp()
        break;
      case moveKeys.DOWN://S
        moveDown()
        break;
      case moveKeys.SHOOT:///space
        launchMissile()
        break;
    }
  }


  function render() {
    if (gameOver == 1) {
      if (fstTime == 0) {
        document.body.appendChild(text4);
        fstTime = 1;
      }
      return;
    }
    if (updScene >= 30) {
      console.log(scene.children.length);
      updScene = 0;
      var kk = starNum;
      starMaxRow += 1;

      for (let i = kk; i < stars.length; i++) {
        if (stars[i].rowNum < starMaxRow) {
          scene.add(stars[i].starData);
          starNum += 1;
        }
        else {
          break;
        }
      }
      var kk2 = rockNum;
      rockMaxRow += 1;
      for (let i = kk2; i < rocks.length; i++) {
        if (rocks[i].rowNum < rockMaxRow) {
          scene.add(rocks[i].rockData);
          rockNum += 1;
        }
        else {
          break;
        }
      }

      scene.add(moveEnemies[moveEnemyNum].moveEnemyData);
      moveEnemyNum += 1;

    }


    //remove from scene
    var kk = starMinNum;
    if (plane != "") {
      for (let i = kk; i < stars.length; i++) {
        if (stars[i].starData.position.y < plane.planeData.position.y - 40) {
          scene.remove(stars[i].starData);
          starMinNum += 1;
          stars[i].inFrame = 0;
        }
        else {
          break;
        }
      }

      var kk2 = rockMinNum;
      for (let i = kk2; i < rocks.length; i++) {
        if (rocks[i].rockData.position.y < plane.planeData.position.y - 40) {
          scene.remove(rocks[i].rockData);
          rockMinNum += 1;
          rocks[i].inFrame = 0;
        }
        else {
          break;
        }
      }

      var kk3 = moveEnemyMinNum;
      for (let i = kk3; i < moveEnemies.length; i++) {
        if (moveEnemies[i].moveEnemyData.position.y < plane.planeData.position.y - 40) {
          scene.remove(moveEnemies[i].moveEnemyData);
          moveEnemyMinNum += 1;
          moveEnemies[i].inFrame = 0;
        }
        else {
          break;
        }
      }

      kk3 = missileMinNum;
      for (let i = kk3; i < missiles.length; i++) {
        if (missiles[i].missileData.position.y > plane.planeData.position.y + 40) {
          scene.remove(missiles[i].missileData);
          missileMinNum += 1;
          missiles[i].inFrame = 0;
        }
      }

      kk3 = attackMissileMinNum;
      for (let i = kk3; i < attackMissiles.length; i++) {
        if (attackMissiles[i].attackMissileData.position.y < plane.planeData.position.y - 40) {
          scene.remove(attackMissiles[i].attackMissileData);
          attackMissileMinNum += 1;
          attackMissiles[i].inFrame = 0;
        }
        else {
          break;
        }
      }
    }

    //--removed

    for (let i = starMinNum; i < stars.length; i++) {
      if (stars[i].rowNum < starMaxRow)
        stars[i].setRotation()
      else
        break;
    }
    for (let i = rockMinNum; i < rocks.length; i++) {
      if (rocks[i].rowNum < rockMaxRow)
        rocks[i].setRotation()
      else {
        break
      }
    }
    for (let i = missileMinNum; i < missiles.length; i++)
      missiles[i].move()

    for (let i = attackMissileMinNum; i < attackMissiles.length; i++) {
      attackMissiles[i].move();
    }
    for (let i = Math.max(0, moveEnemyNum - 2); i < moveEnemyNum; i++) {
      moveEnemies[i].normalMove()
    }
    launchDelay += 1;
    if (launchDelay == 110) {
      if (plane != "" && moveEnemies[moveEnemyNum - 1].moveEnemyData.position.y > plane.planeData.position.y + 10 && moveEnemies[moveEnemyNum - 1].inFrame == 1) {
        launchAttackMissile(moveEnemyNum - 1);
      }
      launchDelay = 0;
    }


    if (plane != '') {
      if (alreadyMoveL == 1) {
        var retv = plane.moveL()
        if (retv == 1) {
          alreadyMoveL = 0;
          plane.toMoveDir = 0;
        }
      }
      else if (alreadyMoveR == 1) {
        var retv = plane.moveR()
        if (retv == 1) {
          alreadyMoveR = 0;
          plane.toMoveDir = 0;

        }
      }
    }
    camera.position.y += 0.1;
    updScene += 0.1
    if (plane != '')
      plane.normalMove()

    var aa = false;
    var bb = false;
    if (plane != '') {
      for (let i = Math.max(0, moveEnemyNum - 2); i < moveEnemyNum; i++) {
        if (moveEnemies[i].inFrame == 1) {
          aa = false;
          aa = detectCollision(plane.planeData, moveEnemies[i].moveEnemyData)
          if (aa == true) {
            health -= 20;
            scene.remove(moveEnemies[i].moveEnemyData);
            moveEnemies[i].inFrame = 0;
          }
        }
      }

      for (let i = starMinNum; i < stars.length; i++) {
        if (stars[i].rowNum < starMaxRow) {
          if (stars[i].inFrame == 1) {
            aa = false;
            aa = detectCollision(plane.planeData, stars[i].starData)
            if (aa == true) {
              score += 30;
              scene.remove(stars[i].starData);
              stars[i].inFrame = 0;
            }
          }
        }
        else
          break;
      }

      for (let i = rockMinNum; i < rocks.length; i++) {
        if (rocks[i].rowNum < rockMaxRow) {
          if (rocks[i].inFrame == 1) {
            aa = false;
            aa = detectCollision(plane.planeData, rocks[i].rockData)
            if (aa == true) {
              health -= 30;
              scene.remove(rocks[i].rockData);
              rocks[i].inFrame = 0;
            }
          }
        }
        else {
          break
        }
      }
      for (let j = missileMinNum; j < missiles.length; j += 2) {
        for (let i = rockMinNum; i < rocks.length; i++) {
          if (rocks[i].rowNum < rockMaxRow) {
            if (rocks[i].inFrame == 1 && missiles[j].inFrame == 1) {
              aa = false;
              aa = detectCollision(missiles[j].missileData, rocks[i].rockData)
              bb = false;
              bb = detectCollision(missiles[j + 1].missileData, rocks[i].rockData)
              if (aa == true || bb == true) {
                score += 20;
                scene.remove(rocks[i].rockData);
                scene.remove(missiles[j].missileData);
                scene.remove(missiles[j + 1].missileData);
                rocks[i].inFrame = 0;
                missiles[j].inFrame = 0;
                missiles[j + 1].inFrame = 0;
              }
            }
          }
          else {
            break
          }
        }
        for (let i = Math.max(0, moveEnemyNum - 2); i < moveEnemyNum; i++) {
          if (moveEnemies[i].inFrame == 1 && missiles[j].inFrame == 1) {
            aa = false;
            aa = detectCollision(missiles[j].missileData, moveEnemies[i].moveEnemyData)
            bb = false;
            bb = detectCollision(missiles[j + 1].missileData, moveEnemies[i].moveEnemyData)
            if (aa == true || bb == true) {
              score += 50;
              scene.remove(moveEnemies[i].moveEnemyData);
              scene.remove(missiles[j].missileData);
              scene.remove(missiles[j + 1].missileData);
              moveEnemies[i].inFrame = 0;
              missiles[j].inFrame = 0;
              missiles[j + 1].inFrame = 0;
            }
          }
        }
      }

      for (let j = attackMissileMinNum; j < attackMissiles.length; j += 2) {
        if (plane != "") {
          if (attackMissiles[j].inFrame == 1) {
            aa = false;
            aa = detectCollision(attackMissiles[j].attackMissileData, plane.planeData)
            bb = false;
            bb = detectCollision(attackMissiles[j + 1].attackMissileData, plane.planeData)
            if (aa == true || bb == true) {
              health -= 10;
              scene.remove(attackMissiles[j].attackMissileData);
              scene.remove(attackMissiles[j + 1].attackMissileData);
              attackMissiles[j].inFrame = 0;
              attackMissiles[j + 1].inFrame = 0;
            }
          }
        }
      }

      if (text2 != "")
        text2.innerHTML = "Score : " + score;
      if (text3 != "")
        if (health <= 0) {
          text3.innerHTML = "Health : " + "0";
          gameOver = 1;
        }
        else { text3.innerHTML = "Health : " + health; }
    }

    renderer.render(scene, camera)
    requestAnimationFrame(render);
  }
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}



