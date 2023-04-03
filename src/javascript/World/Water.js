import * as THREE from "three";

import { Water } from "three/examples/jsm/objects/Water";

export default class WaterObj {
  constructor(_option) {
    this.material = _option.material;
    this.time = _option.time;
    this.debug = _option.debug;

    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    if (this.debug) {
      this.debugFolder = this.debug.addFolder("water");
      this.debugFolder.open();
    }

    this.setWater();
  }

  setWater() {
    const geometry = new THREE.PlaneGeometry(10000, 10000);

    const mesh = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "textures/waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      //fog: scene.fog !== undefined
    });

    mesh.rotation.x = -Math.PI / 2;

    this.container.add(mesh);

    this.container.updateMatrix();
    this.time.on("tick", () => {
      mesh.material.uniforms["time"].value += 1.0 / 2000.0;
    });
    if (this.debug) {
      this.debugFolder.add(mesh, "visible").name("visible");
      this.debugFolder
        .add(mesh.position, "y")
        .step(0.001)
        .min(-Math.PI)
        .max(Math.PI)
        .name("positionY");

      const waterUniforms = mesh.material.uniforms;

      this.debugFolder
        .add(waterUniforms.distortionScale, "value", 0, 8, 0.1)
        .name("distortionScale");
      this.debugFolder
        .add(waterUniforms.size, "value", 0.1, 10, 0.1)
        .name("size");
    }
  }
}
