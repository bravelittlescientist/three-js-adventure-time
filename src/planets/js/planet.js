var controller = {
    "scene"     : null,
    "camera"    : null,
    "renderer"  : null,
    "sphere"    : null,
    "cube"      : null,
};

// Sun radius in km, 1 R
var sun = {
    "radius" : 695500
}

// Planet radii, distances, masses in km
var bodies_data = {
    "mercury"   : {
        "radius"    : 2439.7,
        "fromSun"   : 57909227
    },
    "venus"     : {
        "radius" : 6051.8,
        "fromSun" : 108209475
    },
    "earth"     : {
        "fromSun" : 149598262,
        "radius" : 6371
    },
    "mars"      : {
        "radius" : 3389.5,
        "fromSun" : 227943824
    },
    "jupiter"   : {
        "fromSun" : 778340821,
        "radius" : 69911
    },
    "saturn"    : {
        "fromSun" : 1426666422,
        "radius" : 58232
    },
    "uranus"    : {
        "fromSun" : 2870658186,
        "radius" : 25362
    },
    "neptune"   : {
        "fromSun" : 4498396441,
        "radius" : 24622
    }
};

var bodies = {};

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
   
    sun["display"].rotation.x += 10;
    sun["display"].rotation.y += 10;

    var multiplier = 1;
    for (body in bodies) {
        bodies[body].position.x = Math.floor((Math.random()*window.innerWidth) - window.innerWidth/2);
        bodies[body].position.z = Math.floor((Math.random()*100) - 50);
        multiplier += 1;
    }



    // Animation Ends

    controller["renderer"].render(
        controller["scene"],
        controller["camera"]);

} 
render();


// createPlanets
// Initializes planets of relatively correct size
function createBodies() {
    // Compute total solar system size [NAIVE]
    var naiveSolarSystemWidth = sun["radius"]*2 + 200;
    for (planet in bodies_data) {
        naiveSolarSystemWidth += 2*bodies_data[planet]["radius"] + 100;
    }

    // Create sun
    sun["display"] = new THREE.Mesh(
        new THREE.SphereGeometry(
            (sun["radius"]/5)*(window.innerWidth/naiveSolarSystemWidth),
            40,
            40
        ),
        new THREE.MeshLambertMaterial( { color : 0xFFB00F } )
    );
    sun["display"].position.x = 0;
    sun["display"].position.y = 0;
    sun["display"].position.z = 0;
    controller["scene"].add(sun["display"]);
    var sunPL = new THREE.PointLight(0xFFFFFF);
    sunPL.position.x = 10;
    sunPL.position.y = 10;
    sunPL.position.z = 530;
    controller["scene"].add( sunPL );

    // Create planets
    var counter = 1;
    for (planet in bodies_data) {
        var displayRadius = bodies_data[planet]["radius"]*(window.innerWidth/naiveSolarSystemWidth)
        bodies[planet] = new THREE.Mesh(
            new THREE.SphereGeometry(
                displayRadius/5,
                16,
                16
            ),
            new THREE.MeshLambertMaterial( { color : 0x00FF00 } )
        );
        bodies[planet].position.x = counter * 100;// -window.innerWidth/2 + sun["radius"]*2 + 600;
        controller["scene"].add( bodies[planet] );
        counter += 1;
    }
}


// createScene
// Loads a THREE.js scene, perspective camera, and renderer into canvas.
// Currently adds a sphere
function createScene () {
    controller["scene"] = new THREE.Scene(); 
    controller["camera"] = new THREE.PerspectiveCamera( 
        45, window.innerWidth / window.innerHeight, 1, 10000
    );  
    controller["renderer"] = new THREE.WebGLRenderer(); 
    controller["renderer"].setSize( window.innerWidth, window.innerHeight );  
    controller["camera"].position.z = 1000;
    document.body.appendChild( controller["renderer"].domElement );
   
    createBodies();
    /*var geo = new THREE.SphereGeometry(
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
    controller["scene"].add( controller["sphere"] );*/

    var ambientLight = new THREE.AmbientLight(0xFFFFFF);
    //controller["scene"].add(ambientLight);

    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.x = 10;
    pointLight.position.y = 10;
    pointLight.position.z = 130;
    controller["scene"].add( pointLight );
}
