chrome.commands.onCommand.addListener((command) => {
  if (command === "copy-link") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let activeTabId = tabs[0].id;
      if (!activeTabId || activeTabId === chrome.tabs.TAB_ID_NONE) {
        console.error("No active tab found");
        return;
      }
      chrome.scripting.executeScript({
        target: { tabId: activeTabId },
        func: copyTextLink,
      });
    });
  }
});

function copyTextLink() {
  let inputElement;
  if (window.location.hostname === "docs.google.com") {
    inputElement = document.querySelector("#docs-title-widget > input");
  }
  if (inputElement) {
    const titleText = inputElement.value;
    const url = document.URL;
    const html = `<a href="${url}">${titleText}</a>`;
    // プレーンテキストと HTML をクリップボードにコピー
    navigator.clipboard
      .write([
        new ClipboardItem({
          "text/plain": new Blob([titleText], { type: "text/plain" }),
          "text/html": new Blob([html], { type: "text/html" }),
        }),
      ])
      .then(() => {
        showSnackbar("リンクをクリップボードにコピーしました");
      })
      .catch((err) => {
        console.error("Failed to copy link to clipboard", err);
        showSnackbar("リンクのコピーに失敗しました");
      });
  } else {
    showSnackbar("タイトルが見つかりません");
  }

  function showSnackbar(message) {
    const snackbar = document.createElement("div");
    snackbar.textContent = message;

    // スナックバーのスタイル設定
    // Google ドライブのスタイルを参考にしている
    snackbar.style.position = "fixed";
    snackbar.style.bottom = "24px";
    snackbar.style.left = "24px";
    snackbar.style.padding = "16px 24px 14px";
    snackbar.style.maxHeight = "calc(100% - 48px)";
    snackbar.style.maxWidth = "568px";
    snackbar.style.minHeight = "20px";
    snackbar.style.borderRadius = "0.25rem";
    snackbar.style.backgroundColor = "rgb(60, 64, 67)";
    snackbar.style.font =
      "400 0.875rem/1.25rem 'Roboto', 'Google Sans', Roboto, Arial, sans-serif";
    snackbar.style.letterSpacing = "0.0142857143em";
    snackbar.style.fontWeight = "400";
    snackbar.style.textAlign = "left";
    snackbar.style.color = "white";
    snackbar.style.zIndex = "1950";
    snackbar.style.transition = "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)";
    snackbar.style.transform = "translate3d(0, 80px, 0)";
    document.body.appendChild(snackbar);

    // スライドイン
    setTimeout(() => {
      snackbar.style.transform = "translate3d(0, 0, 0)";
    }, 10);

    // スライドアウト
    setTimeout(() => {
      snackbar.style.transform = "translate3d(0, 80px, 0)";
      setTimeout(() => {
        snackbar.remove();
      }, 150);
    }, 3000);
  }
}
