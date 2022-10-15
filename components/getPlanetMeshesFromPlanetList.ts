import { DodecahedronGeometry, Mesh, Scene } from "three";
import { Planet } from "../planetSpecs";
import { addOrbitToScene } from "./addOrbit";
import { createGeometryInstance } from "./createGeometryInstance";

export interface PlanetWithMesh extends Planet {
    object: Mesh;
}

export function getPlanetMeshesFromPlanetList(
    planetList: Array<Planet>,
    scene: Scene,
): Array<PlanetWithMesh> {
    return planetList.map((planet ) => {
      const {size, color, distance, name} = planet;
      addOrbitToScene(planet, scene);
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
  }