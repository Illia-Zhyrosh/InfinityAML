import { Box3, Ray } from 'three';
import * as THREE from './three/build/three.module.js';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { ColladaLoader } from './three/examples/jsm/loaders/ColladaLoader.js';

function init() {
    const cont = document.getElementById('canv');
    var objectsCount = 0;
    var width = cont.clientWidth;
    var height = cont.clientHeight;
    var scene = new THREE.Scene();
    const loader = new ColladaLoader();
    var camera = new THREE.PerspectiveCamera(60, width / height, 0.5, 100);
    
    var renderer = new THREE.WebGLRenderer({
        antialias: false
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    
    //Resizing renderer when window size changed;
    function resize() {
        if (cont.clientHeight  < height) {
            height = (cont.clientHeight);
        }
        else if (cont.clientWidth < width) {
            width = (cont.clientWidth);
        }
        else {
            width = cont.clientWidth;
            height = cont.clientHeight;
        }
        renderer.setSize(width, height);
        renderer.setPixelRatio(devicePixelRatio);
        box = renderer.domElement.getBoundingClientRect();
        camera.updateProjectionMatrix();
        camera.aspect = width / height;
    }
    
    
    resize();
    const axisHelper = new THREE.AxesHelper(planeH);
    scene.add(axisHelper);
    var gbModelName;
    const rendererDom = renderer.domElement;
    rendererDom.className += 'renderer';
    
    cont.appendChild(rendererDom);
    scene.background = new THREE.Color('White');
    camera.position.set(6, 6, 0);
    camera.lookAt(0, 0, 0);
    //Grid peculiarities
    var numW = 16;
    var numH = 16;
    var planeW = 32;
    var planeH = 32;
    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(planeW , planeH , numW, numH),
        new THREE.MeshBasicMaterial(
            {
                color: new THREE.Color('White'),
                side: THREE.DoubleSide,
                wireframe: false,
                visible: false,
                
            })
    );
    plane.geometry.frustumCulled = false;
    plane.rotateX(Math.PI / 2);
    plane.name = 'Grid';
    scene.add(plane);
   
    const gridHelper = new THREE.GridHelper(planeW, planeH, new THREE.Color('Black'), new THREE.Color('DarkGray'));
    gridHelper.geometry.computeBoundingBox();
    gridHelper.frustumCulled = false;
    gridHelper.position.set(0.00001, 0, 0.00001);
    
    scene.add(gridHelper);
    
    const highlightMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.90, 0.90),
        new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: new THREE.Color('Red')
        })
    );
    highlightMesh.rotateX(Math.PI / 2);
    highlightMesh.position.set(0.5, 0, 0.5);
    // Square highlighting 
    var mousePos = new THREE.Vector2();
    var rayCaster = new THREE.Raycaster();
    rayCaster.ray.origin.set(camera.getWorldPosition);
    rayCaster.ray.direction.set(camera.getWorldDirection);
    rayCaster.params.Points.threshold = 0.00001;
    var box = renderer.domElement.getBoundingClientRect();
    var xpos;
    var ypos;
    var zpos;
    function Placement(modelName) {
        
        highlightMesh.position.set(0.5, 0, 0.5);
        scene.add(highlightMesh);
        var intersection;
        var highlighterPos;
        
        console.log(box);
        cont.addEventListener('mousemove', function (e) {
            
            mousePos.x = ((e.clientX - box.left) / box.width) * 2 - 1;
            mousePos.y = - ((e.clientY - box.top) / box.height) * 2 + 1;
            
            
            rayCaster.setFromCamera(mousePos, camera);
            intersection = rayCaster.intersectObjects(scene.children);
            intersection.forEach(function (intersect) {
                if (intersect.object.name === 'Grid') {
                    highlightMesh.visible = true;
                    //console.log(mousePos.x + ' ' + mousePos.y);
                    highlighterPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
                    //console.log(highlighterPos.x + ' ' + highlighterPos.z);
                    highlightMesh.position.set(highlighterPos.x, 0, highlighterPos.z);
                }
                if (intersect.object.name === 'Added') {
                    highlightMesh.visible = false;
                }
                if (intersect.object.name === 'Hitbox') {
                    highlightMesh.visible = false;
                }
            });
            ClickingEvent(modelName);
        })
        
    }
    
    var butt = document.getElementById('boxButt');
    var hitboxes = true;
    butt.addEventListener('click', function () {
        scene.children.forEach(function (child) {
            if (child.name == 'Hitbox' && hitboxes == true) {
                child.visible = false;
                
            }
            else if (child.name == 'Hitbox' && hitboxes == false) {
                child.visible = true;
                
                
            }
        })
        if (hitboxes == true) {
            hitboxes = false;
            
            butt.style.color = 'green';
            butt.innerHTML = 'Enable bounding boxes'
            butt.style.width = '100%';
        }
        else {
            hitboxes = true;
            butt.style.color = 'red';
            butt.innerHTML = 'Disable bounding boxes'
            butt.style.width = '100%';
        }

        
    })
    function ClickingEvent(modelName) {
        if (scene.children.includes(highlightMesh)) {
            cont.addEventListener('click', function (e) {
                if (highlightMesh.visible === true && scene.children.includes(highlightMesh) && modelName != "") {
                    var highlighterBox = new Box3().setFromObject(highlightMesh);
                    
                    var highlightHelper = new THREE.Box3Helper(highlighterBox, 0xff0000);
                    highlightHelper.name = 'Hitbox';
                    if (hitboxes) {
                        highlightHelper.visible = true;
                    }
                    else {
                        highlightHelper.visible = false;
                    }
                    scene.add(highlightHelper);
                    
                    e.stopImmediatePropagation();
                    highlightMesh.visible == false;
                    scene.remove(highlightMesh);
                    
                    var modelPath = "./wwwroot/3dmodels/"
                        + gbModelName.replaceAll(' ', '') + '.dae';

                    fetch(modelPath, { mode: 'cors' }).then(response => {
                        loader.load(response.url, function (loaded) {
                            var model = loaded.scene;
                            model.name = 'Added';
                            xpos = highlightHelper.position.x;
                            ypos = 0;
                            zpos = highlightHelper.position.z;
                            model.position.set(xpos, ypos, zpos);
                            model.castShadow = true;
                            model.recieveShadpw = true;
                            model.scale.set(0.5, 0.5, 0.5);
                            if (modelPath == './wwwroot/3dmodels/Viper650.dae') {
                                model.rotateX(Math.PI / 2);
                            }

                            var helper = new THREE.Box3().setFromObject(model);

                            const boxHelper = new THREE.Box3Helper(helper, 0xff0000);
                            boxHelper.name = 'Hitbox';
                            
                            scene.remove(highlightMesh);
                            scene.add(model);
                            scene.add(boxHelper);
                            if (hitboxes) {
                                boxHelper.visible = true;
                            }
                            else {
                                boxHelper.visible = false;
                            }
                            
                            modelPath = "";
                            modelName = "";
                        })
                    });
                    gbModelName = "";
                }
            })
        }
    }


    //ItemFinder
    $('#tree').children().each(function () {

        var items = document.getElementsByClassName('itemSelectable');
        $(items).each(function () {
            
            this.addEventListener('click', function () {
                gbModelName = $(this).text();
                (Placement(gbModelName)); 
                
            });
        })
    });
    
            
        
    const clearButt = document.getElementById('clearData');
    clearButt.addEventListener('click', function () {
        highlightMesh.visible = false;
        var children = scene.children;
        $(children).each(function () {
            if (this.name === 'Added') {
                scene.remove(this);
            }
            if (this.name === 'Hitbox') {
                scene.remove(this);
            }
        })
        objectsCount = 0;
        localStorage.setItem('3dobjectCount', objectsCount);
        scene.remove(highlightMesh);
    });
    
    

    
    let resized = false;
    //Adding ambient lighting
    const pointLight = new THREE.AmbientLight(0x404040);
    scene.add(pointLight);
    // Camera movement
    const control = new OrbitControls(camera, renderer.domElement);
    control.enableDamping = true;
    control.maxPolarAngle = Math.PI / 8;
    control.minDistance = 6.3;
    control.maxDistance = 16;
    //Resizing events
    window.addEventListener('resize', function () {
        resized = true;
        
    })
    function animate() {
        if (resized) { resize(); }
        requestAnimationFrame(animate);
        control.update();
        localStorage.setItem('3dobjectCount', objectsCount);
        renderer.render(scene, camera);

    }
    
    
    animate();
};

init();



