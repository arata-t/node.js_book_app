"use strict";

import WireframeSphere from "./WireframeSphere.js";
import CircularTextMesh from "./CircularTextMesh.js"

/**
 * 環状テキストメッシュとワイヤーフレームの球体のグループクラス
 */
class TextAndSphere {
  constructor() {
    /** @type {THREE.Group} 環状テキストメッシュとワイヤーフレームの球体のグループ */
    this.text_and_sphere_group = null;
  }

  /**
   * 環状テキストメッシュとワイヤーフレームの球体のグループを作成する
   * @param {object} books 本に関する情報のオブジェクト
   * @param {object} font fontの情報
   * @param {number} current_num 繰り返し処理の現在番号
   * @returns {Promise<THREE.Group>} 環状テキストメッシュとワイヤーフレームの球体のグループ
   */
  async generateTextAndSphere (books, font, current_num) {

    // textAndSphereGroupをグループインスタンス化
    this.text_and_sphere_group = new THREE.Group();

    /**
     * 環状テキストメッシュを作成
     */
    const circular_text_mesh = await new CircularTextMesh().generateTextMesh(books, font, current_num);
    this.text_and_sphere_group.add(circular_text_mesh);

    /**
     * ワイヤーフレームの球体を作成
     */
    const wireframe_sphere = new WireframeSphere().generateSphereMesh();
    this.text_and_sphere_group.add(wireframe_sphere);

    return this.text_and_sphere_group;
  }

  /**
   * フレーム毎に実行されるアニメーション
   */
  animate = () => {
    this.text_and_sphere_group.rotation.y -= 0.01;
    requestAnimationFrame(this.animate);
  }
}

export { TextAndSphere as default };
