import * as THREE from "three";

import { Sky } from "three/examples/jsm/objects/Sky";

export default class SkyObj {
  constructor(_option) {
    this.renderer = _option.renderer;
    this.time = _option.time;
    this.debug = _option.debug;

    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    if (this.debug) {
      this.debugFolder = this.debug.addFolder("sky");
      this.debugFolder.open();
    }

    this.setSky();
  }

  setSky() {
    const sun = new THREE.Vector3();
    const sky = new Sky();
    const skyUniforms = sky.material.uniforms;

    sky.scale.setScalar(10000);
    this.container.add(sky);
    this.container.updateMatrix();

    skyUniforms["turbidity"].value = 10;
    skyUniforms["rayleigh"].value = 2;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;

    const parameters = {
      elevation: 2,
      azimuth: 180,
    };

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    let renderTarget;

    function updateSun() {
      const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
      const theta = THREE.MathUtils.degToRad(parameters.azimuth);
      sun.setFromSphericalCoords(1, phi, theta);
      sky.material.uniforms["sunPosition"].value.copy(sun);
      // water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();
      if (renderTarget !== undefined) renderTarget.dispose();
      renderTarget = pmremGenerator.fromScene(sky);
      // scene.environment = renderTarget.texture;
    }

    updateSun();

    this.time.on("tick", () => {
      // mesh.material.uniforms["time"].value += 1.0 / 60.0;
    });

    if (this.debug) {
      this.debugFolder.add(sky, "visible").name("visible");

      this.debugFolder
        .add(parameters, "elevation", 0, 90, 0.1)
        .onChange(updateSun);
      this.debugFolder
        .add(parameters, "azimuth", -180, 180, 0.1)
        .onChange(updateSun);
    }

    console.log({ sky });
  }
}
