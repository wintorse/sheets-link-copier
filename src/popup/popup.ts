import type { EmojiNames } from "../types/types";
import { defaultEmojiNames } from "../types/constants";

const emojiElements: { [key in keyof EmojiNames]: string } = {
  googleSheets: "emojiName-google-sheets",
  googleDocs: "emojiName-google-docs",
  googleSlides: "emojiName-google-slides",
  googleDrive: "emojiName-google-drive",
  github: "emojiName-github",
  githubPullRequest: "emojiName-github-pull-request",
  githubIssue: "emojiName-github-issue",
  jiraIssue: "emojiName-jira-issue",
  asanaTask: "emojiName-asana-task",
  backlogIssue: "emojiName-backlog-issue",
  redmineTicket: "emojiName-redmine-ticket",
};

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

// Get emoji names when the page is loaded and reflect them in the form.
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

document.getElementById("updateEmojiNames")?.addEventListener("click", () => {
  updateEmojiNames();
});
