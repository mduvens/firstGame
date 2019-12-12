Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';
// raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
// onObject = false;

//world
var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var scene = new Physijs.Scene();
scene.setGravity(new THREE.Vector3(0, 0, 0))
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 20000);
var clock = new THREE.Clock({
    autoStart: true
});
controls = new THREE.PointerLockControls(camera, renderer.domElement)

//************************************************************* */
// VARIÁVEIS
var
    listener = new THREE.AudioListener(),
    sound = new THREE.PositionalAudio(listener),
    sound1 = new THREE.Audio(listener),
    audioLoader = new THREE.AudioLoader(),
    audioLoader1 = new THREE.AudioLoader(),
    light = new THREE.AmbientLight(0xFFFFFF, 1),
    plight = new THREE.PointLight( 0xffffff, 2, 300 ),


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
        color: 0x808080,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('textures/blue.png')
    })),
    geometriaInterior = new THREE.BoxGeometry(7000, 500, 50),
    red = 0xFF0000,
    green = 0x00FF00,
    blue = 0x0000FF,
    z = 0,
    s = 0,
    i = 0,
    r = 0,
    frame = 0,
    balasZ = [],
    distance,
    distanciaJ,
    distanciaP,
    collisions,
    direcoesB = [],
    direcoesZ = [],
    direcao = new THREE.Vector3(),
    pontos = 0,
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
    numeroZombies = 5,
    zombies = [],
    numeroComida = 3,
    comidas = [],
    rPressionado = false,
    cont = 0,
    offset = 0.01,
    add = false,
    sprint = false,
    velocidadeJogador


for (let j = 0; j < 4; j += 1) {
    var paredeL = new Physijs.BoxMesh(geometriaLimite, materialLimite);
    paredesLimite.push(paredeL)
}
for (let i = 0; i < 3; i += 1) {
    var paredeI = new Physijs.BoxMesh(geometriaInterior, materialInterior, 0)
    paredesInterior.push(paredeI)
}
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
teto.position.set(0,1000,0)
teto.rotation.x += Math.PI/2
//teto.rotation.z += Math.PI/2
plight.position.z -= 50

// teste colisao paredes
for(let i=0; i<paredesInterior.length; i+=1){
    paredesInterior[i].setCcdMotionThreshold(200);
    paredesInterior[i].setCcdSweptSphereRadius(0.1);
    paredesInterior[i].name = 'paredeI'
    paredesInterior[i].addEventListener('collision', function(obj, vel, ang){
            if(obj.name == 'zombie'){
                obj.junto = true
                console.log(obj)
                bang = true
                velBang.z = vel.z   
                console.log(velBang)      
            }
        
    })
}

// colisão jogador
jogador1.mesh.addEventListener('collision', function (obj, vel, angularV) {
   
    if (obj.name === 'balaZombie') {
        if (jogador1.mesh.vida > 20) {
            audioLoader1.load('sounds/hitSimples.mp3', function (buffer) {
                sound1.setBuffer(buffer);
                //sound.setLoop(true);
                sound1.setVolume(0.9);
                sound1.play();
            })
        }
        if (jogador1.mesh.vida > 0) {
            jogador1.mesh.vida -= 50;
            //console.log(obj)
        }
    }
    if (obj.name === 'comida') {
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


loader.load('obj/scene.gltf', function (gltf) {
    model = gltf.scene
    model.scale.set(.15, .15, .15)
    model.position.z = -70
    model.position.y -= 20
    model.position.x += 40
    //  model.rotation.x -= Math.PI/2
    scene.add(model)
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


function init() {
    camera.position.set(3400, 100, 3200)
   // camera.rotation.y += Math.PI/2
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
    for (i = 0; i < paredesLimite.length; i += 1) {
        scene.add(paredesLimite[i])
    }
    for (i = 0; i < paredesInterior.length; i += 1) {
        scene.add(paredesInterior[i])
    }

    renderer.render(scene, camera)

}

function animate() {
    //controls.update();
    //camera.lookAt(cube)
    // raycaster.ray.origin.copy( controls.getObject().position );
    // raycaster.ray.origin.y -= 20;
    // var intersections = raycaster.intersectObjects(cubosTest);
    // onObject = intersections.length > 0  
    if (controls.isLocked === true) {
        if(add == false){
            camera.add(model)
            add = true
        }
        disparoAutomatico()
        //teste colisao paredes
        jogador1.mesh.__dirtyPosition = true
        if(bang == true){
            //camera.position.x -= velBang.x /100
            if(velBang.z > 0){
                //camera.position.z -= 150
                bang = false  
            }
            else if (velBang.z < 0){
                //camera.position.z += 150
                bang = false  
            }
         }
        // gun.mesh.__dirtyPosition = true
        // gun.mesh.__dirtyRotation = true
        for (let m = 0; m < numeroComida; m += 1) {
            comidas[m].mesh.__dirtyRotation = true;
            comidas[m].mesh.rotation.z += offset
            comidas[m].mesh.rotation.x += offset
        }
        jogador1.mesh.position.set(camera.position.x, camera.position.y, camera.position.z)
        
        frame += 1;
        for (let m = 0; m < numeroComida; m += 1) {
            if (comidas[m].mesh.alive) {
                comidas[m].mesh.setLinearFactor(new THREE.Vector3(0, 0, 0))
            }
        }
        if (frame % 60 == 0) {
            console.log(noObjeto)
        }
        delta = clock.getDelta()
        //console.log(delta)

        limitarMovJogador();
        velocityJ.x -= velocityJ.x * 10.0 * delta;
        velocityJ.z -= velocityJ.z * 10.0 * delta;
        if (noObjeto == true) {
            velocityJ.y = 0
            podeSaltar = true
        } else {
            velocityJ.y -= 9.8 * 500.0 * delta;

        }

        // Movimento Jogador
        controls.moveRight(velocityJ.x * delta);
        controls.moveForward(velocityJ.z * delta);
        controls.getObject().position.y += (velocityJ.y * delta); // new behavior

        if (controls.getObject().position.y < 150) {
            velocityJ.y = 0;
            controls.getObject().position.y = 150;
            podeSaltar = true;
        }
        // zombies a seguir
        for (n = 0; n < zombies.length; n += 1) {
            if (zombies[n].mesh.alive) {
                zombies[n].mesh.__dirtyPosition = true;
                zombies[n].mesh.setCcdMotionThreshold(40);
                zombies[n].mesh.setCcdSweptSphereRadius(0.2);
                distanciaJ = new THREE.Vector3(controls.getObject().position.x - zombies[n].mesh.position.x, controls.getObject().position.y - zombies[n].mesh.position.y, controls.getObject().position.z - zombies[n].mesh.position.z)
                direcao = obterDirecao(zombies[n].mesh, camera)
                for(i=0;i<paredesInterior.length;i +=1){
                    distanciaP = new THREE.Vector3(controls.getObject().position.x - zombies[n].mesh.position.x, controls.getObject().position.y - zombies[n].mesh.position.y, controls.getObject().position.z - zombies[n].mesh.position.z)
                }
                if (distanciaJ.x < 2000 && distanciaJ.z < 2000) {
                    zombies[n].aSeguir(true);
                    if (zombies[n].mesh.junto == false) {
                        zombies[n].mesh.position.x += direcao.x * delta / 2
                        zombies[n].mesh.position.z += direcao.z * delta / 2
                        zombies[n].mesh.setLinearVelocity(new THREE.Vector3(direcao.x * 100, 0, direcao.z * 100))
                    } else {
                        zombies[n].mesh.position.x -= direcao.x * delta * 5
                        zombies[n].mesh.position.z -= direcao.z * delta * 5
                        zombies[n].mesh.junto = false
                    }
                } else {
                    zombies[n].aSeguir(false);
                }
            }
        }
        // Disparo zombie
        if (frame % 180 === 0) {
            // console.log(camera.position)
            //console.log(camera.position)   
            if (balasZ.length === zombies.length) {
                for (c = 0; c < balasZ.length; c += 1) {
                    //if (balasZ[c].mesh.alive)
                    //scene.remove(balasZ[c].mesh) // error a undefined
                }
            }
            for (c = 0; c < balasZ.length; c += 1) {
                //scene.remove(balasZ[c])
            }
            for (c = 0; c < zombies.length; c += 1) {
                if (zombies[c].mesh.alive) {
                    balasZ[c] = new balaZ();
                    balasZ[c].mesh.alive = true;
                }
            }
            for (i = 0; i < balasZ.length; i += 1) {
                if (zombies[i].mesh.alive === true) {
                    distance = new THREE.Vector3(controls.getObject().position.x - zombies[i].mesh.position.x, controls.getObject().position.y - zombies[i].mesh.position.y, controls.getObject().position.z - zombies[i].mesh.position.z)
                    // balasZ[i].mesh.addEventListener('collision', function (obj, lV, aV) {
                    //     console.log(obj.name)
                    // })
                    balasZ[i].mesh.position.set(zombies[i].mesh.position.x, zombies[i].mesh.position.y, zombies[i].mesh.position.z)
                    direcoesB = obterDirecao(zombies[i].mesh, controls.getObject())
                    if(zombies[i].mesh.rage){
                        scene.add(balasZ[i].mesh)
                    }
                    balasZ[i].mesh.__dirtyPosition = true
                    balasZ[i].mesh.setLinearFactor(new THREE.Vector3(0, 0, 0))
                    balasZ[i].mesh.setLinearVelocity(new THREE.Vector3(direcoesB.x, direcoesB.y, direcoesB.z))
                }
            }
        }
        if (jogador1.mesh.vida === 0) {
            alert("MORRESTE")
            limparMapa()
            init()
            camera.position.set(3400, 100, 3200)
            jogador1.mesh.vida = 100;
        }
        if (frame % 60 === 0) {
           // console.log(camera.rotation)
            if (deadZombies === numeroZombies || pontos === numeroComida) {
                velocityJ.x = 0;
                velocityJ.z = 0;
                velocityJ.y = 0;
                limparMapa()
                alert("RONDA " + (numeroZombies / 5) + " COMPLETA");
                alert("PREPARA-TE. RONDA " + (numeroZombies / 5 + 1));
                novaRonda()
                camera.position.set(3400, 100, 3200)
            }
        }
    }
    scene.simulate();
    ajustarJanela();
    renderer.render(scene, camera)
    requestAnimationFrame(animate);

}
init()
animate()