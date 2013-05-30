var controller = {
    "scene"     : null,
    "camera"    : null,
    "renderer"  : null,
    "sphere"    : null,
    "cube"      : null,
};

// Sun radius in km, 1 R
var sun = {
    "radius" : 695500,
    "texture" : "img/sun.jpg"
}

var rings = {
    "saturn" : null,
    "uranus" : null
};

// Planet radii, distances, masses in km
var bodies_data = {
    "mercury"   : {
        "toy_radius": 24,
        "toy_x"     : -600,
        "toy_y"     : -175,
        "radius"    : 2439.7,
        "fromSun"   : 57909227,
        "texture"   : "img/mercury.jpg"
    },
    "venus"     : {
        "toy_radius": 60,
        "toy_x"     : -450,
        "toy_y"     : -200,
        "radius" : 6051.8,
        "fromSun" : 108209475,
        "texture"   : "img/venus.jpg"
    },
    "earth"     : {
        "toy_radius": 63,
        "toy_x"     : -300,
        "toy_y"     : -100,
        "fromSun" : 149598262,
        "radius" : 6371,
        "texture"   : "img/earth.jpg"
    },
    "mars"      : {
        "toy_radius": 33,
        "toy_x"     : -200,
        "toy_y"     : -50,
        "radius" : 3389.5,
        "fromSun" : 227943824,
        "texture"   : "img/mars.jpg"
    },
    "jupiter"   : {
        "toy_radius": 200,
        "toy_x"     : 100,
        "toy_y"     : 100,
        "fromSun" : 778340821,
        "radius" : 69911,
        "texture"   : "img/jupiter.jpg"
    },
    "saturn"    : {
        "toy_radius": 150,
        "toy_x"     : 400,
        "toy_y"     : -200,
        "fromSun" : 1426666422,
        "radius" : 58232,
        "texture"   : "img/saturn.jpg"
    },
    "uranus"    : {
        "toy_radius": 120,
        "toy_x"     : 500,
        "toy_y"     : 150,
        "fromSun" : 2870658186,
        "radius" : 25362,
        "texture"   : "img/uranus.jpg"
    },
    "neptune"   : {
        "toy_radius": 110,
        "toy_x"     : 700,
        "toy_y"     : -100,
        "fromSun" : 4498396441,
        "radius" : 24622,
        "texture"   : "img/neptune.jpg"
    }
};

var bodies = {};

init();

// render
// A three-js render loop; draws 60x/s
function render() {
    // Render scene
    window.requestAnimationFrame(render);

    // Animation Starts
   
    sun["display"].rotation.x += 0.01;
    sun["display"].rotation.y += 0.01;

    var multiplier = 1;

    for (body in bodies) {
        bodies[body].rotation.x += 0.01;
        bodies[body].rotation.y += 0.01;
        
        //bodies[body].position.x = Math.floor((Math.random()*window.innerWidth) - window.innerWidth/2);
        //bodies[body].position.z = Math.floor((Math.random()*100) - 50);
        multiplier += 1;
    }

    rings["uranus"].rotation.x += 0.01;
    rings["uranus"].rotation.z += 0.01;
    rings["saturn"].rotation.x += 0.01;
    rings["saturn"].rotation.y -= 0.01;
    
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
    var sunTexture = THREE.ImageUtils.loadTexture( sun["texture"] );
    var sunMaterial = new THREE.MeshBasicMaterial( { map: sunTexture } );
    var adjustment = window.innerWidth/naiveSolarSystemWidth * sun["radius"]/2;
    sun["display"] = new THREE.Mesh(
        new THREE.SphereGeometry(
            adjustment,
            40,
            40
        ),
        sunMaterial
    );
    sun["display"].position.set(-1 * window.innerWidth/2 - 200, -1 * window.innerHeight/2 + 50 - 200, 0);
    
    controller["scene"].add(sun["display"]);
    var sunPL = new THREE.PointLight(0xFFFFFF);
    sunPL.position.x = window.innerWidth/2*-1;
    sunPL.position.y = 10;
    sunPL.position.z = 1050;
    controller["scene"].add( sunPL );

    // Create planets and rings
    var counter = 1;
    var placeholder = (-1*window.innerWidth/2) + adjustment + 25;

    // Saturn's Rings
    var saturnRingTexture = THREE.ImageUtils.loadTexture( "img/saturnrings.jpg" );
    var uranusRingTexture = THREE.ImageUtils.loadTexture( "img/uranusrings.jpg" );
    var saturnRingMaterial = new THREE.MeshLambertMaterial( { map : saturnRingTexture } );
    var uranusRingMaterial = new THREE.MeshLambertMaterial( { map : uranusRingTexture } );

    rings["saturn"] = new THREE.Mesh(
        new THREE.CylinderGeometry(175,175,2,50,50,false), 
        saturnRingMaterial
    );
    rings["saturn"].overdraw = true;
    rings["uranus"] = new THREE.Mesh(
        new THREE.CylinderGeometry(135, 135, 2, 50, 50, false),
        uranusRingMaterial
    );
    rings["uranus"].overdraw = true;

    for (planet in bodies_data) {
        var planetTexture = THREE.ImageUtils.loadTexture( bodies_data[planet]["texture"] );
        var planetMaterial = new THREE.MeshLambertMaterial( { map: planetTexture } );
        var displayRadius = bodies_data[planet]["radius"]*(window.innerWidth/naiveSolarSystemWidth)
        bodies[planet] = new THREE.Mesh(
            new THREE.SphereGeometry(
                bodies_data[planet]["toy_radius"],
                bodies_data[planet]["toy_radius"]/2,
                bodies_data[planet]["toy_radius"]/2
            ),
            planetMaterial
        );
        bodies[planet].position.x = bodies_data[planet]["toy_x"];
        bodies[planet].position.y = bodies_data[planet]["toy_y"];
        //(counter * 150) + placeholder;// -window.innerWidth/2 + sun["radius"]*2 + 600;
        
        if (rings.hasOwnProperty(planet)) {
            rings[planet].position.x = bodies_data[planet]["toy_x"];
            rings[planet].position.y = bodies_data[planet]["toy_y"];
        }
        
        controller["scene"].add( bodies[planet] );
        counter += 1;
    }

    controller["scene"].add(rings["saturn"]);
    controller["scene"].add(rings["uranus"]);
}


// createScene
// Loads a THREE.js scene, perspective camera, and renderer into canvas.
// Currently adds a sphere
function init () {

    // Scene
    controller["scene"] = new THREE.Scene(); 
    
    // Camera
    controller["camera"] = new THREE.PerspectiveCamera( 
        45, window.innerWidth / window.innerHeight, 0.1, 20000
    );  
    controller["camera"].position.set(0, 150, 1000);
    controller["camera"].lookAt(controller["scene"].position);

    // Renderer
    controller["renderer"] = new THREE.WebGLRenderer(); 
    controller["renderer"].setSize( window.innerWidth, window.innerHeight );  
    document.body.appendChild( controller["renderer"].domElement );
  
    // Light Sources and Starfield
    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.set(0, 150, 100);
    controller["scene"].add( pointLight );
    
    createBodies();
}
