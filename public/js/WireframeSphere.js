"use strict";

/**
 * ワイヤーフレームの球体クラス
 */
class WireframeSphere {
  constructor() {
    this.radius = 400;
    this.widthSegments = 30;
    this.heightSegments = 30;
    this.color = 0xffffff;
    this.wireframe = false;
  }

  /**
   * ワイヤーフレームの球体を作成する
   * @param {object} 本の情報
   * @returns {THREE.Mesh} ワイヤーフレームの球体
   */
  generateSphereMesh (book) {
    this.geometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
    this.material = new THREE.MeshBasicMaterial({ color: this.color, wireframe: true });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = book.book_title;
    this.mesh.book_id = book.book_id;
    return this.mesh;
  }
}

export { WireframeSphere as default };
