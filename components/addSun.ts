import { DodecahedronGeometry, Mesh, MeshLambertMaterial, Scene } from "three";
import { Planet } from "../planetSpecs";

export function addSun( sun: Planet, scene: Scene ) {
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