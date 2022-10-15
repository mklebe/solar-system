import { Color, GridHelper, Scene } from "three";

function addHelperGrid( scene: Scene ): Array<GridHelper> {
    const [size, divisions] = [500, 50];
  
    const xGrid = new GridHelper(size, divisions, new Color(0xff0000));
    xGrid.rotation.x = Math.PI / 2;
    const yGrid = new GridHelper(size, divisions, new Color(0x00ff00));
    yGrid.rotation.y = Math.PI;
    yGrid.position.y = 250;
  
    scene.add(xGrid);
    scene.add(yGrid)
  
    return [xGrid, yGrid];
  }
