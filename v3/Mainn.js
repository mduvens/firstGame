Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var posBig = new THREE.Vector3(-3900, 100, 3000)
//world
var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var scene = new Physijs.Scene();
scene.setGravity(new THREE.Vector3(0, -1110, 0))
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 20000);
var clock = new THREE.Clock({
    autoStart: true
});
controls = new THREE.PointerLockControls(camera, renderer.domElement)

//************************************************************* */
// VARIÁVEIS
var
    red = 0xFF0000,
    green = 0x00FF00,
    blue = 0x0000FF,
    listener = new THREE.AudioListener(),
    sound = new THREE.PositionalAudio(listener),
    sound1 = new THREE.Audio(listener),
    audioLoader = new THREE.AudioLoader(),
    audioLoader1 = new THREE.AudioLoader(),
    light = new THREE.AmbientLight(0xFFFFFF, 1),
    plight = new THREE.PointLight(0xffffff, 2, 300),
    
    backG = [
        'textures/bkg1_right.png', 'textures/bkg1_left.png',
        'textures/bkg1_top.png', 'textures/bkg1_bot.png',
        'textures/bkg1_front.png', 'textures/bkg1_back.png'
    ],
    bLoader = new THREE.CubeTextureLoader(),
    geometry1 = new THREE.BoxGeometry(.001, 5, .001),
    geometry2 = new THREE.BoxGeometry(5, .001, .001),
    material1 = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true
    }),
    mira1 = new THREE.Mesh(geometry1, material1),
    mira2 = new THREE.Mesh(geometry2, material1),
    chaoM = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        color: 0x505050,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('textures/floorT.png')
    })),
    chaoG = new THREE.PlaneGeometry(8000, 8000),
    chao = new Physijs.BoxMesh(chaoG, chaoM),
    tetoM = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        color: 0x505050,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('textures/madeira.jpg')
    })),
    teto = new Physijs.BoxMesh(chaoG, tetoM),
    materialLimite = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        color: 0x808080,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('textures/woodS.jpg')
    })),
    geometriaLimite = new THREE.PlaneGeometry(8000, 1000),
    paredesLimite = [],
    materialInterior = Physijs.createMaterial(new THREE.MeshBasicMaterial({
        color: 0x303030,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('textures/blue.png')
    })),
    geometriaInterior = new THREE.BoxGeometry(7000, 500, 50),
    textureDanger = new THREE.TextureLoader().load('textures/dangerZ.jpg'),
    gemetriaMeshZona = new THREE.BoxGeometry(30, 200, 200),
    materialMeshZona = new THREE.MeshBasicMaterial({
        color: green,
        map: textureDanger
    }),
    textureFire = new THREE.TextureLoader().load('textures/fire.jpg'),
    z = 0,
    s = 0,
    i = 0,
    r = 0,
    frame = 0,
    distance,
    distanciaJ,
    distanciaP,
    collisions,
    direcoesB = [],
    direcoesZ = [],
    direcao = new THREE.Vector3(),
    fimRonda = false,
    controls,
    zombiemeshes = [],
    deadZombies = 0,
    noObjeto = false,
    jogador1 = new jogador(),
    balasJ = [],
    velocityJ = new THREE.Vector3(0, 0, 0),
    moveFrente = false,
    moveTras = false,
    moveDir = false,
    moveEsq = false,
    moveCima = false,
    moveBaixo = false,
    podeSaltar = true,
    paredesInterior = [],
    bang = false,
    velBang = new THREE.Vector3(0, 0, 0),
    junto = false,
    model,
    loader = new THREE.GLTFLoader(),
    zombieASeguir = false,
    numeroZombies = 10,
    zombies = [],
    numeroComida = 1,
    rPressionado = false,
    cont = 0,
    offset = 0.05,
    add = false,
    sprint = false,
    velocidadeJogador,
    meshesZonas = [],
    loaded = false,
    ronda = 1

for (let j = 0; j < 4; j += 1) {
    meshZona = new THREE.Mesh(gemetriaMeshZona, materialMeshZona)
    meshesZonas.push(meshZona)
}
for (let j = 0; j < 4; j += 1) {
    var paredeL = new Physijs.BoxMesh(geometriaLimite, materialLimite);
    paredesLimite.push(paredeL)
}
for (let i = 0; i < 3; i += 1) {
    var paredeI = new Physijs.BoxMesh(geometriaInterior, materialInterior, 0)
    paredesInterior.push(paredeI)
}
meshesZonas[0].position.set(-3900, 100, 3000)
meshesZonas[1].position.set(3900, 100, 1000)
meshesZonas[2].position.set(-3900, 100, -1000)
meshesZonas[3].position.set(3900, 100, -3000)
paredesLimite[0].position.set(4000, 500, 0)
paredesLimite[0].rotation.y += Math.PI / 2
paredesLimite[1].position.set(-4000, 500, 0)
paredesLimite[1].rotation.y += Math.PI / 2
paredesLimite[2].position.set(0, 500, 4000)
paredesLimite[3].position.set(0, 500, -4000)
paredesInterior[0].position.set(500, 250, 2000)
paredesInterior[2].position.set(-500, 250, 0)
paredesInterior[1].position.set(500, 250, -2000)
mira1.position.z -= 500
mira2.position.z -= 500
chao.rotation.x = Math.PI / 2
chao.name = 'chao'
teto.position.set(0, 1000, 0)
teto.rotation.x += Math.PI / 2
//teto.rotation.z += Math.PI/2
plight.position.z -= 50

// colisão jogador
jogador1.mesh.addEventListener('collision', function (obj, vel, angularV) {
    if (obj.name === 'balaBig' || obj.name == 'zombie') {
        if (jogador1.mesh.vida > 0) {
            jogador1.mesh.vida -= 100;
            //console.log(obj)
        }
    }
    if (obj.name === 'comida') {
        obj.alive = false;
        scene.remove(obj)
        fimRonda = true
    }

})


loader.load('obj/scene.gltf', function (gltf) {
    model = gltf.scene
    model.scale.set(.15, .15, .15)
    model.position.z = -70
    model.position.y -= 20
    model.position.x += 40
    //  model.rotation.x -= Math.PI/2
    scene.add(model)
    loaded = true
    //renderer.render(scene,camera)
});

// EVENT LISTENERS
document.addEventListener('mousedown', function () {
    rPressionado = true
})
document.addEventListener('mouseup', function () {
    rPressionado = false
})
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);


// gun.mesh.rotation.z += Math.PI/2

let loadedInit = false
function init() {
    camera.position.set(3400, 100, 3200)
    camera.rotation.set(0,Math.PI/2,0)
    scene.add(camera)
    scene.background = bLoader.load(backG);
    camera.add(listener)
    camera.add(plight)
    scene.add(light)
    scene.add(jogador1.mesh)
    scene.add(chao)
    scene.add(mira1);
    scene.add(mira2);
    scene.add(teto)
    camera.add(mira1)
    camera.add(mira2)
    addZombies()
    addComida()
    scene.add(controls.getObject());
    for (i = 0; i < meshesZonas.length; i += 1) {
        scene.add(meshesZonas[i])
    }
    for (i = 0; i < paredesLimite.length; i += 1) {
        scene.add(paredesLimite[i])
    }
    for (i = 0; i < paredesInterior.length; i += 1) {
        scene.add(paredesInterior[i])
    }
    loadedInit = true
    renderer.render(scene, camera)

}
balasBig = []
let g = 0,
    dir, dir1q,
    naZona = true

function animate() {
    delta = clock.getDelta()
    jogador1.mesh.__dirtyPosition = true
    movimentoInimigos()
    limitarMovJogador();
    naZona = verificarZona()

    if (controls.isLocked === true) {
        if (add == false) {
            camera.add(model)
            add = true
        }
        
        disparoAutomatico()
        jogador1.mesh.position.set(camera.position.x, camera.position.y, camera.position.z)
        frame += 1;
        // Movimento Jogador
        velocityJ.x -= velocityJ.x * 10.0 * delta;
        velocityJ.z -= velocityJ.z * 10.0 * delta;
        velocityJ.y -= 9.8 * 500.0 * delta;
        controls.moveRight(velocityJ.x * delta);
        controls.moveForward(velocityJ.z * delta);
        controls.getObject().position.y += (velocityJ.y * delta); // new behavior
        if (controls.getObject().position.y < 150) {
            velocityJ.y = 0;
            controls.getObject().position.y = 150;
            podeSaltar = true;
        }
        if (jogador1.mesh.vida === 0) {
            alert("MORRESTE")
            limparMapa()
            pontos = 0
            deadZombies = 0
            addZombies()
            addComida()
            camera.position.set(3400, 100, 3200)
            jogador1.mesh.vida = 100;
            console.log(numeroZombies)
            camera.rotation.set(0,Math.PI/2,0)
    
        }
        if (frame % 60 === 0) {
            if (fimRonda) {
                fimRonda = false
                velocityJ.x = 0;
                velocityJ.z = 0;
                velocityJ.y = 0;
                limparMapa()
                alert("RONDA " + ronda + " COMPLETA");
                alert("PREPARA-TE. RONDA " + ++ronda);
                novaRonda()
                camera.position.set(3400, 100, 3200)
                camera.rotation.set(0,Math.PI/2,0)
            }
        }
        dispararBig()
    }
    ajustarJanela();
    scene.simulate();
    renderer.render(scene, camera)
    requestAnimationFrame(animate);

}
init()
if(loadedInit){
    animate()
}
