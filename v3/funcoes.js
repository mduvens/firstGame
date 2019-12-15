ajustarJanela = function () {
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })
}
zombie = function (vida, velocidade) {
    this.geometria = new THREE.SphereGeometry(60, 100, 60);;
    this.material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        //color: 0x000000,
        map: new THREE.TextureLoader().load('textures/dangerA.jpg')
    }));
    this.vida = vida;
    this.velocidade = velocidade;
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 999990)
    this.mesh.vida = 100;
    this.mesh.name = 'zombie'
    this.mesh.alive = true;
    this.mesh.rage = false
    this.mesh.junto = false;
    this.mesh.direcao = new THREE.Vector3(0, 0, 0)
    this.aSeguir = function (bool) {
        if (bool === true) {
            if (this.mesh.vida != 10) {
                this.material.color.set(red)
            } else {
                this.material.color.set(green)
            }
            this.mesh.rage = true
        } else {
            if (this.mesh.vida === 10) {
                this.material.color.set(green)
            } else {
                this.material.color.set(0xF0F0F0)
            }
            this.mesh.rage = false
        }
    }

    this.mesh.add(sound);
}
balaJ = function () {
    this.geo = new THREE.SphereGeometry(2, 32, 32)
    this.material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: 0x3cca36
    }))
    this.mesh = new Physijs.BoxMesh(this.geo, this.material, 5)
    this.mesh.name = 'balaJ'
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
    balasBig[g].setLinearVelocity(new THREE.Vector3(dir.x/1.5 , 0, dir.z /1.5))
    g += 1
}
dispararBig = function () {
    if (frame % 180 == 0) {
        if (naZona == true) {
            bigB = new balaBig()
            bigB.mesh.position.set(posBig.x, posBig.y, posBig.z)
            if (balasBig.length < 4 && r !== 4) {
                criarBig()
            } else {
                if (g < 3) {
                    if (balasBig[g + 1].alive) {
                        scene.remove(balasBig[g + 1])
                    }
                }
                criarBig()
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
comida = function () {
    this.geometria = new THREE.OctahedronGeometry(100)
    this.material = new THREE.MeshLambertMaterial({
        color: 0xD0D0D0,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('textures/gold.jpg')
    })
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 0);
    this.mesh.alive = true
    this.mesh.name = "comida"
}
addZombies = function () {

    for (let m = 0; m < numeroZombies; m += 1) {
        zombies[m] = new zombie(100, 30);
        zombies[m].mesh.setLinearFactor(new THREE.Vector3(0, 0, 0))
        zombies[m].mesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
        //zombiemeshes[m] = zombies[m].mesh;
        zombies[m].mesh.position.set((Math.random() - 0.6) * 4800 - 1000, 100, (Math.random() - 0.6) * 4800 - 1000)
        scene.add(zombies[m].mesh)
        zombies[m].mesh.setCcdMotionThreshold(20);
        zombies[m].mesh.setCcdSweptSphereRadius(0.2);
        zombies[m].mesh.addEventListener('collision', function (obj, vel, ang, contNorm) {
            if (obj.name == 'zombie') {
                zombies[m].mesh.junto = true
            }
            if(obj.name == 'balaJ'){
                zombies[m].mesh.rage = true
            }
        })

    }
    /*for (let n = 0; n < zombies.length; n += 1) {
        
    }  */
}
addComida = function () {
    let final = new comida()
    final.mesh.position.set(3900,100,-3900)
    scene.add(final.mesh) 
    /*for (let n = 0; n < zombies.length; n += 1) {
        
    }  */
}
jogador = function () {
    this.geometria = new THREE.SphereGeometry(60, 32, 32);
    this.material = Physijs.createMaterial(new THREE.MeshBasicMaterial())
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 999)
    this.mesh.vida = 100
    this.mesh.alive = true
    this.mesh.name = 'jogador'
}
disparoAutomatico = function () {
    if (rPressionado) {
        if (frame % 15 == 0) {
            bala = new balaJ

            bala.mesh.position.set(camera.position.x, camera.position.y - 10, camera.position.z)

            if (balasJ.length < 4 && r !== 4) {
                balasJ[r] = bala.mesh;
                scene.add(balasJ[r])
                movimentoBalaJogador(balasJ[r])
                fixarMovimentoBalaJogador(balasJ[r])
                tirarVidaBalaJogador(balasJ[r])
                r += 1
            } else {
                if (r < 3) {
                    scene.remove(balasJ[r + 1])
                }
                balasJ[r] = bala.mesh;
                scene.add(balasJ[r])
                movimentoBalaJogador(balasJ[r])
                tirarVidaBalaJogador(balasJ[r])
                fixarMovimentoBalaJogador(balasJ[r])
                r += 1
            }
            if (r === 4) {
                r = 0
                scene.remove(balasJ[0])
            }

        }

    }

}
movimentoBalaJogador = function (objeto) {
    direcao = controls.getDirection(new THREE.Vector3(0, 0, 0))
    objeto.setLinearFactor(new THREE.Vector3(0, 0, 0))
    objeto.setLinearVelocity(new THREE.Vector3(direcao.x * 25000, direcao.y * 25000, direcao.z * 25000))

}
fixarMovimentoBalaJogador = function (obj) { // aka 'MOTION CLAMPING'
    obj.setCcdMotionThreshold(1);
    obj.setCcdSweptSphereRadius(0.2);
}
tirarVidaBalaJogador = function (objeto) {
    objeto.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {
        if (objCollidedWith.name === 'zombie') {
            if (objCollidedWith.alive === true) {
                if (objCollidedWith.vida > 0) {
                    objCollidedWith.vida -= 10
                    if (objCollidedWith.vida === 0) {
                        objCollidedWith.alive = false
                        deadZombies += 1;
                        scene.remove(objCollidedWith)
                    }
                }

            }

        }
    })

}
limitarMovJogador = function () {

    if (camera.position.x < 3950 && camera.position.x > -3950 && camera.position.z < 3950 && camera.position.z > -3950 /*&& camera.position.y > 100*/ && controls.isLocked) {
        if (sprint == false) {
            velocidadeJogador = 7000
        } else {
            velocidadeJogador = 15000
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
    if (camera.position.x > -3000 && camera.position.x < 4000 && camera.position.z < 2100 && camera.position.z > 2050) {
        camera.position.z += 50
    }
    if (camera.position.x > -3000 && camera.position.x < 4000 && camera.position.z < 1950 && camera.position.z > 1900) {
        camera.position.z -= 50
    }
    if (camera.position.x > -4000 && camera.position.x < 3000 && camera.position.z > 50 && camera.position.z < 100) {
        camera.position.z += 50
    }
    if (camera.position.x > -4000 && camera.position.x < 3000 && camera.position.z < -50 && camera.position.z > -100) {
        camera.position.z -= 50
    }
    if (camera.position.x > -3000 && camera.position.x < 4000 && camera.position.z > -1950 && camera.position.z < -1900) {
        camera.position.z += 50
    }
    if (camera.position.x > -3000 && camera.position.x < 4000 && camera.position.z > -2100 && camera.position.z < -2050) {
        camera.position.z -= 50
    }

    // if (camera.position.y <= 100) {
    //     camera.position.y = 100.00001
    // }

}
limparVelocidades = function () {
    velocityJ.x = 0
    velocityJ.y = 0
    velocityJ.z = 0
    delta = 0
    moveDir = false, moveEsq = false, moveFrente = false, moveTras = false, moveCima = false, moveBaixo = false;
}
limparMapa = function () {
    for (n = 0; n < zombies.length; n += 1) {
        if (zombies[n].mesh.alive) {
            zombies[n].aSeguir(false)
            scene.remove(zombies[n].mesh)

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
obterDirecao = function (fonte, destino) {
    direcao = new THREE.Vector3(destino.position.x - fonte.position.x, destino.position.y - fonte.position.y, destino.position.z - fonte.position.z);
    return direcao;
}
onKeyDown = function (e) {
    switch (e.keyCode) {
        case 81:
            limparVelocidades()
            pontos = 0;
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
            break;
        case 70:
            console.log(camera.position.z + model.position.z)
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
movimentoInimigos = function () {
    for (n = 0; n < zombies.length; n += 1) {

        if (zombies[n].mesh.alive) {

            distanciaJ = new THREE.Vector3(controls.getObject().position.x - zombies[n].mesh.position.x, controls.getObject().position.y - zombies[n].mesh.position.y, controls.getObject().position.z - zombies[n].mesh.position.z)
            // for(i=0;i<paredesInterior.length;i +=1){
            //     distanciaP = new THREE.Vector3(controls.getObject().position.x - zombies[n].mesh.position.x, controls.getObject().position.y - zombies[n].mesh.position.y, controls.getObject().position.z - zombies[n].mesh.position.z)
            // }
            if ((distanciaJ.x < 1000 && distanciaJ.z < 1000) || zombies[n].mesh.rage == true) {
                zombies[n].mesh.direcao = obterDirecao(zombies[n].mesh, controls.getObject())
                zombies[n].aSeguir(true);
                zombies[n].mesh.__dirtyPosition = true;
                if (zombies[n].mesh.position.x > -3000 && zombies[n].mesh.position.x < 4000 && zombies[n].mesh.position.z < 2100 && zombies[n].mesh.position.z > 2050) {
                    zombies[n].mesh.position.z += 1500
                }
                if (zombies[n].mesh.position.x > -3000 && zombies[n].mesh.position.x < 4000 && zombies[n].mesh.position.z < 1950 && zombies[n].mesh.position.z > 1900) {
                    zombies[n].mesh.position.z -= 1500
                }
                if (zombies[n].mesh.position.x > -4000 && zombies[n].mesh.position.x < 3000 && zombies[n].mesh.position.z > 70 && zombies[n].mesh.position.z < 120) {
                    zombies[n].mesh.position.z += 1500
                }
                if (zombies[n].mesh.position.x > -4000 && zombies[n].mesh.position.x < 3000 && zombies[n].mesh.position.z < -70 && zombies[n].mesh.position.z > -120) {
                    zombies[n].mesh.position.z -= 1500
                }
                if (zombies[n].mesh.position.x > -3000 && zombies[n].mesh.position.x < 4000 && zombies[n].mesh.position.z > -1950 && zombies[n].mesh.position.z < -1900) {
                    zombies[n].mesh.position.z += 1500
                }
                if (zombies[n].mesh.position.x > -3000 && zombies[n].mesh.position.x < 4000 && zombies[n].mesh.position.z > -2100 && zombies[n].mesh.position.z < -2050) {
                    zombies[n].mesh.position.z -= 1500
                }
                if (zombies[n].mesh.junto == false) {
                    zombies[n].mesh.position.x += zombies[n].mesh.direcao.x * delta
                    zombies[n].mesh.position.z += zombies[n].mesh.direcao.z * delta
                } else {

                    zombies[n].mesh.position.x -= zombies[n].mesh.direcao.x * delta
                    zombies[n].mesh.position.z -= zombies[n].mesh.direcao.z * delta
                    zombies[n].mesh.junto = false
                }


            } else {
                zombies[n].aSeguir(false);
            }
        }
    }

}
verificarZona = function () {
    if (camera.position.x > -2000 && camera.position.x < 4000 && camera.position.z > 2050) {
        meshesZonas[0].material.color.set(red)
        posBig.x = -3900
        posBig.z = 3000
        return true
    } else if (camera.position.x > -4000 && camera.position.x < 2000 && camera.position.z < 1950 && camera.position.z > 0) {
        meshesZonas[1].material.color.set(red)
        posBig.x = 3900
        posBig.z = 1000
        return true
    } else if (camera.position.x > -2000 && camera.position.x < 4000 && camera.position.z < 0 && camera.position.z > -2000) {
        meshesZonas[2].material.color.set(red)
        posBig.x = -3900
        posBig.z = -1000
        return true
    } else if (camera.position.x > -4000 && camera.position.x < 2000 && camera.position.z < -2000) {
        meshesZonas[3].material.color.set(red)
        posBig.x = 3900
        posBig.z = -3000
        return true

    } else {
        for (let j = 0; j < 4; j += 1) {
            meshesZonas[j].material.color.set(green)
        }
        return false
    }



}