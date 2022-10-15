import type { NextPage } from 'next'
import { useEffect, useRef } from 'react';

import { 
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { planets } from '../planetSpecs';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { addLightToScene } from '../components/addLight';
import { addSun } from '../components/addSun';
import { getPlanetMeshesFromPlanetList, PlanetWithMesh } from '../components/getPlanetMeshesFromPlanetList';

function setInitialCameraPosition(camera: PerspectiveCamera): void {
  camera.position.x = 0;
  camera.position.y = -1750;
  camera.position.z = 3500;
  camera.lookAt(0,0,0);
}

function getCamera(): PerspectiveCamera {
  const fieldOfView = 100;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const near = 1;
  const far = 10000;

  const camera = new PerspectiveCamera( 
    fieldOfView, aspectRatio, near, far
  );

  setInitialCameraPosition(camera);

  return camera;
}

const Home: NextPage = () => {
  const scenery = useRef(null);
  
  useEffect(() => {
    const camera = getCamera();
    let renderTicks = 0;

    let isGalaxyRunning = true;

    document.addEventListener('contextmenu', (ev: MouseEvent) => {
      ev.preventDefault();
      isGalaxyRunning = !isGalaxyRunning;
    });

    document.addEventListener('keypress', ( event: KeyboardEvent ) => {
      if( event.key === 'r' ) {
        setInitialCameraPosition(camera);
      }
    });

    const scene = new Scene();

    const sun = planets.filter( p => p.name === 'sun' )[0];
    const planetList = planets.filter( p => p.name !== 'sun' );

    addSun( sun, scene );

    const planetsMeshList: Array<PlanetWithMesh> = getPlanetMeshesFromPlanetList(planetList, scene);

    const renderer = new WebGLRenderer({ antialias: true,  });
    renderer.setSize(window.innerWidth, window.innerHeight);

    addLightToScene(scene);

    renderer.render(scene, camera);

    function setEllipsis(planet: Mesh, speed: number, averageDistance: number): void {
      const x = averageDistance * 1.2;
      const y = averageDistance * .8;

      planet.position.set(
        Math.cos(speed) * x,
        Math.sin(speed) * y,
        0
      );
    }

    function render( ) {
      if(isGalaxyRunning) {
        renderTicks += .015;
        planetsMeshList.forEach(( { object, speedFactor, distance } ) => {
          setEllipsis(object, renderTicks * speedFactor, distance);
        })
      }

      renderer.render( scene, camera );

      requestAnimationFrame(render)
    }
    
    requestAnimationFrame(render);


    if( scenery !== null ) {
      const controls = new OrbitControls( camera, renderer.domElement );
      controls.listenToKeyEvents(window);

      const container: HTMLElement = scenery?.current as unknown as HTMLElement;
      container.innerHTML = '';
      container.appendChild( renderer.domElement )
    }
  });

  return (
    <div style={{
      position: 'relative'
    }}>
      <div 
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        ref={scenery}>
        </div>
    </div>
  )
}

export default Home
