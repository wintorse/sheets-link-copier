type EmojiNames = {
  googleSheets: string;
  googleDocs: string;
  googleSlides: string;
  googleDrive: string;
  github: string;
  githubPullRequest: string;
  githubIssue: string;
  asanaTask: string;
};

const emojiElements: { [key in keyof EmojiNames]: string } = {
  googleSheets: "emojiName-google-sheets",
  googleDocs: "emojiName-google-docs",
  googleSlides: "emojiName-google-slides",
  googleDrive: "emojiName-google-drive",
  github: "emojiName-github",
  githubPullRequest: "emojiName-github-pull-request",
  githubIssue: "emojiName-github-issue",
  asanaTask: "emojiName-asana-task",
};

const defaultEmojiNames: EmojiNames = {
  googleSheets: ":google_sheets:",
  googleDocs: ":google_docs:",
  googleSlides: ":google_slides:",
  googleDrive: ":google_drive_2:",
  github: ":github:",
  githubPullRequest: ":open_pull_request:",
  githubIssue: ":open_issue:",
  asanaTask: ":asana:",
};

// 絵文字名の取得
function getEmojiNames() {
  chrome.storage.local.get("emojiNames", function (data) {
    const emojiNames: EmojiNames = data.emojiNames || defaultEmojiNames;
    if (emojiNames) {
      for (const key in emojiElements) {
        const element = document.getElementById(
          emojiElements[key as keyof EmojiNames]
        ) as HTMLInputElement;
        if (element) {
          element.value = emojiNames[key as keyof EmojiNames] ?? "";
        }
      }
    }
  });
}

// 絵文字名の更新
function updateEmojiNames() {
  const emojiNames: Partial<EmojiNames> = {};
  for (const key in emojiElements) {
    const element = document.getElementById(
      emojiElements[key as keyof EmojiNames]
    ) as HTMLInputElement;
    if (element) {
      emojiNames[key as keyof EmojiNames] = element.value;
    }
  }
  chrome.storage.local.set({ emojiNames: emojiNames });
}

// 初期表示時に絵文字名を取得してフォームに反映
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("emojiNames", function (data) {
    if (!data.emojiNames) {
      chrome.storage.local.set(
        { emojiNames: defaultEmojiNames },
        getEmojiNames
      );
    } else {
      getEmojiNames();
    }
  });
});

// ボタンのクリックイベントをlisten
document.getElementById("updateEmojiNames")?.addEventListener("click", () => {
  updateEmojiNames();
});
