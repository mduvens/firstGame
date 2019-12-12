ajustarJanela = function() {
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })
}
zombie = function(vida, velocidade) {
    this.geometria = new THREE.CubeGeometry(60, 100, 60);;
    this.material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        //color: 0x000000,
        map: new THREE.TextureLoader().load('textures/dangerA.jpg')
    }), .6, .6);
    this.vida = vida;
    this.velocidade = velocidade;
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 0)
    this.mesh.vida = 100;
    this.mesh.name = 'zombie'
    this.mesh.alive = true;
    this.mesh.rage = false
    this.mesh.junto = false;
    this.aSeguir = function (bool) {
        if (bool === true) {
            if(this.mesh.vida != 20){
                this.material.color.set(red)
            }
            else{
                this.material.color.set(green)
            }
            this.mesh.rage = true
        } else {
            if (this.mesh.vida === 20) {
                this.material.color.set(green)
            }
            else{
                this.material.color.set(0xF0F0F0)
            }
            this.mesh.rage = false
        }
    }

    this.mesh.add(sound);
}
balaZ = function() {
    this.mesh = new Physijs.BoxMesh(new THREE.SphereGeometry(30, 32, 32), Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: red,
        map: new THREE.TextureLoader().load('textures/fire1.jpg')
    })))
    this.mesh.name = 'balaZombie'
    this.mesh.alive = false;
}
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
addZombies= function() {

    for (let m = 0; m < numeroZombies; m += 1) {
        zombies[m] = new zombie(100, 30);
        zombies[m].mesh.addEventListener('collision', function (obj, vel, ang) {
            //console.log(objCollidedWith.name)
            if(obj.name == 'zombie'){
                zombies[m].mesh.junto = true
                //objCollidedWith.junto = true    
            }
        })
        //zombiemeshes[m] = zombies[m].mesh;
        zombies[m].mesh.position.set((Math.random() - 0.6) * 4800 - 1000,  100,(Math.random() - 0.6) * 4800 - 1000)
        scene.add(zombies[m].mesh)
    }
    /*for (let n = 0; n < zombies.length; n += 1) {
        
    }  */
}
addComida = function() {

    for (let m = 0; m < numeroComida; m += 1) {
        comidas[m] = new comida();
        comidas[m].mesh.position.set((Math.random() - 0.5) * 3800 - 1000, 70, (Math.random() - 0.5) * 3800 - 1000)


        scene.add(comidas[m].mesh)
    }
    /*for (let n = 0; n < zombies.length; n += 1) {
        
    }  */
}
jogador = function() {
    this.geometria = new THREE.SphereGeometry(100, 32, 32);
    this.material = Physijs.createMaterial(new THREE.MeshBasicMaterial())
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 999)
    this.mesh.vida = 100
    this.mesh.alive = true
    this.mesh.name = 'jogador'
}
disparoAutomatico = function(){
    if (rPressionado){
        if (frame % 15 == 0){
            bala = new Physijs.BoxMesh(new THREE.SphereGeometry(2, 32, 32), Physijs.createMaterial(new THREE.MeshStandardMaterial({
                color: 0x3cca36
            })))         
            bala.position.set(camera.position.x , camera.position.y-10, camera.position.z )
          
            if (balasJ.length < 4 && r !== 4) {
                balasJ[r] = bala;
                scene.add(balasJ[r])
                movimentoBalaJogador(balasJ[r])
                fixarMovimento(balasJ[r])
                tirarVidaBalaJogador(balasJ[r])
                r += 1
            } else {
                if (r < 3) {
                    scene.remove(balasJ[r + 1])
                }
                balasJ[r] = bala;
                scene.add(balasJ[r])
                movimentoBalaJogador(balasJ[r])
                tirarVidaBalaJogador(balasJ[r])
                fixarMovimento(balasJ[r])
                r += 1
            }
            if (r === 4) {
                r = 0
                scene.remove(balasJ[0])
            }

        }
    
    }

}
movimentoBalaJogador = function(objeto) {
    direcao = controls.getDirection(new THREE.Vector3(0, 0, 0))
    objeto.setLinearFactor(new THREE.Vector3(0, 0, 0))
    objeto.setLinearVelocity(new THREE.Vector3(direcao.x * 30000, direcao.y * 30000, direcao.z * 30000))

}
fixarMovimento = function(obj) { // aka 'MOTION CLAMPING'
    obj.setCcdMotionThreshold(1);
    obj.setCcdSweptSphereRadius(0.2);
}
tirarVidaBalaJogador= function(objeto) {
    objeto.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {
        if (objCollidedWith.name === 'zombie') {
            if (objCollidedWith.alive === true) {
                if (objCollidedWith.vida > 0) {
                    
                    objCollidedWith.vida -= 20
                    if (objCollidedWith.vida === 0) {
                        objCollidedWith.alive = false
                        deadZombies+=1;
                        scene.remove(objCollidedWith)
                    }
                }
                
            }
        }
    }) 

}
limitarMovJogador = function() {
    if (camera.position.x > -3000 && camera.position.z === 2010) {
        controls.getObject().position.z = 2011

    }
    if (camera.position.x < 3950 && camera.position.x > -3950 && camera.position.z < 3950 && camera.position.z > -3950 /*&& camera.position.y > 100*/ && controls.isLocked ) {
        if(sprint == false){velocidadeJogador = 7000}else{velocidadeJogador=12000}
        if (moveFrente) velocityJ.z += velocidadeJogador * delta;
        if (moveTras) velocityJ.z -= velocidadeJogador * delta;
        if (moveDir) velocityJ.x += velocidadeJogador * delta;
        if (moveEsq) velocityJ.x -= velocidadeJogador * delta;
       // if (moveCima) controls.getObject().position.y += 900 * delta;      
    }
    if (camera.position.x >= 3950) {
        camera.position.x = 3949
    }
    if (camera.position.x <= -3950) {
        camera.position.x = -3949
    }
    if (camera.position.z >= 3950) {
        camera.position.z = 3949
    }
    if (camera.position.z <= -3950) {
        camera.position.z = -3949
    }
    if(camera.position.x  > -3000 && camera.position.x < 4000 && camera.position.z < 2100 && camera.position.z > 2060){
        camera.position.z += 50
        console.log('LINHA1')
    }
    if(camera.position.x  > -3000 && camera.position.x < 4000 && camera.position.z < 1950 && camera.position.z > 1920){
       camera.position.z -= 40
       console.log('LINHA2')
   }
   if(camera.position.x  > -4000 && camera.position.x < 3000 && camera.position.z > 100 && camera.position.z < 120){
       camera.position.z += 40
       console.log('LINHA3')
   }
   if(camera.position.x  > -4000 && camera.position.x < 3000 && camera.position.z < -100 && camera.position.z > -120){
       camera.position.z -= 40
       console.log('LINHA4')
   }
   if(camera.position.x  > -3000 && camera.position.x < 4000 && camera.position.z > -1950 && camera.position.z < -1920){
       camera.position.z += 40
       console.log('LINHA5')
   }
   if(camera.position.x  > -3000 && camera.position.x < 4000 && camera.position.z > -2100 && camera.position.z < -2070){
       camera.position.z -= 40
       console.log('LINHA6')
   }

    // if (camera.position.y <= 100) {
    //     camera.position.y = 100.00001
    // }

}
limparVelocidades = function(){
    velocityJ.x = 0
    velocityJ.y = 0
    velocityJ.z  = 0
    delta = 0
   moveDir = false, moveEsq = false, moveFrente = false, moveTras = false, moveCima = false,moveBaixo = false;
}
limparMapa = function(){
    for (n = 0; n < zombies.length; n += 1) {
        if (zombies[n].mesh.alive) {
            zombies[n].aSeguir(false)
            scene.remove(zombies[n].mesh)

        }
    }
    for (n = 0; n < comidas.length; n += 1) {
        if (comidas[n].mesh.alive) {
            scene.remove(comidas[n].mesh)
        }
    }
    for (n = 0; n < balasZ.length; n += 1) {
        if (balasZ[n].mesh.alive) {
            //scene.remove(balasZ[n].mesh)
        }
    }
}
novaRonda = function () {
    numeroZombies += 5
    numeroComida += 1
    addComida()
    addZombies()
    pontos = 0;
    deadZombies = 0;
}
obterDirecao = function(fonte, destino) {
    direcao = new THREE.Vector3(destino.position.x - fonte.position.x, destino.position.y - fonte.position.y, destino.position.z - fonte.position.z);
    return direcao;
}
onKeyDown = function (e) {
    switch (e.keyCode) {
        case 81:
            limparVelocidades()
            controls.lock()

            break;
        case 69:
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
        case 67:
            console.log(camera.position)
            break;
            case 70:
            console.log(camera.position.z + model.position.z)
            break;
        case 16:
            sprint = true
            break;
        case 32:
            if ( podeSaltar === true ) {
                noObjeto= false
                velocityJ.y += 2000;
            }	
               podeSaltar = false
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
            sprint = false
            break;
    }
}
