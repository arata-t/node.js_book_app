

1. npm install ejs
2. npm install express
3. 

herokuへのデプロイはDynosを使用するが、無料じゃない。

node.jsはrailsのようにheroku上でdb:migrateできないため、ヘロクでサーバーを立ち上げることができない。
そのため、コードにherokuのclearDBの設定を書き込む必要があるが、
herokuサーバーを立ち上げないとDBが動かないので、意味なし、
一旦やめ