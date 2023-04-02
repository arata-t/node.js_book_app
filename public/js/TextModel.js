"use strict";

/**
 * 表示するテキストモデルを生成するクラス
 * @param {object} font フォントの情報
 */
class TextModel {
  constructor(font) {
    /** @type {object} フォントの情報 */
    this.font = font;

    /** @type {number} テキストサイズ */
    this.size = 50;

    /** @type {number} 押し出される深さ */
    this.height = 1;

    /** @type {number} 押し出すときのセグメント */
    this.curveSegments = 3;

    /** @type {number} ベベルを追加するかどうか */
    this.bevelEnabled = false;

    /** @type {number} ベベルの深さ */
    this.bevelThickness = 1;

    /** @type {number} ベベルの高さ */
    this.bevelSize = 0.5;

    /** @type {number}  */
    this.bevelOffset = 0;

  }

  /**
   * テキストモデルのメッシュを作成する
   * @returns {object} textMesh textMeshオブジェクト
   */
  async generateMesh () {
    // bookオブジェクトを取得
    const books = await this.getBook();

    // テキストジオメトリのオプションを設定
    const options = {
      font: this.font,
      size: this.size,
      height: this.height,
      curveSegments: this.curveSegments,
      bevelEnabled: this.bevelEnabled,
      bevelThickness: this.bevelThickness,
      bevelSize: this.bevelSize,
      bevelOffset: this.bevelOffset,
    };
    // テキストメッシュの作成
    const textGeometry = new THREE.TextGeometry(books[0].book_title, options);
    const material = new THREE.MeshNormalMaterial();
    const textMesh = new THREE.Mesh(textGeometry, material);
    // 座標の中心を求める
    const box = new THREE.Box3().setFromObject(textMesh);
    const center = box.getCenter(new THREE.Vector3());
    textMesh.position.x = - center.x;
    return textMesh;
  }

  /**
   * サーバーからブックオブジェクトを取得
   * @returns {object} bookオブジェクトのデータ
   */
  async getBook () {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('Error:', response.statusText);
      }
      const data = await response.json();
      // サーバーから値を取得できたら返却する
      return data;
    } catch (error) {
      alert('ブックオブジェクトの取得に失敗しました。');
    }
  }

}

export { TextModel as default };
