// Global variables
var scene, camera, renderer, controls;
var keyboard = new THREEx.KeyboardState();
var container = document.getElementById('container');

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
        "toy_x"     : 600,
        "toy_y"     : -200,
        "fromSun" : 1426666422,
        "radius" : 58232,
        "texture"   : "img/saturn.jpg"
    },
    "uranus"    : {
        "toy_radius": 120,
        "toy_x"     : 600,
        "toy_y"     : 150,
        "fromSun" : 2870658186,
        "radius" : 25362,
        "texture"   : "img/uranus.jpg"
    },
    "neptune"   : {
        "toy_radius": 110,
        "toy_x"     : 300,
        "toy_y"     : 400,
        "fromSun" : 4498396441,
        "radius" : 24622,
        "texture"   : "img/neptune.jpg"
    }
};

var bodies = {};

// Initializaton and animation
init();
animate();

function init () {

    // Scene
    scene = new THREE.Scene(); 
    
    // Camera
    camera = new THREE.PerspectiveCamera( 
        45, window.innerWidth / window.innerHeight, 0.1, 20000
    );  
    camera.position.set(window.innerHeight/2 * -1, 500, 1000);
    camera.lookAt(scene.position);

    // Planet View Controls
	// move mouse and: left   click (or hold 'A') to rotate, 
	//                 middle click (or hold 'S') to zoom, 
	//                 right  click (or hold 'D') to pan
	controls = new THREE.TrackballControls( camera );

    // Renderer
    renderer = new THREE.WebGLRenderer({antialias : true}); 
    renderer.setSize( window.innerWidth, window.innerHeight );  
    container.appendChild( renderer.domElement );
  
    // Light Sources and Starfield
    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.set(0, 150, 100);
    scene.add( pointLight );
    
    // Starfield example, source: Japh(r)
    var stars = new THREE.Geometry();
    for (var i = 0; i < 1000; i++) {
        stars.vertices.push(
            new THREE.Vector3(
                1e3 * Math.random() - 5e2,
                1e3 * Math.random() - 5e2,
                -1e2
            )
        );
    }
    var starMaterial = new THREE.ParticleBasicMaterial();
    starfield = new THREE.ParticleSystem(stars, starMaterial);
    scene.add( starfield );

    // Create planetary bodies
    createBodies();
}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
	controls.update();
}

function render() 
{	
    sun["display"].rotation.x += 0.01;
    sun["display"].rotation.y += 0.01;

    for (body in bodies) {
        bodies[body].rotation.x += 0.01;
        bodies[body].rotation.y += 0.01;

        //.position.x,y,z
    }

	renderer.render( scene, camera );
}

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
    
    scene.add(sun["display"]);
    var sunPL = new THREE.PointLight(0xFFFFFF);
    sunPL.position.x = window.innerWidth/2*-1;
    sunPL.position.y = 10;
    sunPL.position.z = 1050;
    scene.add( sunPL );

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
        
        scene.add( bodies[planet] );
        counter += 1;
    }

    scene.add(rings["saturn"]);
    scene.add(rings["uranus"]);
}

