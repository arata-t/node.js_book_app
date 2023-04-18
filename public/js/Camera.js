"use strict";

/**
 * カメラ関係のクラス
 */
class Camera {
  constructor() {
    /** @type {number} fov 視野角 */
    this.fov = 75;

    /**@type {number} near カメラが映す近傍の距離 */
    this.near = 0.1;

    /**@type {number} far カメラが映す遠方の距離 */
    this.far = 20000;
  }

  /**
   *
   * @param {number} radius 球体が周回する環の半径
   * @returns {Promise<THREE.PerspectiveCamera>}
   */
  async generateCamera (radius) {
    const camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, this.near, this.far)

    // カメラの位置は球体が周回する半径の外側
    camera.position.z = radius + 1000;
    // カメラの向きは中心
    camera.target = new THREE.Vector3(0, 0, 0);

    return camera;
  }

  /**
   *
   * @param {THREE.PerspectiveCamera} camera カメラインスタンス
   * @param {HTMLElement} domElement
   * @returns {Promise<THREE.OrbitControls>} カメラコントローラー
   */
  async generateOrbitControls (camera, domElement) {
    const orbit = new THREE.OrbitControls(camera, domElement);
    // 滑らかにカメラコントローラーを制御する
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.2;

    return orbit;
  }
}

export { Camera as default };
