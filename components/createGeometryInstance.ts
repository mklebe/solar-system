import { Mesh, MeshPhongMaterial, Scene, ShapeGeometry } from "three";

export function createGeometryInstance(
    geometry: ShapeGeometry,
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
