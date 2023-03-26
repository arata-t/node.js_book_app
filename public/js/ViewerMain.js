import TextModel from "./TextModel.js";


/**
 * viewer_frontから呼び出されるviewのメイン処理クラス
 */
class ViewerMain {
  constructor() {
    /** @type {object} フォントに関する情報 */
    this.font = '';

    /**  @type {object} カメラに関する情報 */
    this.camera = '';

    /**  @type {object} シーンに関する情報 */
    this.scene = '';

    /**  @type {object} レンダラーに関する情報 */
    this.renderer = '';

    this.unescapedBooks = [
      { book_title: 'ブックタイトル' },
    ]
  }

  async init () {
    // Bookの情報をThree.jsでモデリング化する処理などを書く

    // 最初にFontloaderを読み込む必要がある
    const fontLoader = new THREE.FontLoader();
    fontLoader.load('../fonts/Rounded Mplus 1c_Regular.json', (font) => {

      this.font = font;

      // ビューアーを生成する
      this.generateViewer();

      // 画面の拡大縮小に対応
      window.addEventListener('resize', this.onResize, false);

    })
  }

  /**
   * 画面をリサイズする
   * return void
   */
  onResize = async () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * ビューアーを起動する
   */
  async generateViewer () {
    // const escapedArray = books; //現時点ではサーバーから値が入ってこない
    // エスケープを解除する
    // const sub_escape_array = escapedArray.replace(/&#34;/g, '"').replace(/(\r\n|\r|\n)/g, "\\n");

    // var unescapedBooks = JSON.parse(sub_escape_array);

    // 3Dシーンを作成
    this.scene = new THREE.Scene();

    // カメラを作成
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // カメラを移動
    this.camera.position.z = 5;

    // レンダラーを作成
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("viewer_front").appendChild(this.renderer.domElement);

    // テキストのモデルを作成
    var textModel = new TextModel(this.font);
    var textMesh = textModel.generateGeom(this.unescapedBooks[0].book_title);
    this.scene.add(textMesh);

    // // GUIのプロパティを作成
    // const gui = new dat.GUI();
    // gui.add(controls, 'size', 5, 100).onChange(controls.generateGeom);
    // gui.add(controls, 'height', 0.1, 10).onChange(controls.generateGeom);
    // gui.add(controls, 'curveSegments', 0.1, 5).onChange(controls.generateGeom);
    // gui.add(controls, 'bevelThickness', 0.1, 5).onChange(controls.generateGeom);
    // gui.add(controls, 'bevelSize', 0.01, 3).onChange(controls.generateGeom);
    // gui.add(controls, 'bevelOffset', -5, 0).onChange(controls.generateGeom);
    // gui.add(controls, 'bevelSegments', 0, 1).onChange(controls.generateGeom);

    // カメラコントローラーを作成
    const orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    // 滑らかにカメラコントローラーを制御する
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.2;

    // アニメーションを開始
    var animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    }
    animate();
  }
}

export { ViewerMain as default };
