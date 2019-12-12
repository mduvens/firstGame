Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';
var red = 0xFF0000
var green = 0x00FF00
var blue = 0x0000FF
let
    z = 0,
    s = 0,
    actual = 0,
    frame = 0,
    balasZ = [],
    distance,
    collisions, direcoesB = [],
    direcoesZ = [],
    direcao = new THREE.Vector3();
pontos = 0;
var controls
var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var scene = new Physijs.Scene();
//scene.setGravity(new THREE.Vector3(0, -200, 0))
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 20000);

var clock = new THREE.Clock({
    autoStart: true
});
var balasJ = [];
var velocityJ = new THREE.Vector3(0, 0, 0)

var listener = new THREE.AudioListener();
camera.add(listener)

var sound1 = new THREE.Audio(listener)

var audioLoader1 = new THREE.AudioLoader();


const light = new THREE.AmbientLight(0xFFFFFF, 1);

var backG = [
    'textures/bkg1_right.png', 'textures/bkg1_left.png',
    'textures/bkg1_top.png', 'textures/bkg1_bot.png',
    'textures/bkg1_front.png', 'textures/bkg1_back.png'

]
let bLoader = new THREE.CubeTextureLoader();
scene.background = bLoader.load(backG);

var floorM = Physijs.createMaterial(new THREE.MeshLambertMaterial({
    color: 0xba02ba,
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load('textures/lava.jpg')
}))
var floorG = new THREE.PlaneGeometry(8000, 8000);
var floor = new Physijs.BoxMesh(floorG, floorM);
floor.rotation.x = Math.PI / 2
floor.name = 'chao'

var materialLimite = Physijs.createMaterial(new THREE.MeshLambertMaterial({
    color: 0x692169,
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load('textures/lava.jpg')
}))
var geometriaLimite = new THREE.PlaneGeometry(8000, 1000);
var paredesLimite = []
for (let j = 0; j < 4; j += 1) {
    var paredeL = new Physijs.BoxMesh(geometriaLimite, materialLimite);
    paredesLimite.push(paredeL)
}
paredesLimite[0].position.set(1000, 100, 0)
paredesLimite[0].rotation.y += Math.PI / 2
paredesLimite[1].position.set(-1000, 100, 0)
paredesLimite[1].rotation.y += Math.PI / 2
paredesLimite[2].position.set(0, 100, 4000)
paredesLimite[3].position.set(0, 100, -4000)

materialInterior = Physijs.createMaterial(new THREE.MeshBasicMaterial({
    color: 0x808080,
    side: THREE.DoubleSide
}))
geometriaInterior = new THREE.PlaneGeometry(7000, 1000)

function ajustarJanela() {
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })
}
// funcao comida
comida = function () {
    this.geometria = new THREE.OctahedronGeometry(30)
    this.material = new THREE.MeshLambertMaterial({
        color: 0xD0D0D0,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('textures/gold.jpg')
    })
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 0);
    this.mesh.alive = true
    this.mesh.name = "comida"
}
// funcao jogador
function jogador() {
    this.geometria = new THREE.SphereGeometry(30, 32, 32);
    this.material = Physijs.createMaterial(new THREE.MeshBasicMaterial())
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 999)
    this.mesh.vida = 100
    this.mesh.alive = true
}

let jogador1 = new jogador();

// colisão jogador
jogador1.mesh.addEventListener('collision', function (obj, linearV, angularV) {
    if (obj.name == 'inimigo') {
         if (jogador1.mesh.vida > 50) {
         audioLoader1.load('sounds/hitSimples.mp3', function (buffer) {
             sound1.setBuffer(buffer);
             //sound.setLoop(true);
             sound1.setVolume(0.9);
             sound1.play();
         })
     }
        if (jogador1.mesh.vida > 0) {
            
            jogador1.mesh.vida -= 100;
            console.log(jogador1.mesh.vida)
        }
    }
    if (obj.name == 'comida') {
        audioLoader1.load('sounds/coin.wav', function (buffer) {
            sound1.setBuffer(buffer);
            //sound.setLoop(true);
            sound1.setVolume(0.9);
            sound1.play();
        })
        obj.alive = false;
        scene.remove(obj)
        pontos++;

    }
    //console.log(jogador1.mesh.vida)
})

var controls = new THREE.PointerLockControls(camera, renderer.domElement);
let car
// LOADERS
// var loader = new THREE.GLTFLoader();
// loader.load(
// 	// resource URL
// 	'untitled.glb',
// 	// called when the resource is loaded
// 	function ( gltf ) {
// 		scene.add( gltf.scene);
//         gltf.scene.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {
//             console.log(obj)
//         })
// 		// gltf.animations; // Array<THREE.AnimationClip>
// 		// gltf.scene; // THREE.Scene
// 		// gltf.scenes; // Array<THREE.Scene>
// 		// gltf.cameras; // Array<THREE.Camera>
//         // gltf.asset; // Object
//       gltf.scene.position.set(0,300,0)
//         gltf.scene.scale.set(50,50,50)
//        console.log(gltf.scene.position)
//     },

// called while loading is progressing
// function ( xhr ) {

// 	console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// },
// // called when loading has errors
// function ( error ) {

// 	console.log( 'An error happened' );

// }
// );

var numeroComida = 3,
    comidas = [];

// funcao adicionar comida
function addComida() {

    for (let m = 0; m < numeroComida; m += 1) {
        comidas[m] = new comida();
        comidas[m].mesh.position.set((Math.random() - 0.5) * 3800 - 1000, 70, (Math.random() - 0.5) * 3800 - 1000)
        scene.add(comidas[m].mesh)
    }
}

function tirarVidaBalaJogador(objeto) {
    objeto.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {
        if (objCollidedWith.name == 'inimigo' ) {
            if (objCollidedWith.alive == true) {
                if (objCollidedWith.vida > 0) {
                    objCollidedWith.vida -= 20
                    if (objCollidedWith.vida == 0) {
                        objCollidedWith.alive = false
                        scene.remove(objCollidedWith)
                    }
                }
            }
        }
    }) //****/

}
// funcao disparo jogador extra
let r = 0;
document.addEventListener('click', function () {

    // console.log(balasJ.length)
    // console.log('R ', r)
})

movimentoBalaJogador = function(objeto) {
    direcao = controls.getDirection(new THREE.Vector3(0, 0, 0))
    objeto.setLinearFactor(new THREE.Vector3(0, 0, 0))
    objeto.setLinearVelocity(new THREE.Vector3(direcao.x * 18000, direcao.y * 18000, direcao.z * 18000))

}

fixarMovimento = function(obj) { // aka 'MOTION CLAMPING'
    obj.setCcdMotionThreshold(1);
    obj.setCcdSweptSphereRadius(0.2);
}

//************************************************************************************** */


var moveFrente = false,
    moveTras = false,
    moveDir = false,
    moveEsq = false,
    moveCima = false,
    moveBaixo = false






let i = 0;
onKeyDown = function (e) {
    switch (e.keyCode) {
        case 81:
            limparVelocidades()
            controls.lock()
            break;
        case 69:
            limparVelocidades()
            controls.unlock()
            break;
        case 38:
        case 87:
            moveFrente = true
            break;
        case 37:
        case 65:
            moveEsq = true
            break;
        case 40:
        case 83:
            moveTras = true
            break;
        case 39:
        case 68:
            moveDir = true
            break;
        case 32:
            moveCima = true
            break;
        case 16:
            moveBaixo = true
            break;
    }
}
onKeyUp = function (e) {
    switch (e.keyCode) {
        case 38:
        case 87:
            moveFrente = false
            break;
        case 37:
        case 65:
            moveEsq = false
            break;
        case 40:
        case 83:
            moveTras = false
            break;
        case 39:
        case 68:
            moveDir = false
            break;
        case 32:
            moveCima = false
            break;
        case 16:
            moveBaixo = false
            break;


    }
}


let
    loop = false


document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);



obterDirecao = function(fonte, destino) {
    direcao = new THREE.Vector3(destino.position.x - fonte.position.x, destino.position.y - fonte.position.y, destino.position.z - fonte.position.z);
    return direcao;
}
// funcao bala inimiga
balaInimiga = function() {
    this.mesh = new Physijs.BoxMesh(new THREE.SphereGeometry(30, 32, 32), Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: green,
        map: new THREE.TextureLoader().load('textures/neonSplash.jpg')
    })))
    this.mesh.name = 'inimigo'
    this.mesh.alive = false;
    this.mesh.vida = 100;
}


cont = 0,

limitarMovJogador = function () {
    if (camera.position.x > -3000 && camera.position.z == 2010) {
        controls.getObject().position.z = 2011
    }
    if (camera.position.x < 950 && camera.position.x > -950 && camera.position.z < 3950 /*&& camera.position.z > 3500*/ && camera.position.y > 50 && camera.position.y < 500 && controls.isLocked ) {
        if (moveFrente) velocityJ.z += 10000 * delta;
        if (moveTras) velocityJ.z -= 10000 * delta;
        if (moveDir) velocityJ.x += 10000 * delta;
        if (moveEsq) velocityJ.x -= 10000 * delta;
        if (moveCima) controls.getObject().position.y += 500 * delta;
        if (moveBaixo) controls.getObject().position.y -= 500 * delta;

    }
    if (camera.position.x >= 950) {
        camera.position.x = 949.9
    }
    if (camera.position.x <= -950) {
        camera.position.x = -949.9
    }
    if (camera.position.z >= 3950) {
        camera.position.z = 3949.9
    }
    // if (camera.position.z <= 3500) {
    //     camera.position.z = 3501
    // }
     if (camera.position.y <= 50) {
         camera.position.y = 50.00001
     }
     if (camera.position.y >= 500) {
        camera.position.y = 499.9
    }
    


}
camera.position.set(0, 100, 3900)
init = function() {
    
    scene.add(camera)
    scene.add(light)
    scene.add(jogador1.mesh)
    scene.add(floor)
    addComida()
    scene.add(controls.getObject());
    for (i = 0; i < paredesLimite.length; i += 1) {
        if(i!=3){
            scene.add(paredesLimite[i])

        }
    }  
    renderer.render(scene, camera)

}
let offset = 0.01
let balasInimigas = []

let  e = 0, j = 0;

//balas inimigas
addBalaInimiga = function(){
    balasInimigas[e] = new balaInimiga();  
    balasInimigas[e].mesh.position.set(950, Math.floor((Math.random() * 200) + 50), Math.floor((Math.random() * 4000) - 500)) 
    scene.add(balasInimigas[e].mesh)  
    balasInimigas[e].mesh.alive = true;
    balasInimigas[e].mesh.__dirtyPosition = true;
    balasInimigas[e].mesh.setLinearFactor(new THREE.Vector3(0,0,0));
    balasInimigas[e].mesh.setLinearVelocity(new THREE.Vector3(-500,0,0))  
}
limparVelocidades = function(){
    velocityJ.x = 0
    velocityJ.y = 0
    velocityJ.z  = 0
    delta = 0
   moveDir = false, moveEsq = false, moveFrente = false, moveTras = false, moveCima = false,moveBaixo = false;
}

function animate() {
    
    //controls.update();
    //camera.lookAt(cube)
    if (controls.isLocked == true) {
       
        for (let m = 0; m < numeroComida; m += 1) {
            comidas[m].mesh.__dirtyRotation = true;
            comidas[m].mesh.rotation.z += offset
            comidas[m].mesh.rotation.x += offset
        }
        jogador1.mesh.position.set(camera.position.x, camera.position.y, camera.position.z)
        jogador1.mesh.__dirtyPosition = true
        frame += 1;
        for (let m = 0; m < numeroComida; m += 1) {
            if (comidas[m].mesh.alive) {
                comidas[m].mesh.setLinearFactor(new THREE.Vector3(0, 0, 0))
            }
        }
        // disparo jogador automatico
        if (frame %  20 == 0){
            bala = new Physijs.BoxMesh(new THREE.SphereGeometry(1, 32, 32), Physijs.createMaterial(new THREE.MeshStandardMaterial({
                color: 0xffffff
            })))
            bala.position.set(camera.position.x, camera.position.y, camera.position.z)
        
            if (balasJ.length < 10 && r !== 10) {
                balasJ[r] = bala;
                scene.add(balasJ[r])
                balasJ[r].addEventListener('collision', function (obj, linearV, angularV) {
                    console.log(obj.vida)
        
                });
                movimentoBalaJogador(balasJ[r])
                fixarMovimento(balasJ[r])
                tirarVidaBalaJogador(balasJ[r])
                r += 1
            } else {
                if (r < 9) {
                    scene.remove(balasJ[r + 1])
                }
                balasJ[r] = bala;
                scene.add(balasJ[r])
                balasJ[r].addEventListener('collision', function (obj, linearV, angularV) {
                    console.log(obj.vida)
                });
                movimentoBalaJogador(balasJ[r])
                tirarVidaBalaJogador(balasJ[r])
                fixarMovimento(balasJ[r])
                r += 1
            }
            
            if (r == 10) {
                r = 0
                scene.remove(balasJ[r])
            }
        
        }
        if(frame % 10 == 0){    
            addBalaInimiga()
            if(balasInimigas.length ==  30 && e<29){
                if( balasInimigas[e+1].mesh.alive) {
                    scene.remove(balasInimigas[e+1].mesh)
                }
            }
            e += 1
            if (e == 30) {
                e = 0
                if( balasInimigas[e].mesh.alive) {
                scene.remove(balasInimigas[e].mesh)
                }
            }
            console.log('E ',e)
            console.log(jogador1.mesh.position)
        }
        delta = clock.getDelta()

        //console.log(delta)
        limitarMovJogador();
        velocityJ.x -= velocityJ.x * 10.0 * delta;
        velocityJ.z -= velocityJ.z * 10.0 * delta;

        // Movimento Jogador

        controls.moveRight(velocityJ.x * delta);
        controls.moveForward(velocityJ.z * delta);


        if (jogador1.mesh.vida == 0) {         
            alert("GAME OVER");
            limparVelocidades();
            camera.position.set(0, 50, 3900)
            jogador1.mesh.vida = 100;
        }

    }
    scene.simulate();
    ajustarJanela();
    renderer.render(scene, camera)
    requestAnimationFrame(animate);

}
init()
animate()