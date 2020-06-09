browser.contextMenus.create({
    id: "copy-video-to-clipboard",
    title: browser.i18n.getMessage("copyMenuTitle"),
    contexts: ["video"],
});
browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "copy-video-to-clipboard") {
        // clipboard-helper.js defines function copyToClipboard.

        const code = `
            var video = browser.menus.getTargetElement(${info.targetElementId});
            var url = new URL(encodeURI(video.currentSrc));
            var videoTime = formatNPT(video.currentTime);
            url.hash = "t=" + videoTime;
            copyToClipboard(url);
        `;

        browser.tabs.executeScript({
            code: "typeof copyToClipboard === 'function';",
        }).then((results) => {
            // The content script's last expression will be true if the function
            // has been defined. If this is not the case, then we need to run
            // clipboard-helper.js to define function copyToClipboard.
            if (!results || results[0] !== true) {
                return browser.tabs.executeScript(tab.id, {
                    file: "clipboard-helper.js",
                });
            }
        }).then(() => {
            return browser.tabs.executeScript(tab.id, {
                frameId: info.frameId,
                code,
            });
        }).catch((error) => {
            // This could happen if the extension is not allowed to run code in
            // the page, for example if the tab is a privileged page.
            console.error("Failed to copy text: " + error);
        });
    }
});
