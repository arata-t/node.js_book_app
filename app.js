
require('dotenv').config();

const express = require("express");
const app = express();
const mysql = require('mysql');
const moment = require('moment');
const cors = require('cors'); // CORSミドルウェアを追加

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

// CORSミドルウェアを設定
app.use(cors());


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// MySQL データベースへの接続
connection.connect(err => {
  if (err) {
    console.error('MySQL接続エラー: ' + err.stack);
    return;
  }
  console.log('MySQLに接続しました。ID: ' + connection.threadId);
});

// ejsテンプレートエンジンを設定
app.set("view engine", "ejs");

// getでルートディレクトリにリクエストがあったら
app.get("/", (req, res) => {
  // listテンプレートを返す
  connection.query(
    'SELECT * FROM tb_book',
    (error, results) => {
      if (error) {
        console.log('get root' + error);
        return;
      } else {
        // 時間をフォーマット
        results.forEach(result => {
          result.finished_date = moment(result.finished_date).format('YYYY-MM-DD')
        });
        res.render("list.ejs", { books: results });
      }
    }
  )
});

// 新規作成に移動
app.get('/new', (req, res) => {
  res.render('new.ejs');
});

// 本詳細に移動
app.get('/book/:book_id', (req, res) => {
  const book_id = req.params.book_id;
  connection.query(
    'SELECT * FROM tb_book WHERE book_id = ?',
    [book_id],
    (error, results) => {
      if (error) {
        console.log('get book_list' + error);
      } else {
        // 時間をフォーマット
        results[0].finished_date = moment(results[0].finished_date).format('YYYY-MM-DD')
        console.log('get book_list' + results);
        res.render('book.ejs', { book: results[0] })
      }
    }
  )
});

// 編集画面への移動
app.get('/edit/:book_id', (req, res) => {
  connection.query(
    'SELECT * FROM tb_book WHERE book_id = ?',
    [req.params.book_id],
    (error, results) => {
      if (error) {
        console.log('get edit' + error);
        return;
      } else {
        // 時間をフォーマット
        results[0].finished_date = moment(results[0].finished_date).format('YYYY-MM-DD')
        console.log('get edit' + results[0]);
        res.render('edit.ejs', { book: results[0] })
      }
    }
  )
});


// 登録処理
app.post('/create', (req, res) => {
  console.log(req.body);
  connection.query(
    'INSERT INTO tb_book(book_title, finished_date, classification, worried_word, contents) VALUES(?,?,?,?,?,?)',
    [req.body.book_title, req.body.finished_date, req.body.classification, req.body.worried_word, req.body.contents, req.body.book_author],
    (error, results) => {
      if (error) {
        console.log('create' + error);
        return;
      } else {
        console.log('create' + results);
        res.redirect("/");
      }
    }
  )
});

//削除処理
app.post('/delete/:book_id', (req, res) => {
  connection.query(
    'DELETE FROM tb_book WHERE book_id = ?',
    [req.params.book_id],
    (error, results) => {
      if (error) {
        console.log('delete' + error);
        return;
      } else {
        console.log('delete' + results);
        res.redirect('/');
      }
    }
  )
});

// 編集処理
app.post('/edit/:book_id', (req, res) => {
  connection.query(
    'UPDATE tb_book SET book_title = ?, book_author = ?, finished_date = ?, classification = ?,worried_word = ?, contents = ? WHERE book_id = ? ',
    [req.body.book_title, req.body.book_author, req.body.finished_date, req.body.classification, req.body.worried_word, req.body.contents, req.params.book_id],
    (error, results) => {
      if (error) {
        console.log('post edit' + error);
        return;
      } else {
        console.log('post edit' + results);
        res.redirect('/');
      }
    }
  )
})

// three.jsへ移動
app.get('/three', (req, res) => {
  res.render("three.ejs");
});

// 登録したbookの情報をフロントに返却する
app.get('/api/data', (req, res) => {
  connection.query(
    'SELECT * FROM tb_book',
    (error, results) => {
      if (error) {
        console.log('get root' + error);
        return;
      } else {
        // 時間をフォーマット
        results.forEach(result => {
          result.finished_date = moment(result.finished_date).format('YYYY-MM-DD')
        });
        // 取得したbookオブジェクトをフロント側に返却
        res.send(results);
      }
    }
  )
})

// 指定ポートでアクセスする
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("listening server")
})
