

1. npm install ejs
2. npm install express
3. 

herokuへのデプロイはDynosを使用するが、無料じゃない。

node.jsはrailsのようにheroku上でdb:migrateできないため、ヘロクでサーバーを立ち上げることができない。
そのため、コードにherokuのclearDBの設定を書き込む必要があるが、
herokuサーバーを立ち上げないとDBが動かないので、意味なし、
一旦やめ

つまったこと
１。Procfileが必要
２。rootブランチ（main）でデプロイする
３。packege.jsonに"start": "node app.js",が必要
４。const PORT = process.env.PORT || 3000;が必要

 参考になりそうなサイト
 https://zenn.dev/toshi_h/articles/c3e3df74d6ceb8897c9d