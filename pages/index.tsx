import type { NextPage } from 'next'
import { useEffect, useRef } from 'react';

import { 
  BufferGeometry,
  Color,
  DodecahedronGeometry,
  EllipseCurve,
  GridHelper,
  Line,
  LineBasicMaterial,
  Matrix3,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { Planet, planets } from '../planetSpecs';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function setInitialCameraPosition(camera: PerspectiveCamera): void {
  camera.position.x = 0;
  camera.position.y = -50;
  camera.position.z = 100;
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

function addHelperGrid( scene: Scene ): Array<GridHelper> {
  const [size, divisions] = [500, 50];

  const xGrid = new GridHelper(size, divisions, new Color(0xff0000));
  xGrid.rotation.x = Math.PI / 2;
  const yGrid = new GridHelper(size, divisions, new Color(0x00ff00));
  yGrid.rotation.x = Math.PI;

  // scene.add(yGrid);
  scene.add(xGrid);

  return [xGrid, yGrid];
}

function addLightToScene( scene: Scene ): PointLight {
  const lightColor = 0xFFFFFF;
  const lightIntensity = 2;
  const lightSource = new PointLight(lightColor, lightIntensity);

  lightSource.position.set(0, 0, 50);
  scene.add(lightSource);

  return lightSource;
}

function createGeometryInstance(
  geometry: DodecahedronGeometry,
  color: number,
  positionOnX: number,
  scene: Scene,
  name: string,
): Mesh {
  const material = new MeshPhongMaterial({ color });
  const cube = new Mesh(geometry, material);
  cube.name = name;

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
    window.myScene = scene;

    
    {
      const curve = new EllipseCurve(
        0, 0,
        25 * 1.2, 25 * .8,
        0, 2 * Math.PI,
        false,
        0
      );
      const points = curve.getPoints(50);
      const geometry = new BufferGeometry().setFromPoints(points);
      const material = new LineBasicMaterial({color: 0xff0000})
      const ellipse = new Line(geometry, material);
      scene.add(ellipse);
    }
    

    const sun = planets.filter( p => p.name === 'sun' )[0];
    const planetList = planets.filter( p => p.name !== 'sun' );

    {
      const { size, color, name } = sun;
      const geometry = new DodecahedronGeometry(size, 3);
      const mat = new MeshLambertMaterial({
        color,
        emissive: color,
        emissiveIntensity: 1,
      });

      const mesh = new Mesh(geometry, mat);
      mesh.name = name;
      mesh.position.x = 0;
      scene.add(mesh);
    }

    const meshList: Array<PlanetWithMesh> = planetList.map((planet ) => {
      const {size, color, distance, name} = planet
      const geometry = new DodecahedronGeometry(size, 3);
      const object = createGeometryInstance(
        geometry,
        color,
        distance,
        scene,
        name
      )
      return {
        ...planet,
        object,
      }
    })


    const renderer = new WebGLRenderer({ antialias: true,  });
    renderer.setSize(window.innerWidth, window.innerHeight);
      

    addLightToScene(scene);
    addHelperGrid( scene );

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
        meshList.forEach(( { object, speedFactor, distance } ) => {
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
