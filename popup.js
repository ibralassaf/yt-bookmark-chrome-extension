import { getActiveTabURL } from "./utils.js";

// adding a new bookmark row to the popup
const addNewBookmark = (bookmarks, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const controlsElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");

    //display what the bookmark is and give it a title
    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";
    controlsElement.className = "bookmark-controls"; //styling the bookmark

    setBookmarkAttributes("play", onPlay, controlsElement); //set the play button
    setBookmarkAttributes("delete", onDelete, controlsElement); //set the delete button

    //display the time of the bookmark
    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    //add the bookmark to the bookmarks element
    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);
    bookmarks.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks = []) => {
    // if there are not any bookmarks, set it to nothing
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";

    // if there are bookmarks, loop through them and add them to the bookmarks element
    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        }
    } else {
        // if there are no bookmarks, add a message to the bookmarks element
        bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
    }

    return;
};

const onPlay = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp"); // get the timestamp of the bookmark
    const activeTab = await getActiveTabURL(); // get the url of the current tab

    chrome.tabs.sendMessage(activeTab.id, {
        type: "PLAY",
        value: bookmarkTime,
    });
};

const onDelete = async e => {
    const activeTab = await getActiveTabURL();
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp"); //get the timestamp of the bookmark
    const bookmarkElementToDelete = document.getElementById( //get the bookmark element to delete
        "bookmark-" + bookmarkTime
    );

    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

    chrome.tabs.sendMessage(activeTab.id, {
        type: "DELETE",
        value: bookmarkTime,
    }, viewBookmarks);
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");

    controlElement.src = "assets/" + src + ".png"; // set the src of the control element
    controlElement.title = src; // set the event listener of the control element
    controlElement.addEventListener("click", eventListener);
    controlParentElement.appendChild(controlElement); // add the control element to the control parent element
};

//fires when the popup or html is loaded
document.addEventListener("DOMContentLoaded", async() => {
    const activeTab = await getActiveTabURL();
    const queryParameters = activeTab.url.split("?")[1]; //get the video id from the url
    const urlParameters = new URLSearchParams(queryParameters); //to get the unique identifier

    const currentVideo = urlParameters.get("v"); //this to able to get the video id from the url

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        //get any current video bookmarks from chrome storage
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

            viewBookmarks(currentVideoBookmarks); //parse the bookmarks and add them to the popup
        });
    } else {
        //if we are not in a youtube video page it will display message in the popup
        const container = document.getElementsByClassName("container")[0];

        container.innerHTML = '<div class="title">This is not a youtube video page.</div>';
    }
});