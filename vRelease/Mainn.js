Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

// HTML TEST

// const listaVidaHTML = document.querySelector("vida-jogador")

// let life = 100
// const listaVida = document.createElement("LI")
// const vidaJogador = document.createTextNode(life)
// listaVida.appendChild(vidaJogador)
// listaVidaHTML.appendChild(listaVida)


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

// SETAS (OTIMIZAR)
var setaRet = new setaRetangulo()
var setaTri = new setaTriangulo()

var setaRet2 = new setaRetangulo()
var setaTri2 = new setaTriangulo()

var setaRet3 = new setaRetangulo()
var setaTri3 = new setaTriangulo()


//************************************************************* */
// VARIÁVEIS
var
    red = 0xFF0000,
    green = 0x00FF00,
    blue = 0x0000FF,
    listener = new THREE.AudioListener(),
    audio = new THREE.Audio(listener),
    audioDisparoBig = new THREE.Audio(listener),
    audioDisparoJogador = new THREE.Audio(listener),
    audioLoader = new THREE.AudioLoader(),
    light = new THREE.AmbientLight(0xFFFFFF, 3),
    plight = new THREE.PointLight(0xffffff, 2, 300),
    //textures
    textureDanger = new THREE.TextureLoader().load('textures/dangerZ.jpg'),
    textureInimigo = new THREE.TextureLoader().load('textures/indice.jpg'),
    textureDangerChao = new THREE.TextureLoader().load('textures/hazardStripes.jpg'),
    textureFire = new THREE.TextureLoader().load('textures/fire.jpg'),
    goldTexture = new THREE.TextureLoader().load('textures/gold.jpg'),
    mira1G = new THREE.BoxGeometry(.001, 5, .001),
    mira2G = new THREE.BoxGeometry(5, .001, .001),
    mirasM = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true
    }),
    mira1 = new THREE.Mesh(mira1G, mirasM),
    mira2 = new THREE.Mesh(mira2G, mirasM),
    chaoM = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        color: 0x000000,
        side: THREE.DoubleSide
    })),
    chaoG = new THREE.PlaneGeometry(8000, 8000),
    tetoG = new THREE.BoxGeometry(8000, 1, 8000, 5, 5, 5),
    chao = new Physijs.BoxMesh(chaoG, chaoM),
    tetoM = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        color: 0x808080,
        side: THREE.DoubleSide,
        // wireframe: true
        map: new THREE.TextureLoader().load('textures/bkg1_top.png')
    })),
    teto = new THREE.Mesh(tetoG, tetoM),
    materialLimite = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        color: 0x012C56,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('textures/blue.png')
    })),
    geometriaLimite = new THREE.PlaneGeometry(8000, 1000),
    paredesLimite = [],
    
    bLoader = new THREE.CubeTextureLoader(),
    
    gemetriaMeshZona = new THREE.BoxGeometry(20, 250, 200),
    materialMeshZona = new THREE.MeshBasicMaterial({
        color: 0xc4302b,
        map: textureDanger
    }),
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
    controls,
    deadInimigos = 0,
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
    inimigoASeguir = false,
    numeroInimigos = 10,
    inimigos = [],
    numeroComida = 1,
    rPressionado = false,
    cont = 0,
    offset = 0.05,
    add = false,
    sprint = false,
    velocidadeJogador,
    meshesZonas = [],
    loaded = false,
    loadedInit = false,
    ronda = 1,
    final = [],
    indiceFinal = 0,
    boolCor = true,
    boolCorInimigo = true,
    pontos = 0,
    indiceTimeline = 0,
    tlArray = [],
    fimRonda = false,
    offsetModel = true,
    currTime = 0,
    prevTime = 0,
    shot = 0,
    velocidadeShotJogador = 0.45,
    naZona = false,
    posBig = new THREE.Vector3(0,120,0)

// ********* SOUNDS ************
audioLoader.load('sounds/MortalKombatTheme.mp3', function (buffer) {
    audio.setBuffer(buffer)
    audio.setVolume(0.02)
    audio.setLoop(true)
    audio.play()
})
audioLoader.load('sounds/fireArrow.wav', function (buffer) {
    audioDisparoBig.setBuffer(buffer)
    audioDisparoBig.setVolume(0.01)
})
audioLoader.load('sounds/shotSoundGame.wav', function (buffer) {
    audioDisparoJogador.setBuffer(buffer)
    audioDisparoJogador.setVolume(0.01)
})



removerBalasColisao(chao)
camera.add(listener)
teto.rotation.x -= Math.PI / 2
teto.rotation.y -= Math.PI / 2


for (let i = 0; i < 50; i += 1) {
    tlArray[i] = new gsap.timeline()
}


for (let j = 0; j < 4; j += 1) {
    meshZona = new THREE.Mesh(gemetriaMeshZona, new THREE.MeshBasicMaterial({
        color: green,
        map: textureDanger
    }))
    meshesZonas.push(meshZona)
}


for (let j = 0; j < 4; j += 1) {
    var paredeL = new Physijs.BoxMesh(geometriaLimite, materialLimite);
    removerBalasColisao(paredeL)
    paredesLimite.push(paredeL)

}
for (let i = 0; i < 3; i += 1) {
    var paredeI = new paredeInterior()
    removerBalasColisao(paredeI.mesh)
    paredesInterior.push(paredeI.mesh)

}
let linhasGrandes = []
for (let i = 0; i < 8; i++) {
    linhaGrande = new linhaChaoGrande()
    linhasGrandes[i] = linhaGrande
}

let linhasPequenas = []
for (let i = 0; i < 8; i++) {
    linhaPequena = new linhaChaoPequena()
    linhasPequenas[i] = linhaPequena
}
let chaoWire = new THREE.Mesh(new THREE.BoxGeometry(1950, 5, 1000, 3, 3), new THREE.MeshBasicMaterial({
    color: 0x202060,
    map: textureDangerChao
}))
chaoWire.position.set(3520, 16, 3000)
chaoWire.rotation.y += Math.PI / 2
chaoWire.name = 'nhoko'
// ******* POSITIONS & ROTATIONS ************
meshesZonas[0].position.set(-3980, 125, 3000)
meshesZonas[1].position.set(3980, 125, 1000)
meshesZonas[2].position.set(-3980, 125, -1000)
meshesZonas[3].position.set(3980, 125, -3000)
paredesLimite[0].position.set(4000, 500, 0)
paredesLimite[0].rotation.y += Math.PI / 2
paredesLimite[1].position.set(-4000, 500, 0)
paredesLimite[1].rotation.y += Math.PI / 2
paredesLimite[2].position.set(0, 500, 4000)
paredesLimite[3].position.set(0, 500, -4000)
paredesInterior[0].position.set(490, 252, 2000)
paredesInterior[0].rotation.set(0, 0, Math.PI)
paredesInterior[1].position.set(-490, 252, 0)
paredesInterior[2].position.set(490, 252, -2000)
mira1.position.z -= 500
mira2.position.z -= 500

chao.rotation.x = Math.PI / 2
chao.rotation.z = Math.PI / 2

chao.name = 'chao'
teto.position.set(0, 1000, 0)
teto.rotation.x += Math.PI / 2
//teto.rotation.z += Math.PI/2
plight.position.z -= 100


// text test
// var loader1 = new THREE.FontLoader();
// materials = [
//     new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
//     new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
// ];
// var geometry1
// loader1.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

// 	    geometry1 = new THREE.TextGeometry( 'Hello three.js!', {
// 		font: font,
// 		size: 80,
// 		height: 5,
// 		curveSegments: 12,
// 		bevelEnabled: true,
// 		bevelThickness: 10,
// 		bevelSize: 8,
// 		bevelOffset: 0,
// 		bevelSegments: 5
//     } );
   
// } );
// textMesh1 = new THREE.Mesh( geometry1, materials );
// textMesh1.position.set(3000,100,3500)
// textMesh1.scale.set(10,10,10)


// colisão jogador


// *** AK 47 ***
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
//NUKE COLA
// loader.load('obj/scene.gltf', function (gltf) {
//     model = gltf.scene
//     model.scale.set(.35,.35,.35)
//     model.position.z = -200
//     model.position.y -= 60

//     model.position.x += 80
//     model.rotation.y -= Math.PI/2 * 0.9


//     scene.add(model)
//     loaded = true
//     //renderer.render(scene,camera)
// });
// EVENT LISTENERS

document.addEventListener('click', function () {
    if (currTime - prevTime > velocidadeShotJogador) {
        prevTime = currTime
        disparar()
    }
    document.addEventListener('mousedown', function () {
        rPressionado = true
    })

})
document.addEventListener('mouseup', function () {
    rPressionado = false
})
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);
let barraVida
function init() {
    camera.position.set(3400, 100, 3200)
    camera.rotation.set(0, Math.PI / 2, 0)
    scene.add(camera)
    //scene.background = bLoader.load(backG);
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
    scene.add(chaoWire)
    // scene.add(textMesh1)
     
    // let cantoTeste = new cantoMapa()
    // scene.add(cantoTeste.mesh)
    // scene.add(cTeste)
    addInimigos()
    addFinal()
    criarVidaJogadorHTML()
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


    addLinhas()
    addSetas()

    renderer.render(scene, camera)
    loadedInit = true


}
balasBig = []
let g = 0
   

function animate() {
    delta = clock.getDelta()
    currTime += delta
    
    jogador1.mesh.__dirtyPosition = true
    naZona = verificarZona()

   
    corInimigo()
    mudaCorSetas()
    mudaOpacityParedes()
    final.mesh.__dirtyRotation = true 
    final.mesh.rotation.z += 0.015
    final.mesh.rotation.x += 0.015
    if (controls.isLocked === true) {
        movimentoInimigos()
        if (add == false) {
            camera.add(model)
            add = true
        }
        movimentoJogador()
        dispararBig()
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
        if (jogador1.mesh.vida <= 0) {
            alert("MORRESTE")
            limparVelocidades()
            //  limpar mapa 
            for (n = 0; n < inimigos.length; n += 1) {
                if (inimigos[n].mesh.alive) {
                    inimigos[n].mesh.aSeguir = false
                    scene.remove(inimigos[n].mesh)
                }
            }
            scene.remove(final.mesh)
            deadInimigos = 0
            addInimigos()
            addFinal()
            camera.position.set(3400, 100, 3200)
            jogador1.mesh.vida = 100;
            barraVidaJogador.setValue(jogador1.mesh.vida)
            console.log(numeroInimigos)
            camera.rotation.set(0,Math.PI/2,0)

        }
        // controlar bool cores
        if (frame % 40 == 0) {
            boolCor ? boolCor = false : boolCor = true
        }
        if (frame % 15 == 0) {
            boolCorInimigo ? boolCorInimigo = false : boolCorInimigo = true
        }
        // fim da ronda
        if (fimRonda) {
            fimRonda = false;
            limparVelocidades()
            novaRonda()
        }
    }

    ajustarJanela();
    scene.simulate();
    renderer.render(scene, camera)
    requestAnimationFrame(animate);

}
init()
if (loadedInit) {
    animate()
}