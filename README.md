# jQuery Rollover Plugin

## 概要

画像（img要素/input要素）のロールオーバー効果を実現します。マウスオーバー時だけでなく、キーボードフォーカス時にも効果を有効にします。

## ライセンス

GNU GPL Version 3のもとに提供します。

## 利用方法

* jQuery及びjQuery Rollover Pluginをロードします。
* $(function() { 〜 });内に、本プラグインを有効化するメソッドを記述します。
        $(function() {
            $(".roll").rollover();
        });
* (X)HTML文書内に、上記で指定したID属性/class属性を設定します。
* ロールオーバー前の画像ファイル名と拡張子の間に"_o"をつけた画像を用意します。

## オプション

### ロールオーバーの一部無効化

パラメーター"disable"に任意のclass名を設定し、(X)HTML文書にそのclass名を記述します。

#### 例

class属性に"unroll"を設定した要素はロールオーバー効果を付けない場合

    $(function() {
        $(".roll").rollover({ disable: ".unroll" });
    });
　　　　
### ロールオーバー時の画像接尾辞を変更

パラメーター"replaceStr"に任意の文字列を設定します。

#### 例

画像ファイル名 + _on + 拡張子に設定する場合

    $(function() {
        $(".roll").rollover({ replaceStr: "_on$1" });
    });
 
※ "$1"の部分には自動で拡張子が入ります。

### ロールオーバーの設定条件を詳細設定

例えば、画像ファイル名と拡張子の間に"_a"をつけたアクティブ時の画像を用意しており、通常時の画像とアクティブ時の画像両方にロールオーバー設定したい場合、次のように正規表現で設定します。

#### 例

    $(function() {
        $(".roll").rollover({
            replaceCond: /(_a)?(\.[^\.]+)$/,    // 画像ファイル名の検索条件
            replaceStr: "_o$2"                  // 画像ファイル名の置換条件
        });
    });

## リリースノート

### 1.2.3

開発完了、正式版としてリリース。

## 謝辞

本プラグイン開発にあたり、[株式会社ミツエーリンクス](http://www.mitsue.co.jp/)にて公開されている[MJL — MITSUE-LINKS JavaScript Library](http://www.mitsue.co.jp/service/produce/mjl.html)を参考にさせていただきました。この場をお借りして、厚くお礼申し上げます。
