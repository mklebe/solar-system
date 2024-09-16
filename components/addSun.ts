import { DodecahedronGeometry, Mesh, MeshLambertMaterial, Scene, Sphere, SphereGeometry, Vector3 } from "three";
import { Planet } from "../planetSpecs";

export function addSun( sun: Planet, scene: Scene ) {
    const { size, color, name } = sun;
    const geometry = new SphereGeometry(size, 32);
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