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
  }

  async generateText (font, text) {
    this.font = font;
    this.text = text;
    // テキストをline_widthごとに配列にする
    const textLines = text.match(new RegExp(`.{1,${this.line_width}}`, 'g'));
    // マテリアルを作成
    const material = new THREE.MeshBasicMaterial({ color: 'yellow' });
    // グループを作成
    const text_group = new THREE.Group();

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
      text_group.add(lineObject);
    }

    // 上方からの視線で見るために、テキストを回転する
    text_group.rotation.z = Math.PI;
    text_group.rotation.y = Math.PI;

    // テキストオブジェクトを中心配置にし、位置を下げる
    text_group.position.set(
      -new THREE.Box3().setFromObject(text_group).getCenter(new THREE.Vector3()).x,
      0,
      300
    );

    return text_group;
  }
}

export { ContentTextObject as default }
