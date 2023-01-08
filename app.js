const express = require("express");
const app = express();
const mysql = require('mysql');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'localhost',
  password: 'Itotaniguro@01',
  database: 'book_app'
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
        console.log('get root' + results);
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
        console.log('get edit' + results);
        res.render('edit.ejs', { book: results[0] })
      }
    }
  )
});


// 登録処理
app.post('/create', (req, res) => {
  console.log(req.body);
  connection.query(
    'INSERT INTO tb_book(book_title, finished_date, classification, worried_word, contents) VALUES(?,?,?,?,?)',
    [req.body.book_title, req.body.finished_date, req.body.classification, req.body.worried_word, req.body.contents],
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
    'UPDATE tb_book SET book_title = ?, finished_date = ?, classification = ?,worried_word = ?, contents = ? WHERE book_id = ? ',
    [req.body.book_title, req.body.finished_date, req.body.classification, req.body.worried_word, req.body.contents, req.params.book_id],
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

// 指定ポートでアクセスする
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("listening server")
})