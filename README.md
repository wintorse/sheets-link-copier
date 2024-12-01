# copylink.dev
Googleスプレッドシートなどでタイトルつきのリンクをコピーするブラウザ拡張機能

## 機能
「[◯◯◯◯設計書](https://example.com)」のような、タイトルのついたリンク（テキストリンク）を簡単にコピーできるショートカットを提供します。

特に以下のサイトでは、タイトルを整形する機能を備えており、また Slack にペーストすることを想定して Slack 絵文字とともにコピーする機能も持っています。
- Google スプレッドシート
- Google ドキュメント
- Google スライド
- GitHub Pull Request
- GitHub Issue
- Asana タスク

未対応のサイトでは、`document.title` のついたリンクをコピーします。

## インストール
[Chromeウェブストア](https://chromewebstore.google.com/)からインストールする

または
1. Releases から最新の zip ファイルをダウンロードして解凍する 
2. [chrome://extensions/](chrome://extensions/) にアクセスする
3. 右上の「デベロッパーモード」を有効にする
4. 「パッケージ化されていない拡張機能を読み込む」をクリックして解凍したフォルダを選択する

## 使い方
1. 対応サイトで以下のショートカットを実行する
2. お使いの各種ツール（Slack など）にペーストする

| 機能                            | Mac             | Windows        |
|--------------------------------|-----------------|----------------|
| リンクをコピー                   | `Ctrl+L`        | `Alt+L`        |
| リンクをコピー（Slack 絵文字つき） | `Ctrl+Shift+L`  | `Alt+Shift+L`  |
| タイトルをコピー                  | `Ctrl+T`        | `Alt+T`        |

ショートカットは[設定](chrome://extensions/shortcuts)から変更できます。

Slack 絵文字名の変更は拡張機能アイコンから行えます。

## ライセンス
MIT
