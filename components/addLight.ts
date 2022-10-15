import { PointLight, Scene } from "three";

export function addLightToScene(scene: Scene): PointLight {
    const lightColor = 0xFFFFFF;
    const lightIntensity = 2;
    const lightSource = new PointLight(lightColor, lightIntensity);

    lightSource.position.set(0, 0, 50);
    scene.add(lightSource);

    return lightSource;
}
