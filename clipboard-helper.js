function copyToClipboard(url) {
    function oncopy(event) {
        document.removeEventListener("copy", oncopy, true);
        // Hide the event from the page to prevent tampering.
        event.stopImmediatePropagation();

        // Overwrite the clipboard content.
        event.preventDefault();
        event.clipboardData.setData("text/plain", url);
    }
    document.addEventListener("copy", oncopy, true);

    // Requires the clipboardWrite permission, or a user gesture:
    document.execCommand("copy");
}

function formatNPT(seconds) {
    // format npt-sec to npt-hhmmss
    // see also: https://www.ietf.org/rfc/rfc2326.txt
    var npt = new Date(seconds * 1000).toISOString().substr(11, 8);
    if(seconds >= 86400) {
        // fix time overflow at 24 hours
        npt = npt.replace(/(\d+)(:.*)/, (match, hours, rest) => ~~(seconds / 3600) + rest);
    }
    return npt;
}
