import type { NextPage } from 'next'
import { useEffect, useRef } from 'react';

import { 
  Color,
  DirectionalLight,
  DodecahedronGeometry,
  GridHelper,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  RGBADepthPacking,
  Scene,
  WebGLRenderer,
} from 'three';
import { Planet, planets } from '../planetSpecs';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function getCamera(): PerspectiveCamera {
  const fieldOfView = 100;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const near = 1;
  const far = 10000;

  const camera = new PerspectiveCamera( 
    fieldOfView, aspectRatio, near, far
  );

  camera.lookAt(0,0,0);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 100;

  return camera;
}

function addHelperGrid( scene: Scene ): Array<GridHelper> {
  const [size, divisions] = [500, 50];

  const xGrid = new GridHelper(size, divisions, new Color(0xff0000));
  xGrid.rotateX(90);
  const yGrid = new GridHelper(size, divisions, new Color(0x00ff00));
  yGrid.rotateY(90);
  // const zGrid = new GridHelper(size, divisions, new Color(0x0000ff));
  // zGrid.rotateZ(90);

  scene.add(yGrid);
  scene.add(xGrid);

  return [xGrid, yGrid];
}

function addLightToScene( scene: Scene ): PointLight {
  const lightColor = 0xFFFFFF;
  const lightIntensity = 2;
  const lightSource = new PointLight(lightColor, lightIntensity);

  lightSource.position.set(0, 0, 100);
  scene.add(lightSource);

  return lightSource;
}

function createGeometryInstance(
  geometry: DodecahedronGeometry,
  color: number,
  positionOnX: number,
  scene: Scene,
): Mesh {
  const material = new MeshPhongMaterial({ color });
  const cube = new Mesh(geometry, material);

  scene.add( cube );

  cube.position.x = positionOnX;

  return cube;
}

interface PlanetWithMesh extends Planet {
  object: Mesh;
}


const Home: NextPage = () => {
  const scenery = useRef(null);
  
  useEffect(() => {
    const camera = getCamera();
    let renderTicks = 0;

    let isGalaxyRunning = true;

    document.addEventListener('wheel', (we: WheelEvent) => {
      const verticalDelta = we.deltaY;
      if( Math.abs(verticalDelta) > 1 ) {
        camera.position.z += (verticalDelta / 100) * 20;
      }
    });

    document.addEventListener('click', (ev: MouseEvent) => {
      console.log(ev)
    })

    document.addEventListener('contextmenu', (ev: MouseEvent) => {
      ev.preventDefault();
      isGalaxyRunning = !isGalaxyRunning;
    })

    const scene = new Scene();

    const meshList: Array<PlanetWithMesh> = planets.map((planet ) => {
      const {size, color, distance} = planet
      const geometry = new DodecahedronGeometry(size, 3);
      const object = createGeometryInstance(
        geometry,
        color,
        distance,
        scene,
      )
      return {
        ...planet,
        object,
      }
    })


    const renderer = new WebGLRenderer({ antialias: true,  });
    renderer.setSize(window.innerWidth, window.innerHeight);
      

    addLightToScene(scene);
    const [xGridHelper, yGridHelper] = addHelperGrid( scene );

    renderer.render(scene, camera);

    function setEllipsis(planet: Mesh, speed: number, averageDistance: number): void {
      const x = averageDistance * 1.2;
      const y = averageDistance * .8;
      planet.position.setX(Math.cos(speed) * x);
      planet.position.setY(Math.sin(speed) * y);
      planet.position.setZ(0);
    }

    function render( ) {
      if(isGalaxyRunning) {
        renderTicks += .015;
        meshList.forEach(( { object, speedFactor, distance } ) => {
          setEllipsis(object, renderTicks * speedFactor, distance);
        })
      }

      renderer.render( scene, camera );
      xGridHelper.rotation.x = xHelperRotation;
    
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
  })
  let [xHelperRotation, yHelperRotation] = [90, 90];
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
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 32,
          background: 'rgba(255, 255, 255, .3)'
        }}>
          <button onClick={() => ++xHelperRotation}>Rotate X Grid</button>
          {xHelperRotation}
        </div>
    </div>
  )
}

export default Home
