"use strict";

/**
 * 表示するできすとのモデルを生成するクラス
 * @param {object} font フォントの情報
 */
class TextModel {
  constructor(font) {
    this.font = font;
    this.size = 50;
    this.height = 1;
    this.curveSegments = 3;
    this.bevelEnabled = false;
    this.bevelThickness = 1;
    this.bevelSize = 0.5;
    this.bevelOffset = 0;
    this.bevelSegments = 0;
    this.textMesh = null;
  }

  generateGeom (bookTitle) {
    if (this.textMesh !== null) {
      this.textMesh.parent.remove(this.textMesh);
    }

    var options = {
      font: this.font,
      size: this.size,
      height: this.height,
      curveSegments: this.curveSegments,
      bevelEnabled: this.bevelEnabled,
      bevelThickness: this.bevelThickness,
      bevelSize: this.bevelSize,
      bevelOffset: this.bevelOffset,
      bevelSegments: this.bevelSegments,
    };
    var textGeometry = new THREE.TextGeometry(bookTitle, options);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.textMesh = new THREE.Mesh(textGeometry, material);

    return this.textMesh;
  }
}

export { TextModel as default };
