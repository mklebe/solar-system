import { BufferGeometry, EllipseCurve, Line, LineBasicMaterial, Scene } from "three";
import { Planet } from "../planetSpecs";

export function addOrbitToScene( planet: Planet, scene: Scene ) {
    const curve = new EllipseCurve(
      0, 0,
      planet.distance * 1.2, planet.distance * .8,
      0, 2 * Math.PI,
      false,
      0
    );
    const points = curve.getPoints(50);
    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({color: planet.color})
    const ellipse = new Line(geometry, material);
    scene.add(ellipse);
  }