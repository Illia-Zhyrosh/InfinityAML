import * as THREE from './three/build/three.module.js';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { ColladaLoader } from './three/examples/jsm/loaders/ColladaLoader.js';

function init() {
    const cont = document.getElementById('canv');
    var width = cont.clientWidth - 50;
    var height = cont.clientHeight - 50;
    var scene = new THREE.Scene();
    const loader = new ColladaLoader();
    var camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 500);
   
    var renderer = new THREE.WebGLRenderer({
        antialias: false
    });
    //Resizing renderer when window size changed;
    function resize() {
        if (window.innerHeight / 2 < height) {
            height = (window.innerHeight / 2) - 50;
        }
        else if (window.innerWidth / 2 < width) {
            width = (window.innerWidth / 2) - 50;
        }
        else {
            width = cont.clientWidth - 50;
            height = cont.clientHeight - 50;
        }
        renderer.setSize(width, height);
        renderer.setPixelRatio(1);
    }
    
    
    resize();
    const axisHelper = new THREE.AxesHelper(planeH);
    scene.add(axisHelper);

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
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: new THREE.Color('Red')
        })
    );
    highlightMesh.rotateX(Math.PI / 2);
    // Square highlighting 
    function Placement() {
        
        
        
        highlightMesh.position.set(0.5, 0, 0.5);
        scene.add(highlightMesh);
        const mousePos = new THREE.Vector2();
        const rayCaster = new THREE.Raycaster();
        
        let intersection;
        var highlighterPos;
        cont.addEventListener('mousemove', function (e) {
            const x = e.clientX - cont.getBoundingClientRect().left;
            const y = e.clientY - cont.getBoundingClientRect().top;
            
            mousePos.x = (x / cont.clientWidth) * 2 - 1;
            mousePos.y = - (y / cont.clientHeight) * 2 + 1;
            //console.log(mousePos);
            rayCaster.setFromCamera(mousePos, camera);
            intersection = rayCaster.intersectObjects(scene.children);
            intersection.forEach(function (intersect) {
                if (intersect.object.name === 'Grid') {
                    highlighterPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
                    highlightMesh.position.set(highlighterPos.x, 0, highlighterPos.z);
                }
            });
        });
        $(cont).one('click', function () {
            loadMod();
            
        });
        //Loading model and placing it in place of highlighter
        function loadMod() {
            var xpos = highlighterPos.x;
            var ypos = 0;
            var zpos = highlighterPos.z;
            console.log(highlightMesh.position.x + ' ' + highlightMesh.position.y + ' ' + highlightMesh.position.z);
            console.log(xpos + ' ' + ypos + ' ' + zpos);
           

            var modelPath = fetch('./wwwroot/models/Av650.dae', { mode: 'cors' }).then(response => {
                loader.load(response.url, function (loaded) {
                    var model = loaded.scene;
                    model.name = 'Added';
                    model.position.set(xpos, ypos, zpos);
                    model.scale.set(0.5, 0.5, 0.5);
                    model.rotateX(Math.PI / 2);
                    scene.add(model);
                })
                
                
            }
            );
            
            
            
            
            scene.remove(highlightMesh);
            
            
            
        }
       
        
    }
    


    //TODO make function to add selectable models;

    //ItemFinder
    $('#tree').children().each(function () {

        var items = document.getElementsByClassName('itemSelectable');
        $(items).each(function () {
            ($(this).click(Placement));
        })
    });
    
            
        
    const clearButt = document.getElementById('clearData');
    clearButt.addEventListener('click', function () {

        var children = scene.children;
        $(children).each(function () {
            if (this.name === 'Added') {
                scene.remove(this);
            }
        })

    });
    
    

    
    let resized = false;
    //Adding ambient lighting
    const pointLight = new THREE.AmbientLight(0x404040);
    scene.add(pointLight);
    // Camera movement
    const control = new OrbitControls(camera, renderer.domElement);
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
        
        renderer.render(scene, camera);

    }
    
    
    animate();
};

init();



