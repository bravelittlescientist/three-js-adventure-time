var controller = {
    "scene"     : null,
    "camera"    : null,
    "renderer"  : null,
    "sphere"    : null,
    "cube"      : null,
};

function init() {
    // Load scene, camera, renderer
    createScene();
}

init();

// render
// A three-js render loop; draws 60x/s
function render() {
    // Render scene
    window.requestAnimationFrame(render);

    // Animation Starts
    
    controller["sphere"].rotation.x += 0.1; 
    controller["sphere"].rotation.y += 0.1;

    // Animation Ends

    controller["renderer"].render(
        controller["scene"],
        controller["camera"]);

} 
render();


// createScene
// Loads a THREE.js scene, perspective camera, and renderer into canvas.
// Currently adds a sphere
function createScene () {
    controller["scene"] = new THREE.Scene(); 
    controller["camera"] = new THREE.PerspectiveCamera( 
        45, window.innerWidth / window.innerHeight, 0.1, 10000
    );  
    controller["renderer"] = new THREE.WebGLRenderer(); 
    controller["renderer"].setSize( window.innerWidth, window.innerHeight );  
    controller["camera"].position.z = 300;
    document.body.appendChild( controller["renderer"].domElement );
   
    var geo = new THREE.SphereGeometry(
        50, 
        16, 
        16  
    );
    var mat = new THREE.MeshLambertMaterial( { color: 0x00FF00 } );
    controller["sphere"] = new THREE.Mesh(
        geo, mat
    );
    controller["sphere"].geometry.dynamic = true;
    controller["sphere"].geometry.verticesNeedUpdate = true;
    controller["sphere"].geometry.normalsNeedUpdate = true;
    controller["scene"].add( controller["sphere"] );

    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.x = 10;
    pointLight.position.y = 10;
    pointLight.position.z = 130;
    controller["scene"].add( pointLight );
}
