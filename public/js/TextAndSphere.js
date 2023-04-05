"use strict";

import WireframeSphere from "./WireframeSphere.js";
import CircularTextMesh from "./CircularTextMesh.js"

/**
 * 表示するテキストモデルを生成するクラス
 */
class TextAndSphere {
  constructor() {

  }

  /**
   * テキストモデルのメッシュを作成する
   * @returns {object} group 環状テキストメッシュとワイヤーフレームの球体のグループオブジェクト
   * @param {object} font フォントの情報
   */
  async generateMesh (font) {

    const group = new THREE.Group(); // Groupオブジェクトを作成

    /**
     * 環状テキストメッシュを作成
     */
    const circularTextMesh = await new CircularTextMesh().generateTextMesh(font);
    group.add(circularTextMesh);

    /**
     * ワイヤーフレームの球体を作成
     */
    const wireframeSphere = new WireframeSphere().generateSphereMesh();
    group.add(wireframeSphere);



    return group;
  }

}

export { TextAndSphere as default };
