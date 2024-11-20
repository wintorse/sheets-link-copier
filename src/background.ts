const validCommands = ["copy-link", "copy-link-for-slack", "copy-title"];

// ショートカットキーが押されたときの処理
chrome.commands.onCommand.addListener((command: string) => {
  if (validCommands.includes(command)) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let activeTabId = tabs[0].id;
      if (!activeTabId || activeTabId === chrome.tabs.TAB_ID_NONE) {
        console.error("No active tab found");
        return;
      }
      chrome.scripting.executeScript({
        target: { tabId: activeTabId },
        func: copyTextLink,
        args: [command],
      });
    });
  }
});

/**
 * タイトルとリンクをクリップボードにコピーする
 * @param {"copy-link" | "copy-link-for-slack" | "copy-title"} args - コマンド
 * @returns
 */
function copyTextLink(args: string) {
  let title;
  switch (window.location.hostname) {
    case "docs.google.com":
      title = getGoogleDocsTitle();
      break;
    case "github.com":
      title = getGitHubTitle();
      break;
    case "app.asana.com":
      title = getAsanaTitle();
      break;
    default:
      title = document.title;
  }

  const url = document.URL;
  const html = `<a href="${url}">${title}</a>`;

  // タイトルのみをクリップボードにコピー
  if (args === "copy-title") {
    navigator.clipboard
      .writeText(title)
      .then(() => {
        showToast("タイトルをクリップボードにコピーしました");
      })
      .catch((err) => {
        console.error("Failed to copy title to clipboard", err);
        showToast("タイトルのコピーに失敗しました");
      });
    return;
  }

  // テキストリンクをコピー
  // プレーンテキストと HTML をクリップボードにコピーすると、テキストリンクとして貼り付けられる
  if (args === "copy-link") {
    navigator.clipboard
      .write([
        new ClipboardItem({
          "text/plain": new Blob([title], { type: "text/plain" }),
          "text/html": new Blob([html], { type: "text/html" }),
        }),
      ])
      .then(() => {
        showToast("リンクをクリップボードにコピーしました");
      })
      .catch((err) => {
        console.error("Failed to copy link to clipboard", err);
        showToast("リンクのコピーに失敗しました");
      });
  }

  // プレーンテキストと Slack 絵文字名つきの HTML をクリップボードにコピー
  if (args === "copy-link-for-slack") {
    chrome.storage.local.get("emojiNames", function (data) {
      const emojiNames = data.emojiNames || {
        googleSheets: ":google_sheets:",
        googleDocs: ":google_docs:",
        googleSlides: ":google_slides:",
        googleDrive: ":google_drive_2:",
        github: ":github:",
        githubPullRequest: ":open_pull_request:",
        githubIssue: ":open_issue:",
        asanaTask: ":asana:",
      };

      let emojiName = "";

      switch (window.location.hostname) {
        case "docs.google.com":
          switch (window.location.pathname.split("/")[1]) {
            case "spreadsheets":
              emojiName = emojiNames.googleSheets;
              break;
            case "document":
              emojiName = emojiNames.googleDocs;
              break;
            case "presentation":
              emojiName = emojiNames.googleSlides;
              break;
            default:
              emojiName = emojiNames.googleDrive;
          }
          break;
        case "drive.google.com":
          emojiName = emojiNames.googleDrive;
          break;
        case "github.com":
          switch (window.location.pathname.split("/")[3]) {
            case "pull":
              emojiName = emojiNames.githubPullRequest;
              break;
            case "issues":
              emojiName = emojiNames.githubIssue;
              break;
            default:
              emojiName = emojiNames.github;
          }
          break;
        case "app.asana.com":
          emojiName = emojiNames.asanaTask;
          break;
      }

      const html = `${emojiName}&nbsp;<a href="${url}">${title}</a>`;
      navigator.clipboard
        .write([
          new ClipboardItem({
            "text/plain": new Blob([title], { type: "text/plain" }),
            "text/html": new Blob([html], { type: "text/html" }),
          }),
        ])
        .then(() => {
          showToast("リンクをクリップボードにコピーしました");
        })
        .catch((err) => {
          console.error("Failed to copy link to clipboard", err);
          showToast("リンクのコピーに失敗しました");
        });
    });
  }

  /**
   * Google Docs/Sheets/Slides のタイトルを取得
   * @returns {string} タイトル
   */
  function getGoogleDocsTitle(): string {
    const titleInputElement = document.querySelector<HTMLInputElement>(
      "#docs-title-widget > input"
    );
    if (titleInputElement) {
      return titleInputElement.value;
    }
    return document.title;
  }

  /**
   * GitHub の Pull Request/Issue タイトルを取得
   * @returns {string} タイトル
   */
  function getGitHubTitle(): string {
    const titleBdiElement = document.querySelector(
      "#partial-discussion-header > div.gh-header-show > div > h1 > bdi"
    );
    const idSpanElement = document.querySelector(
      "#partial-discussion-header > div.gh-header-show > div > h1 > span"
    );
    if (titleBdiElement && idSpanElement) {
      return titleBdiElement.textContent + " " + idSpanElement.textContent;
    }
    return document.title;
  }

  /**
   * Asana のタスクタイトルを取得
   * @returns {string} タイトル
   */
  function getAsanaTitle(): string {
    const titleTextareaElement = document.querySelector<HTMLTextAreaElement>(
      "#TaskPrintView > div.UploadDropTargetAttachmentWrappingTextEditor.TaskPaneBody-attachmentDropTarget > div.DynamicBorderScrollable.DynamicBorderScrollable--canScrollDown.TaskPaneBody--scrollable > div > div > div.TaskPaneBody-main.Stack.Stack--align-stretch.Stack--direction-column.Stack--display-block.Stack--justify-start > div.TaskPane-resizeListenerContainer > div.TitleInput.TaskPaneTitle.Stack.Stack--align-start.Stack--direction-row.Stack--display-block.Stack--justify-start > div > textarea"
    );
    if (titleTextareaElement) {
      return titleTextareaElement.value;
    }
    return document.title;
  }

  /**
   * トーストを表示する
   * @param {string} message - メッセージ
   */
  function showToast(message: string) {
    const toast = document.createElement("div");
    toast.textContent = message;

    // トーストのスタイル設定
    // Google Spreadsheets、Google Driveのトーストを参考にしている
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.left = "24px";
    toast.style.padding = "14px 16px";
    toast.style.maxHeight = "calc(100% - 48px)";
    toast.style.maxWidth = "568px";
    toast.style.minHeight = "20px";
    toast.style.borderRadius = "4px";
    toast.style.backgroundColor = "rgb(30, 30, 30)";
    toast.style.boxShadow = "0 4px 8px 3px rgba(60, 64, 67, .15)";
    toast.style.fontFamily = "'Google Sans', Roboto, Arial, sans-serif";
    toast.style.fontSize = "14px";
    toast.style.fontWeight = "400";
    toast.style.textAlign = "left";
    toast.style.color = "#f2f2f2";
    toast.style.zIndex = "1004";
    toast.style.transition =
      "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
    toast.style.transform = "translate3d(0, 72px, 0)";
    toast.style.opacity = "0";
    document.body.appendChild(toast);

    // スライドイン・フェードイン
    setTimeout(() => {
      toast.style.transform = "translate3d(0, 0, 0)";
      toast.style.opacity = "1";
    }, 10);

    // スライドアウト・フェードアウト
    setTimeout(() => {
      toast.style.transform = "translate3d(0, 72px, 0)";
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.remove();
      }, 200);
    }, 3000);
  }
}
