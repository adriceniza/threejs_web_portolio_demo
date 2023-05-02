import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import "./Game.scss";
import { hover } from "@testing-library/user-event/dist/hover";

const Game = () => {
  const canvasRef = useRef(null);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const loader = new GLTFLoader();

    const planets = new THREE.Group();

    const orbitRadius = 5;
    const orbitThickness = 0.1;
    const orbitSegments = 64;

    const planetRotationSpeed = 0.01

    const addPlanet = (gltf, name) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);

      model.material = new THREE.MeshBasicMaterial({opacity: 0.5, transparent: true})
      model.pointerEvents = true;
      const planet = new THREE.Group();
      planet.add(model);
      planet.name = name
      planets.add(planet);
    };
    

    loader.load(
      "/models/black.glb",
      (gltf) => {      
        addPlanet(gltf,"Moon") },
      undefined,
      (error) => {
        console.error("An error occurred while loading the model:", error);
      }
    );
    
    
    loader.load(
      "/models/keyboard.glb",
      (gltf) => { 
        addPlanet(gltf,"Keyboard") },
      undefined,
      (error) => {
        console.error("An error occurred while loading the model:", error);
      }
    );

    const orbitGeometry = new THREE.TorusGeometry(orbitRadius, orbitThickness, orbitSegments, orbitSegments);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.position.set(0, 0, 0);
    orbit.rotation.x = 0.6;
    orbit.pointerEvents = false;


    scene.add(orbit);
    orbit.add(planets)

    const AmbientLight = new THREE.AmbientLight(0x9172a1);
    scene.add(AmbientLight);

    const PointLight = new THREE.PointLight(0xffffff,1,100,2);
    PointLight.position.set(0, 0, 3);
    scene.add(PointLight);

    camera.position.z = 15;

    const onWindowResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };

    const onPointerMove = ( event ) => {
    
      pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    }

    const animate = () => {
      requestAnimationFrame(animate);
    
    
      const orbit = scene.children.find((child) => child.type === "Mesh");
      if (orbit) {
        planets.rotation.y += planetRotationSpeed;
        const planetGroup = orbit.children[0];
        if (planetGroup) {
          const planetCount = planetGroup.children.length;
          const angleIncrement = (2 * Math.PI) / planetCount;
          let currentAngle = 0;
    
          planetGroup.children.forEach((planet) => {
            const x = Math.cos(currentAngle) * orbitRadius;
            const z = Math.sin(currentAngle) * orbitRadius;
            planet.position.set(x, 0, z);
            planet.lookAt(orbit.position);
            currentAngle += angleIncrement;
          });
        }
      }
    
      render();
    };

    const hoverObjects = ()=> {
      const intersects = raycaster.intersectObjects( planets.children );
      
      for ( let i = 0; i < intersects.length; i ++ ) {
        let target = intersects[ i ].object.parent
          
      }
    }
    const resetObjects = ()=> {
      
      for ( let i = 0; i < planets.children.length ; i ++ ) {
      }
    }

    const render = () => {
      raycaster.setFromCamera( pointer, camera );
      resetObjects();
      hoverObjects();

      renderer.render(scene, camera);
    };
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    animate();

    window.addEventListener("resize", onWindowResize, false);
    window.addEventListener( 'pointermove', onPointerMove );

    return () => {
      window.removeEventListener("resize", onWindowResize, false);
      window.removeEventListener("pointermove", onPointerMove, false);
    };
  }, [canvasRef]);

  return <canvas className="game-canvas" ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default Game;
