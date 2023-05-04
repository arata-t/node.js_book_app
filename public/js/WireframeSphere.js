"use strict";

/**
 * ワイヤーフレームの球体クラス
 */
class WireframeSphere {
  constructor() {
    /** @type {number} 球体の半径 */
    this.radius = 400;
    /**  @type {number} 球体を構成する水平方向の分割数 */
    this.widthSegments = 30;
    /**  @type {number} 球体を構成する垂直方向の分割数 */
    this.heightSegments = 30;
    /**  @type {string} 球体の色 */
    this.color = 0xffffff;
    /**  @type {number} 球体の不透明度 */
    this.opacity = 0.2;
    /**  @type {boolean} 球体をワイヤーフレームで描画するかどうか */
    this.wireframe = false;
  }

  /**
   * ワイヤーフレームの球体を作成する
   * @param {object} 本の情報
   * @returns {THREE.Mesh} ワイヤーフレームの球体
   */
  generateSphereMesh (book) {
    this.geometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
    this.material = new THREE.MeshBasicMaterial({ color: this.color, wireframe: true, opacity: this.opacity, transparent: true });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // クリック処理の際、球体を識別するためにnameとbook_idプロパティを付与する
    this.mesh.name = book.book_title;
    this.mesh.book_id = book.book_id;
    return this.mesh;
  }
}

export { WireframeSphere as default };
