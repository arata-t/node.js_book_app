"use strict";


class WireframeSphere {
  constructor() {
    this.radius = 400;
    this.widthSegments = 30;
    this.heightSegments = 30;
    this.color = 0xffffff;
    this.wireframe = false;
  }

  generateSphereMesh () {

    this.geometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
    this.material = new THREE.MeshBasicMaterial({ color: this.color, wireframe: true });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    return this.mesh;
  }
}

export { WireframeSphere as default };
