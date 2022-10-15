import { DodecahedronGeometry, Mesh, MeshPhongMaterial, Scene } from "three";

export function createGeometryInstance(
    geometry: DodecahedronGeometry,
    color: number,
    positionOnX: number,
    scene: Scene,
    name: string,
): Mesh {
    const material = new MeshPhongMaterial({ color });
    const cube = new Mesh(geometry, material);
    cube.name = name;

    scene.add(cube);

    cube.position.x = positionOnX;

    return cube;
}
