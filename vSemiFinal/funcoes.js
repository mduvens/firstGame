
ajustarJanela = function () {
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })
}
inimigo = function (vida, velocidade) {
    this.geometria = new THREE.SphereGeometry(100, 100, 60);;
    this.material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
       color: 0x4b0000,
        map: textureDanger2
    }));
    this.vida = vida;
    this.velocidade = velocidade;
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 99999999)
    this.mesh.vida = 100;
    this.mesh.name = 'inimigo'
    this.mesh.alive = true;
    this.mesh.aSeguir = false
    this.mesh.junto = false;
    this.mesh.direcao = new THREE.Vector3(0, 0, 0)
    this.aSeguir = function (bool) {
        if (bool === true) {
            if (this.mesh.vida != 10) {
                this.material.color.set(0xAD0000)
            } else {
                this.material.color.set(green)
            }
            this.mesh.aSeguir = true
        } else {
            if (this.mesh.vida === 10) {
                this.material.color.set(green)
            } else {
                this.material.color.set(0x570000)
            }
            this.mesh.aSeguir = false
        }
    }

    
}
balaJ = function () {
    this.geo = new THREE.SphereGeometry(15, 3,3, 0)
    this.material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: 0xA0A0A0
    }))
    this.mesh = new Physijs.BoxMesh(this.geo, this.material)
    this.mesh.name = 'balaJ'
    this.mesh.alive = true
    
}
balaZ = function () {
    this.geo = new THREE.SphereGeometry(30, 32, 32)
    this.material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: red,
        map: new THREE.TextureLoader().load('textures/fire1.jpg')
    }))
    this.mesh = new Physijs.BoxMesh(this.geo, this.material, 100)
    this.mesh.name = 'balaZombie'
    this.mesh.alive = true;
}
balaBig = function () {
    this.geo = new THREE.SphereGeometry(80, 32, 32)
    this.material = Physijs.createMaterial(new THREE.MeshBasicMaterial({
       map: textureFire
    
       
    }))
    this.mesh = new Physijs.SphereMesh(this.geo, this.material, 1000)
    this.mesh.alive = true;
    this.mesh.name = 'balaBig'
    this.mesh.vida = 100
}
criarBig = function(){
    
    balasBig[g] = bigB.mesh
    scene.add(balasBig[g])
    dir = obterDirecao(balasBig[g], camera)
    balasBig[g].setLinearFactor(new THREE.Vector3(0, 0, 0))
    balasBig[g].setLinearVelocity(new THREE.Vector3(dir.x , 0, dir.z))
    g += 1
}
dispararBig = function () {
    if (frame % 150 == 0) {
        if (naZona == true) {    
            bigB = new balaBig()
            bigB.mesh.position.set(posBig.x, posBig.y, posBig.z)   
            if (balasBig.length < 4 && r !== 4) {
                criarBig()
                audioDisparoBig.play()
            } else {
                if (g < 3) {
                    if (balasBig[g + 1].alive) {
                        scene.remove(balasBig[g + 1])
                    }
                }
                criarBig()
                audioDisparoBig.play()
            }
            if (g == 4) {
                g = 0;
                if (balasBig[0].alive) {
                    scene.remove(balasBig[0])
                }
            }

        }
    }
}
finalMesh = function () {
    this.geometria = new THREE.OctahedronGeometry(150)
    this.material = new THREE.MeshLambertMaterial({
        color: 0xD0D0D0,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('textures/gold.jpg')
    })
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 0);
    this.mesh.alive = true
    this.mesh.name = "comida"
}
addInimigos = function () {
    return new Promise(function(resolve) {

    for (let m = 0; m < numeroInimigos; m += 1) {
        inimigos[m] = new inimigo(100, 30);
        inimigos[m].mesh.setLinearFactor(new THREE.Vector3(0, 0, 0))
        inimigos[m].mesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
        //meshesInimigos[m] = inimigos[m].mesh;
        inimigos[m].mesh.position.set((Math.random() - 0.6) * 4800 - 1000, 100, (Math.random() - 0.6) * 4800 - 1000)
        scene.add(inimigos[m].mesh)
        inimigos[m].mesh.setCcdMotionThreshold(20);
        inimigos[m].mesh.setCcdSweptSphereRadius(0.2);
        inimigos[m].mesh.addEventListener('collision', function (obj, vel, ang, contNorm) {
            if (obj.name == 'inimigo') {
                inimigos[m].mesh.junto = true
            }
            if(obj.name == 'balaJ'){
                inimigos[m].mesh.rage = true
            }
        })

    }
    resolve(true);
});    
    
}
addFinal = function () {
    return new Promise(function(resolve) {
    final = new finalMesh()
    final.mesh.position.set(3600,200,-3700)
    scene.add(final.mesh) 
    resolve(true)
    })
}
jogador = function () {
    this.geometria = new THREE.SphereGeometry(60, 32, 32);
    this.material = Physijs.createMaterial(new THREE.MeshBasicMaterial())
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 999)
    this.mesh.vida = 100
    this.mesh.alive = true
    this.mesh.name = 'jogador'
}
disparar = function(){
    bala = new balaJ
    bala.mesh.position.set(camera.position.x, camera.position.y - 10, camera.position.z)
    moverArmaADisparar()
    if (balasJ.length < 4 && r !== 4) {
        balasJ[r] = bala.mesh;
        scene.add(balasJ[r])
        audioDisparoJogador.play()   
        console.log(shot++)
        movimentoBalaJogador(balasJ[r])        
        tirarVidaBalaJogador(balasJ[r])
        r += 1
    } else {
        if (r < 3) {
            if(balasJ[r + 1].alive){
                scene.remove(balasJ[r + 1])
            }
        }
        balasJ[r] = bala.mesh;
        scene.add(balasJ[r])
        audioDisparoJogador.play()
        console.log(shot++)
        movimentoBalaJogador(balasJ[r])
        tirarVidaBalaJogador(balasJ[r])
      
        r += 1
    }
    if (r === 4) {
        r = 0
        if(balasJ[0].alive){
        scene.remove(balasJ[0])
        }
    }


}
disparoAutomatico = function () {
    if (rPressionado) {
        if(currTime - prevTime > 0.6 ){
            prevTime = currTime
            disparar()
         
        }
    }

}
movimentoBalaJogador = function (objeto) {
    direcao = controls.getDirection(new THREE.Vector3(0, 200, 0))
    objeto.setLinearFactor(new THREE.Vector3(0, 0, 0))
    objeto.setLinearVelocity(new THREE.Vector3(direcao.x * 12500, direcao.y * 12500, direcao.z * 12500))
    objeto.setCcdMotionThreshold(1);
    objeto.setCcdSweptSphereRadius(0.2);

}
tirarVidaBalaJogador = function (objeto) {
    objeto.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {
        if (objCollidedWith.name === 'inimigo') {
            if (objCollidedWith.alive === true) {
                if (objCollidedWith.vida > 0) {
                    objCollidedWith.vida -= 20
                    if (objCollidedWith.vida === 0) {
                        objCollidedWith.alive = false
                        deadInimigos += 1;
                        scene.remove(objCollidedWith)
                    }
                }
            }
        }
        
    })

}
movimentoJogador = function () {

    if (camera.position.x < 3950 && camera.position.x > -3950 && camera.position.z < 3950 && camera.position.z > -3950 /*&& camera.position.y > 100*/ && controls.isLocked) {
        if (sprint == false) {
            velocidadeJogador = 9000
        } else {
            velocidadeJogador = 17000
        }
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
    evitarParedes(camera)
    
}
limparVelocidades = function () {
    velocityJ.x = 0
    velocityJ.y = 0
    velocityJ.z = 0
    delta = 0
    moveDir = false, moveEsq = false, moveFrente = false, moveTras = false, moveCima = false, moveBaixo = false;
}
limparMapa = function () {
    for (n = 0; n < inimigos.length; n += 1) {
        if (inimigos[n].mesh.alive) {
            inimigos[n].aSeguir(false)
            scene.remove(inimigos[n].mesh)
        }
    }  
}
novaRonda = function () {
     //  A RESOLVER
    
     camera.position.set(3400, 100, 3200)
    numeroInimigos += 5
    addInimigos().then(function() {
        console.log('AddInimigos done');
       
    })
    
    addFinal().then(function(){
        alert("RONDA " + ronda + " COMPLETA");

        alert("PREPARA-TE. RONDA " + ++ronda);    
    })
    deadInimigos = 0;
    
    
    
    
}
obterDirecao = function (fonte, destino) {
    direcao = new THREE.Vector3(destino.position.x - fonte.position.x, destino.position.y - fonte.position.y, destino.position.z - fonte.position.z);
    return direcao;
}
onKeyDown = function (e) {
    switch (e.keyCode) {
        case 81:
            limparVelocidades()
            fimRonda = false;
            if (loaded == true) {
                controls.lock()
            }
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
        case 67:
            console.log(camera.position)
            // tl.to(cTeste.position,{duration: .2, z: cTeste.position.z + 200})
            break;
        case 70:
            // tl.to(cTeste.position,{duration: .2, z: cTeste.position.z - 200})          
            break;
        case 16:
            sprint = true
            break;
        case 32:
            if (podeSaltar === true) {
                noObjeto = false
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
evitarParedes = function(obj){
    if(indiceTimeline == 50){indiceTimeline=0}
    let boolTipoObj = obj.name == 'inimigo' ? false : true
    if (obj.position.x > -3000 && obj.position.x < 4000 && obj.position.z < 2150 && obj.position.z > 2000) {
        if(boolTipoObj){
            obj.position.z = 2151
        }
        else{
             tlArray[indiceTimeline++].to(obj.position,{duration: .1, z: obj.position.z + 1000}) 
          
        }
    }
    if (obj.position.x > -3000 && obj.position.x < 4000 && obj.position.z < 2000 && obj.position.z > 1850) {
        if(boolTipoObj){
            obj.position.z = 1849
        }
        else{
            tlArray[indiceTimeline++].to(obj.position,{duration: .4, z: obj.position.z - 1000})
            
        }
      
    }
    if (obj.position.x > -4000 && obj.position.x < 3000 && obj.position.z > 0 && obj.position.z < 150) {
        if(boolTipoObj){
            obj.position.z = 151
        }
        else{
            tlArray[indiceTimeline++].to(obj.position,{duration: .4, z: obj.position.z + 1000})
        }
      
    }
    if (obj.position.x > -4000 && obj.position.x < 3000 && obj.position.z < 0 && obj.position.z > -150) {
        if(boolTipoObj){
            obj.position.z = -151
        }
        else{
            tlArray[indiceTimeline++].to(obj.position,{duration: .4, z: obj.position.z - 1000})
        }
     
    }
    if (obj.position.x > -3000 && obj.position.x < 4000 && obj.position.z > -2000 && obj.position.z < -1850) {
        if(boolTipoObj){
            obj.position.z = -1849
        }
        else{
            tlArray[indiceTimeline++].to(obj.position,{duration: .4, z: obj.position.z + 1000})
        }
      
    }
    if (obj.position.x > -3000 && obj.position.x < 4000 && obj.position.z < -2000 && obj.position.z > -2150) {
        if(boolTipoObj){
            obj.position.z = -2151
        }
        else{
            tlArray[indiceTimeline++].to(obj.position,{duration: .4, z: obj.position.z - 1000})
        }
      
    }

}
movimentoInimigos = function () {
    for (n = 0; n < inimigos.length; n += 1) {

        if (inimigos[n].mesh.alive) {

            distanciaJ = new THREE.Vector3(controls.getObject().position.x - inimigos[n].mesh.position.x, controls.getObject().position.y - inimigos[n].mesh.position.y, controls.getObject().position.z - inimigos[n].mesh.position.z)
            // for(i=0;i<paredesInterior.length;i +=1){
            //     distanciaP = new THREE.Vector3(controls.getObject().position.x - inimigos[n].mesh.position.x, controls.getObject().position.y - inimigos[n].mesh.position.y, controls.getObject().position.z - inimigos[n].mesh.position.z)
            // }
            if ((distanciaJ.x < 1000 && distanciaJ.z < 1000) || inimigos[n].mesh.rage) {
                inimigos[n].mesh.direcao = obterDirecao(inimigos[n].mesh, controls.getObject())
                inimigos[n].aSeguir(true);
                inimigos[n].mesh.__dirtyPosition = true;
                evitarParedes(inimigos[n].mesh)
                if (inimigos[n].mesh.junto == false) {
                    inimigos[n].mesh.position.x += inimigos[n].mesh.direcao.x * delta
                    inimigos[n].mesh.position.z += inimigos[n].mesh.direcao.z * delta
                } else {
                     inimigos[n].mesh.position.x -= inimigos[n].mesh.direcao.x * delta * 2
                     inimigos[n].mesh.position.z -= inimigos[n].mesh.direcao.z * delta * 2
                     inimigos[n].mesh.junto = false
                 }


            } else {
                inimigos[n].aSeguir(false);
            }
        }
    }

}
linhasVerdes = function(){
    for(let i = 0; i<8; i+=1){
        corForaZona(linhasGrandes[i].mesh)
    }
    for(let i = 0; i<8; i+=1){
        corForaZona(linhasPequenas[i].mesh)
    }
    corForaZona(chaoWire)
    
}
verificarZona = function () {
    if (camera.position.x > -2000 && camera.position.x < 3000 && camera.position.z > 2050) {
        corDentroZona(meshesZonas[0])
        posBig.x = -3850
        posBig.z = 3000
        mudaCorVermelho(linhasGrandes[0].mesh)
        mudaCorVermelho(linhasGrandes[1].mesh)     
        mudaCorVermelho(linhasPequenas[0].mesh)  
        mudaCorVermelho(linhasPequenas[1].mesh)
        mudaCorVermelho(meshesZonas[0])
        mudaCorVermelho(chaoWire)
        
        return true
    } else if (camera.position.x > -4000 && camera.position.x < 2000 && camera.position.z < 1950 && camera.position.z > 0) {
        corDentroZona(meshesZonas[1])
                posBig.x = 3900
        posBig.z = 1000
        mudaCorVermelho(linhasGrandes[2].mesh)
        mudaCorVermelho(linhasGrandes[3].mesh)     
        mudaCorVermelho(linhasPequenas[2].mesh) 
        mudaCorVermelho(linhasPequenas[3].mesh)
        mudaCorVermelho(meshesZonas[1])
        return true
        
    } else if (camera.position.x > -2000 && camera.position.x < 4000 && camera.position.z < 0 && camera.position.z > -2000) {
        corDentroZona(meshesZonas[2])
        posBig.x = -3900
        posBig.z = -1000
        corDentroZona(linhasGrandes[4].mesh)
        corDentroZona(linhasGrandes[5].mesh)  
        corDentroZona(linhasPequenas[4].mesh)  
        corDentroZona(linhasPequenas[5].mesh)
        mudaCorVermelho(meshesZonas[2])
        return true
    } else if (camera.position.x > -4000 && camera.position.x < 2000 && camera.position.z < -2000) {
        corDentroZona(meshesZonas[3])
        posBig.x = 3900
        posBig.z = -3000
        corDentroZona(linhasGrandes[6].mesh)
        corDentroZona(linhasGrandes[7].mesh)   
        corDentroZona(linhasPequenas[6].mesh) 
        corDentroZona(linhasPequenas[7].mesh)
        mudaCorVermelho(meshesZonas[3])
        return true

    } else {
        for (let j = 0; j < 4; j += 1) {
            meshesZonas[j].material.color.set(green)
            
        }
        linhasVerdes()
        return false
    }



}
paredeInterior = function(){
    this.geo  = new THREE.BoxGeometry(7000, 500, 40),
    this.mat =  materialInterior = Physijs.createMaterial(new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
        // map: new THREE.TextureLoader().load('textures/woodS.jpg')
        transparent: true,
        opacity: 1
    }))
    this.mesh = new Physijs.BoxMesh(this.geo, this.mat, 0)
    this.mesh.name = "paredeI"
}
mudaCorAzul = function(obj){
    if(obj.name == 'retangulo'){
        if(boolCor){
            obj.material.color.set(0x3345b5) // 0x3345b5
            paredesInterior[0].material.opacity = .7
            paredesInterior[1].material.opacity = .5
            paredesInterior[2].material.opacity = .7
        }
        else{
            obj.material.color.set(0x161d41)
            // boolCor = false
            paredesInterior[0].material.opacity = .5
            paredesInterior[1].material.opacity = .7
            paredesInterior[2].material.opacity = .5

            // boolCor = true
        }    
    }
    if(obj.name == 'triangulo'){
        if(boolCor){
            obj.material.color.set(0x3345b5)
        }
        else{          
            
            obj.material.color.set(0x161d41)
        }    
    }

}
mudaCorVermelho = function(obj){ 
        if(boolCor){
            obj.material.color.set(0x870000)
        }
        else{
            obj.material.color.set(0xFd0000) // 0x3345b5
        }       

}
mudaCorInimigoASeguir = function(){ // tentar piscar inimigo
    for(let i=0;i<numeroInimigos;i+=1){
        if(inimigos[i].mesh.alive){
            if(inimigos[i].mesh.aSeguir){
                if(boolCor2){
                    inimigos[i].mesh.material.color.set(0x470000)
                }
                else{
                    inimigos[i].mesh.material.color.set(0xDd0000)
                }
            }
        }
    }
}
corDentroZona = function(obj){
        obj.material.color.set(0x9d0000)   
    }
corForaZona = function(obj){
    if(obj.name != 'nhoko'){
        obj.material.color.set(0x4c9611)   
    }
    else{
        obj.material.color.set(0x707070)   
    }
}
linhaChaoGrande = function(){
    this.geo = new THREE.BoxGeometry( 6000, 15, 50 );
    this.mat = new THREE.MeshBasicMaterial( {color: 0x4c9611} );
    this.mesh = new THREE.Mesh( this.geo, this.mat );
    this.mesh.name = 'linhaChaoGrande'
}
linhaChaoPequena = function(){
    this.geo = new THREE.BoxGeometry( 50, 15, 1950 );
    this.mat = new THREE.MeshBasicMaterial( {color: 0x4c9611} );
    this.mesh = new THREE.Mesh( this.geo, this.mat );
    this.mesh.name = 'linhaChaoGrande'
}
addLinhas = function(){
    linhasGrandes[0].mesh.position.set(1000,10,3950)
    linhasGrandes[1].mesh.position.set(1000,10,2050)
    linhasGrandes[2].mesh.position.set(-1000,10,1950)
    linhasGrandes[3].mesh.position.set(-1000,10,50)
    linhasGrandes[4].mesh.position.set(1000,10,-50)
    linhasGrandes[5].mesh.position.set(1000,10,-1950)
    linhasGrandes[6].mesh.position.set(-1000,10,-2050)
    linhasGrandes[7].mesh.position.set(-1000,10,-3950)

    linhasPequenas[0].mesh.position.set(-2000,10,3000)
    linhasPequenas[1].mesh.position.set(3000,10,3000)
    linhasPequenas[2].mesh.position.set(-4000,10,1000)
    linhasPequenas[3].mesh.position.set(2000,10,1000)
    linhasPequenas[4].mesh.position.set(-2000,10,-1000)
    linhasPequenas[5].mesh.position.set(4000,10,-1000)
    linhasPequenas[6].mesh.position.set(-4000,10,-3000)
    linhasPequenas[7].mesh.position.set(2000,10,-3000)

    for(let i= 0; i< 8; i+=1){
        scene.add(linhasGrandes[i].mesh)
    }
    for(let i= 0; i< 8; i+=1){
        scene.add(linhasPequenas[i].mesh)
    }
}
setaTriangulo = function(){
    this.geo = new THREE.ConeGeometry(80, 150, 2 );
    this.mat = new THREE.MeshBasicMaterial( {color: 0x161d41, side: THREE.DoubleSide} );
    this.mesh = new THREE.Mesh(  this.geo, this.mat );
    this.mesh.name = 'triangulo'
}
setaRetangulo = function(){
    this.geo = new THREE.BoxGeometry(2,50,200)
    this.mat = new THREE.MeshBasicMaterial( {color: 0x161d41, side: THREE.DoubleSide} );
    this.mesh = new THREE.Mesh(  this.geo, this.mat );
    this.mesh.name = 'retangulo'
}
addSetas = function(){
    setaRet.mesh.position.set(-3998,500,2400)
    setaTri.mesh.position.set(-3998,500,2225)
    setaTri.mesh.rotation.x -= Math.PI/2

    setaRet2.mesh.position.set(+3998,500,175)
    setaTri2.mesh.position.set(+3998,500,0)
    setaTri2.mesh.rotation.x -= Math.PI/2

    setaRet3.mesh.position.set(-3998,500,-1825)
    setaTri3.mesh.position.set(-3998,500,-2000)
    setaTri3.mesh.rotation.x -= Math.PI/2

    scene.add(setaRet.mesh)
    scene.add(setaTri.mesh)
    scene.add(setaRet2.mesh)
    scene.add(setaTri2.mesh)
    scene.add(setaRet3.mesh)
    scene.add(setaTri3.mesh)
}
mudaCorSetas = function(){
    mudaCorAzul(setaRet.mesh)
    mudaCorAzul(setaTri.mesh)
    mudaCorAzul(setaRet2.mesh)
    mudaCorAzul(setaTri2.mesh)
    mudaCorAzul(setaRet3.mesh)
    mudaCorAzul(setaTri3.mesh)
}
moverArmaADisparar = function(){
    if(offsetModel){
        model.rotation.z += 0.1
        offsetModel = false;
    }
    else{
        model.rotation.z -= 0.1
        offsetModel =  true;
    }
}
removerBalasColisao = function(objeto){
    objeto.addEventListener('collision', function(obj,vel,ang){
        if(obj.name == 'balaBig' || obj.name == 'balaJ'){
            scene.remove(obj)
            obj.alive = false;
        }
    })
}