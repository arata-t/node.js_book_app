"use strict";

class CircularTextMesh {
  constructor(font) {
    /** @type {object} フォントの情報 */
    this.font = null;

    /** @type {number} テキストサイズ */
    this.size = 80;

    /** @type {number} 押し出される深さ */
    this.height = 7;

    /**@type {number} 環状テキスト1文字ごとの角度 */
    this.angleIncrement = 18;

    /**@type {number} 環の半径 */
    this.radius = 500;

  }

  /**
   * 環状テキストメッシュを作成する
   * @returns {object} group 環状テキストメッシュのグループオブジェクト
   */
  async generateTextMesh (font) {

    // fontを代入
    this.font = font;

    // ブックオブジェクトを取得
    const books = await this.getBook();

    // オプションを設定
    const options = {
      font: this.font,
      size: this.size,
      height: this.height,
    };

    // book_titleの文字を分解して配列にする
    const characters = books[0].book_title.split('');
    const group = new THREE.Group(); // Groupオブジェクトを作成

    // 環状テキストメッシュのグループを作成
    characters.forEach((character, index) => {
      const characterGeometry = new THREE.TextGeometry(character, options);
      const material = new THREE.MeshNormalMaterial();
      const characterMesh = new THREE.Mesh(characterGeometry, material);

      const angle = ((index + 1) * this.angleIncrement) * Math.PI / 180; // 回転する角度
      const x = this.radius * Math.sin(angle); // X座標の計算
      const y = 0; // Y座標の計算
      const z = this.radius * Math.cos(angle); // Z座標の計算

      characterMesh.position.set(x, y, z); // テキストオブジェクトを位置座標に移動する

      characterMesh.lookAt(new THREE.Vector3(0, 0, 0)) // 中心に向ける
      characterMesh.rotation.y += Math.PI; // テキストオブジェクトを水平方向に傾ける
      group.add(characterMesh); // グループオブジェクトに追加する
    });
    return group;
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

export { CircularTextMesh as default };

