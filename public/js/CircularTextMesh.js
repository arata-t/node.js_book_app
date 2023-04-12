"use strict";

/**
 * 環状テキストメッシュクラス
 */
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
   * @param {array} books 本に関する情報の配列
   * @param {object} font fontの情報
   * @param {number} current_num 繰り返し処理の現在の番号
   * @returns {Promise<THREE.Group>} group 環状テキストメッシュのグループオブジェクト
   */
  async generateTextMesh (books, font, current_num) {

    // fontを代入
    this.font = font;

    // オプションを設定
    const options = {
      font: this.font,
      size: this.size,
      height: this.height,
    };

    // book_titleの文字を分解して配列にする
    const characters = books[current_num].book_title.split('');
    const group = new THREE.Group(); // Groupオブジェクトを作成

    // 環状テキストメッシュのグループを作成
    characters.forEach((character, index) => {
      const character_geometry = new THREE.TextGeometry(character, options);
      const material = new THREE.MeshBasicMaterial({ color: 'yellow' });
      const character_mesh = new THREE.Mesh(character_geometry, material);

      const angle = ((index + 1) * this.angleIncrement) * Math.PI / 180; // 回転する角度
      const x = this.radius * Math.sin(angle); // X座標の計算
      const y = 0; // Y座標の計算
      const z = this.radius * Math.cos(angle); // Z座標の計算

      character_mesh.position.set(x, y, z); // テキストオブジェクトを位置座標に移動する

      character_mesh.lookAt(new THREE.Vector3(0, 0, 0)) // 中心に向ける
      character_mesh.rotation.y += Math.PI; // テキストオブジェクトを水平方向に傾ける
      group.add(character_mesh); // グループオブジェクトに追加する
    });
    return group;
  }

}

export { CircularTextMesh as default };

