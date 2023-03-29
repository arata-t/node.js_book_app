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

  }

  /**
   * ビューアーを初期化する
   * Bookの情報をThree.jsでモデリング化する処理などを書く
   */
  async init () {

    // 最初にFontloaderを読み込む必要がある
    const fontLoader = new THREE.FontLoader();
    fontLoader.load('../fonts/Rounded Mplus 1c_Regular.json', (font) => {

      // フォントに関する情報
      this.font = font;

      // ビューアーを生成する
      this.generateViewer();

      // 画面の拡大縮小に対応
      window.addEventListener('resize', this.onResize, false);

    })
  }

  /**
   * 画面をリサイズする
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
    const textModel = new TextModel(this.font);
    // textMeshはGUIで可変なためletで定義
    let textMesh = await textModel.generateMesh();
    this.scene.add(textMesh);

    // GUIのプロパティを定義、可変のためlet
    let guiProperties = [
      { name: "size", min: 5, max: 100 },
      { name: "height", min: 0.1, max: 10 },
      { name: "curveSegments", min: 0.1, max: 5 },
      { name: "bevelThickness", min: 0.1, max: 5 },
      { name: "bevelSize", min: 0.01, max: 3 },
      { name: "bevelOffset", min: -5, max: 0 }
    ];

    // GUIを作成
    const gui = new dat.GUI();
    guiProperties.forEach(property => {
      gui.add(textModel, property.name, property.min, property.max).onChange(() => {
        textModel.generateMesh().then(mesh => {
          // 既存のtextMeshを更新
          this.scene.remove(textMesh);
          textMesh = mesh;
          this.scene.add(textMesh);
        });
      });
    });

    // カメラコントローラーを作成
    const orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    // 滑らかにカメラコントローラーを制御する
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.2;

    /**
     * アニメーションを実行する
     *
     */
    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    }
    animate();
  }
}

export { ViewerMain as default };
