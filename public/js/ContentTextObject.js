'use strict'

/**
 * 本の内容のtextObject
 */
class ContentTextObject {
  constructor() {
    /** @type {object} フォントの情報が格納されているオブジェクト*/
    this.font = {};
    /** @type {string} 表示するテキスト*/
    this.text = '';
    /** @type {number} 1行あたりの文字数 */
    this.line_width = 15;
    /** @type {number} フォントサイズ */
    this.font_size = 50;
    /** @type {THREE.Group} */
    this.text_group = null;
  }

  async generateText (font, text) {
    this.font = font;
    this.text = text;
    // テキストをline_widthごとに配列にする
    const textLines = text.match(new RegExp(`.{1,${this.line_width}}`, 'g'));
    // マテリアルを作成
    const material = new THREE.MeshBasicMaterial({ color: 'yellow' });
    // グループを作成
    this.text_group = new THREE.Group();

    for (let i = 0; i < textLines.length; i++) {
      const line = textLines[i];
      // 1行あたりのテキストMeshを作成
      const lineObject = new THREE.Mesh(
        new THREE.TextGeometry(line, {
          font: this.font,
          size: this.font_size,
          height: 0.1,
        }),
        material
      );

      // フォントサイズの1.5倍の行間を設ける
      lineObject.position.y = -i * this.font_size * 1.5;
      // グループに1行分のテキストMeshを追加
      this.text_group.add(lineObject);
    }

    // テキストオブジェクトを中央に配置し、アニメーション開始位置を調整
    this.text_group.position.set(
      -new THREE.Box3().setFromObject(this.text_group).getCenter(new THREE.Vector3()).x, //x:中央に寄せる
      3200, //y:アニメーションの開始時の位置
      -300, //z:カメラの下になるように位置を調整
    );

    return this.text_group;
  }

  /**
   * text_groupのy方向の位置を減少する関数
   */
  animate = () => {
    this.text_group.position.y += 1;
    requestAnimationFrame(this.animate);
  }
}

export { ContentTextObject as default }
