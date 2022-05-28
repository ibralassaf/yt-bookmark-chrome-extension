//listener that's going to listen to tabs
chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) { //check if there is a tab url and if it contains youtube.com/watch
        const queryParameters = tab.url.split("?")[1]; //then set our query parameters to the url as a unique identifier
        const urlParameters = new URLSearchParams(queryParameters); //interface to work with search parameters

        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId: urlParameters.get("v"), //get the video id from the url
        });
    }
});