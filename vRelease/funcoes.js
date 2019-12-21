
ajustarJanela = function () {
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })
}
jogador = function () {
    this.geometria = new THREE.SphereGeometry(50, 32, 32);
    this.material = Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x000000, transparent:true, opacity: .1}))
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 999)
    this.mesh.vida = 100
    this.mesh.alive = true
    this.mesh.name = 'jogador'
    this.mesh.addEventListener('collision', function (obj, vel, angularV) {
        if (obj.name === 'balaBig' ) {
            if (jogador1.mesh.vida > 0) {
                jogador1.mesh.vida -= 50;
                barraVidaJogador.setValue(jogador1.mesh.vida)
                scene.remove(obj)
                obj.alive = false
                //console.log(obj)
            }
        }
        if (obj.name === 'comida') {
            obj.alive = false;
            scene.remove(obj)
            fimRonda = true
            
        }
    })
}
disparar = function(){
    bala = new balaJ
    bala.mesh.position.set(camera.position.x, camera.position.y - 10, camera.position.z)
    moverArmaADisparar()
    if (balasJ.length < 4 && r !== 4) {
        balasJ[r] = bala.mesh;
        scene.add(balasJ[r]) 
        audioDisparoJogador.play()   
        //console.log(shot++)
        movimentoBalaJogador(balasJ[r])        
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
        //console.log(shot++)
        movimentoBalaJogador(balasJ[r])
      
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
        if(currTime - prevTime > velocidadeShotJogador ){
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
moverArmaADisparar = function(){
    if(loaded){
        if(offsetModel){
            model.rotation.z += 0.1
            offsetModel = false;
        }
        else{
            model.rotation.z -= 0.1
            offsetModel =  true;
        }
    
    }
}
movimentoJogador = function () {

    if (camera.position.x < 3950 && camera.position.x > -3950 && camera.position.z < 3950 && camera.position.z > -3950 /*&& camera.position.y > 100*/ && controls.isLocked) {
        if (sprint == false) {
            velocidadeJogador = 13000
        } else {
            velocidadeJogador = 20000
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
balaJ = function () {
    this.geo = new THREE.SphereGeometry(15, 3,3, 0)
    this.material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: 0xA0A0A0
    }))
    this.mesh = new Physijs.BoxMesh(this.geo, this.material,3)
    this.mesh.name = 'balaJ'
    this.mesh.alive = true
    
}
balaBig = function () {
    this.geo = new THREE.SphereGeometry(100, 32, 32)
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
    if (frame % 120 == 0) {
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
        map: goldTexture
    })
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 0);
    this.mesh.alive = true
    this.mesh.name = "comida"
}
inimigo = function () {
    this.geometria = new THREE.DodecahedronGeometry(80);
    this.material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        map: textureInimigo
    }));
   
    
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 1500000)
    this.mesh.vida = 100;
    this.mesh.name = 'inimigo'
    this.mesh.alive = true;
    this.mesh.direcao = new THREE.Vector3(0, 0, 0)
    this.mesh.aSeguir = false
    // rage -> permanente aSeguir caso se dispare contra.
    this.mesh.rage = false
    // colisao com outro Inimigo
    this.mesh.junto = false;
    
    //hit no jogador
    this.mesh.ataque = false
}
addInimigos = function () {
    return new Promise(function(fim) {
        controls.getObject().position.set(3400, 100, 3200)
        controls.getObject().rotation.set(0,Math.PI/2,0)
        jogador1.mesh.position.set(3400,100,3200)
        
    for (let m = 0; m < numeroInimigos; m += 1) {
        inimigos[m] = new inimigo(100, 30);
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
                if(inimigos[m].mesh.vida>20){
                    inimigos[m].mesh.vida -= 20;
                }
                else{
                    scene.remove(inimigos[m].mesh)
                    inimigos[m].mesh.alive = false
                }
                scene.remove(obj)
                obj.alive = false
            }
            if (obj.name == 'jogador') {
                inimigos[m].mesh.ataque = true
                obj.vida -=20
                // console.log(obj.name)
                barraVidaJogador.setValue(obj.vida)
            }
        })

    }

    fim(true);
});    
    
}
corInimigo = function(){ 
    for(let i=0;i<numeroInimigos;i+=1){
        if(inimigos[i].mesh.alive){
            if(inimigos[i].mesh.aSeguir){
                if(boolCorInimigo){
                    inimigos[i].mesh.material.color.set(0xd61a1f)
                }
                else{
                    inimigos[i].mesh.material.color.set(0xFFFFFF)
                }
            }
            else{
                inimigos[i].mesh.material.color.set(0xCCCCCC)
            }
        }
    }
}
movimentoInimigos = function () {
    for (n = 0; n < inimigos.length; n += 1) {

        // para nao estar a escrever "inimigos[n].mesh muitas vezes"
        let inimigo = inimigos[n].mesh

        if (inimigo.alive) {
            // distancia
            distanciaJ = obterDirecao(inimigo,controls.getObject())
            inimigo.direcao = obterDirecao(inimigo, controls.getObject())
            //perseguir jogador. fica permanente quando se dispara contra o inimigo
            if ((inimigo.direcao.x < 1000 && inimigo.direcao.z < 1000) || inimigo.rage) {
                inimigo.direcao = obterDirecao(inimigo, controls.getObject())
                inimigo.aSeguir = true
                inimigo.__dirtyPosition = true;
                inimigo.__dirtyRotation = true;
                evitarParedes(inimigo)
        
                if (inimigo.junto == false && inimigo.ataque == false) {
                    inimigo.position.x += inimigo.direcao.x * delta
                    inimigo.position.z += inimigo.direcao.z * delta
                    // inimigo.rotation.x -= inimigo.direcao.x * delta / 160
                    // inimigo.rotation.z += inimigo.direcao.z * delta / 160
                } else if (inimigo.junto){
                     inimigo.position.x -= inimigo.direcao.x * delta * 2
                     inimigo.position.z -= inimigo.direcao.z * delta * 2
                    //  inimigo.rotation.x -= inimigo.direcao.x * delta / 160
                    // inimigo.rotation.z -= inimigo.direcao.z * delta / 160
                     inimigo.junto = false
                 }else if (inimigo.ataque){
                    if(indiceTimeline == 50){indiceTimeline=0}
                    tlArray[indiceTimeline++].to(inimigo.position,{duration: .4, z: inimigo.position.z - inimigo.direcao.z * 5, x: inimigo.position.x - inimigo.direcao.x  * 5}) 
                    // inimigo.position.x -= inimigo.direcao.x * delta * 200
                    //  inimigo.position.z -= inimigo.direcao.z * delta * 200
                     inimigo.ataque = false
                 }


            } else {
                inimigo.aSeguir = false
            }
        }
    }

}
addFinal = function () {
    return new Promise(function(resolve) {
        final = new finalMesh()
        final[indiceFinal] = final
        final[indiceFinal].mesh.position.set(3600,200,-3700)
        scene.add( final[indiceFinal++].mesh)     
    resolve(true)
    })
}
limparVelocidades = function () {
    velocityJ.x = 0
    velocityJ.y = 0
    velocityJ.z = 0
    delta = 0
    moveDir = false, moveEsq = false, moveFrente = false, moveTras = false, moveCima = false, moveBaixo = false;
}
novaRonda = function () {
     //  limpar mapa 
     for (n = 0; n < inimigos.length; n += 1) {
        if (inimigos[n].mesh.alive) {
            inimigos[n].mesh.aSeguir = false
            scene.remove(inimigos[n].mesh)
        }
    }

    numeroInimigos += 5
   
    addInimigos().then(function() {  // após função addInimigos
        alert("RONDA " + ronda + " COMPLETA");
        alert("PREPARA-TE. RONDA " + ++ronda); 
        addFinal()
        // repor vida do jogador
        jogador1.mesh.vida = 100
        barraVidaJogador.setValue(jogador1.mesh.vida)
       
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
            if (loaded == true) {
                controls.lock()
            }
            break;
        case 80:
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
            console.log(meshesZonas[0].position.z)
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
                velocityJ.y += 2200;
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
            // evita o jogador passar pela parede
            obj.position.z = 2151
        }
        else{
            //animacao dos inimigos contra a parede ( a 1000 para nao ficarem sempre a ir contra a parede no caso do jogador ainda nao ter disparado contra o inimigo)
             tlArray[indiceTimeline++].to(obj.position,{duration: .4, z: obj.position.z + 1000}) 
          
        }
    }
    if (obj.position.x > -3000 && obj.position.x < 4000 && obj.position.z < 2000 && obj.position.z > 1850) {
        if(boolTipoObj){
            obj.position.z = 1849
        }
        else{
            tlArray[indiceTimeline++].to(obj.position,{duration: .7, z: obj.position.z - 1000})
            
        }
      
    }
    if (obj.position.x > -4000 && obj.position.x < 3000 && obj.position.z > 0 && obj.position.z < 150) {
        if(boolTipoObj){
            obj.position.z = 151
        }
        else{
            tlArray[indiceTimeline++].to(obj.position,{duration: .7, z: obj.position.z + 1000})
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
verificarZona = function () {
    if (camera.position.x > -2000 && camera.position.x < 3000 && camera.position.z > 2050) {
        posBig.x = -3850
        posBig.z = meshesZonas[0].position.z
        mudaCorVermelho(linhasGrandes[0].mesh)
        mudaCorVermelho(linhasGrandes[1].mesh)     
        mudaCorVermelho(linhasPequenas[0].mesh)  
        mudaCorVermelho(linhasPequenas[1].mesh)
        mudaCorVermelho(meshesZonas[0])
        mudaCorVermelho(chaoWire)
        
        return true
    } else if (camera.position.x > -4000 && camera.position.x < 2000 && camera.position.z < 1950 && camera.position.z > 0) {    
        posBig.x = 3850
        posBig.z = meshesZonas[1].position.z
        mudaCorVermelho(linhasGrandes[2].mesh)
        mudaCorVermelho(linhasGrandes[3].mesh)     
        mudaCorVermelho(linhasPequenas[2].mesh) 
        mudaCorVermelho(linhasPequenas[3].mesh)
        mudaCorVermelho(meshesZonas[1])
        return true
        
    } else if (camera.position.x > -2000 && camera.position.x < 4000 && camera.position.z < 0 && camera.position.z > -2000) {
        posBig.x = -3850
        posBig.z = meshesZonas[2].position.z
        mudaCorVermelho(linhasGrandes[4].mesh)
        mudaCorVermelho(linhasGrandes[5].mesh)  
        mudaCorVermelho(linhasPequenas[4].mesh)  
        mudaCorVermelho(linhasPequenas[5].mesh)
        mudaCorVermelho(meshesZonas[2])
        return true
    } else if (camera.position.x > -4000 && camera.position.x < 2000 && camera.position.z < -2000) {
        posBig.x = 3850
        posBig.z = meshesZonas[3].position.z
        mudaCorVermelho(linhasGrandes[6].mesh)
        mudaCorVermelho(linhasGrandes[7].mesh)   
        mudaCorVermelho(linhasPequenas[6].mesh) 
        mudaCorVermelho(linhasPequenas[7].mesh)
        mudaCorVermelho(meshesZonas[3])
        return true

    } else {
        for (let j = 0; j < 4; j += 1) {
            meshesZonas[j].material.color.set(green)
            
        }
        for(let i = 0; i<8; i+=1){
            corForaZona(linhasGrandes[i].mesh)
        }
        for(let i = 0; i<8; i+=1){
            corForaZona(linhasPequenas[i].mesh)
        }
        corForaZona(chaoWire)
        return false
    }



}
paredeInterior = function(){
    this.geo  = new THREE.BoxGeometry(7000, 500, 40),
    this.mat =  materialInterior = Physijs.createMaterial(new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: .6
    }))
    this.mesh = new Physijs.BoxMesh(this.geo, this.mat, 0)
    this.mesh.name = "paredeI"
}
mudaCorAzul = function(obj){
    if(obj.name == 'retangulo'){
        if(boolCor){
            obj.material.color.set(0x3345b5) // 0x3345b5
        }
        else{
            obj.material.color.set(0x161d41)
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
mudaOpacityParedes = function(){
    if(boolCor){
        paredesInterior[0].material.opacity = .7
        paredesInterior[1].material.opacity = .5
        paredesInterior[2].material.opacity = .7
    }
    else{  
        paredesInterior[0].material.opacity = .5
        paredesInterior[1].material.opacity = .7
        paredesInterior[2].material.opacity = .5

        // boolCor = true
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
corForaZona = function(obj){
    if(obj.name != 'nhoko'){
        obj.material.color.set(0x339933)   
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
removerBalasColisao = function(objeto){
    objeto.addEventListener('collision', function(obj,vel,ang){
        if(obj.name == 'balaBig' || obj.name == 'balaJ'){
            scene.remove(obj)
            obj.alive = false;
        }
    })
}
cantoMapa = function(){
    this.geo = new THREE.CylinderGeometry( 15, 15, 1500, 32 );
    this.material = new THREE.MeshBasicMaterial( {color: 0x000000} );
    this.mesh = new THREE.Mesh( this.geo, this.material );
    this.mesh.position.set(3990,750,3990)
}
// balaZ = function () {
//     this.geo = new THREE.SphereGeometry(30, 32, 32)
//     this.material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
//         color: red,
//         map: new THREE.TextureLoader().load('textures/fire1.jpg')
//     }))
//     this.mesh = new Physijs.BoxMesh(this.geo, this.material, 100)
//     this.mesh.name = 'balaZombie'
//     this.mesh.alive = true;
// }
criarVidaJogadorHTML = function(){
    class barraProgresso{
        constructor(elemento, initialValue = 100){
            this.valorElemento = elemento.querySelector('.valor-vida')
            this.setValue(initialValue)
        }
        setValue(valor){
            if(valor<0){valor=0}
            if(valor>100){valor=100}
            this.valorVida = valor
            this.update()
        }
        update(){
            const vidaJogador = this.valorVida
    
            this.valorElemento.textContent = vidaJogador
        }
    }
    barraVidaJogador = new barraProgresso(document.querySelector('.vida-jogador'))
    
}