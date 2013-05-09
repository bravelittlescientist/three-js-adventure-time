// This controller will handle some of our global elements.
var controller = {
    "scene"     : null,
    "camera"    : null,
    "renderer"  : null,
    "cube"      : null
};

initialize();

// onTicTacToeLoad
// Loads data and prepares scene
function initialize() {
    // Load TicTactToe endgame dataset
    var endgames = loadTicTacToeData();

    // Load scene, camera, renderer, tic tac toe grid
    createScene();
    createGrid();
}

// render
// A three-js render loop; draws 60x/s
function render() {
    requestAnimationFrame(render);

    // Animation Starts
    
    controller["cube"].rotation.x += 0.1; 
    controller["cube"].rotation.y += 0.1;
   
    // Animation Ends

    controller["renderer"].render(
            controller["scene"],
            controller["camera"]);
} render();

// loadTicTacToeData
// loads datafile from data/tic-tac-toe.data.txt
//
// @returns endgames [ARRAY of ARRAYS of STRINGS], with each
// subarray containing 10 elements: the first nine configurations
// {x, o, b}, and the final {positive, negative} 
function loadTicTacToeData() {
    // Load data
    var data = [];
    var loadTTT = new XMLHttpRequest();
    loadTTT.onreadystatechange = function() {
        if (loadTTT.readyState === 4) {
        }
    };
    loadTTT.open("GET", "data/tic-tac-toe.data.txt", false);
    loadTTT.send();

    // Parse data except for hanging newline
    var text = loadTTT.responseText.split("\n");
    text.pop();
    for (var row = 0; row < text.length; row++) {
        data.push(text[row].split(","));
    }
    return data;
}

// createScene
// Loads a THREE.js scene, perspective camera, and renderer into canvas.
// Currently adds a cube, for learning purposes.
function createScene () {
    controller["scene"] = new THREE.Scene(); 
    controller["camera"] = new THREE.PerspectiveCamera( 
            75, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
    controller["renderer"] = new THREE.WebGLRenderer(); 
    controller["renderer"].setSize( window.innerWidth, window.innerHeight ); 
    document.body.appendChild( controller["renderer"].domElement );
    
    var geometry = new THREE.CubeGeometry(1,1,1); 
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); 
    controller["cube"] = new THREE.Mesh( geometry, material ); 
    controller["scene"].add( controller["cube"] ); 
    controller["camera"].position.z = 5;
}

// createGrid
// Prepares a tic tac toe grid for gameplay.
function createGrid() {}
