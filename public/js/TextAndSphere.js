"use strict";

import WireframeSphere from "./WireframeSphere.js";
import CircularTextMesh from "./CircularTextMesh.js"

/**
 * 環状テキストメッシュとワイヤーフレームの球体のグループクラス
 */
class TextAndSphere {
  constructor() {
    /** @type {THREE.Group} 環状テキストメッシュとワイヤーフレームの球体のグループ */
    this.textAndSphereGroup = null;
  }

  /**
   * 環状テキストメッシュとワイヤーフレームの球体のグループを作成する
   * @param {object} font fontの情報
   * @returns {Promise<THREE.Group>} 環状テキストメッシュとワイヤーフレームの球体のグループ
   */
  async generateTextAndSphere (font) {

    // textAndSphereGroupをグループインスタンス化
    this.textAndSphereGroup = new THREE.Group();

    /**
     * 環状テキストメッシュを作成
     */
    const circularTextMesh = await new CircularTextMesh().generateTextMesh(font);
    this.textAndSphereGroup.add(circularTextMesh);

    /**
     * ワイヤーフレームの球体を作成
     */
    const wireframeSphere = new WireframeSphere().generateSphereMesh();
    this.textAndSphereGroup.add(wireframeSphere);

    return this.textAndSphereGroup;
  }

  /**
   * フレーム毎に実行されるアニメーション
   */
  animate = () => {
    this.textAndSphereGroup.rotation.y -= 0.01;
    requestAnimationFrame(this.animate);
  }
}

export { TextAndSphere as default };
