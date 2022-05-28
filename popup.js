import { getActiveTabURL } from './utils.js';


// adding a new bookmark row to the popup
const addNewBookmark = (bookmarksElement, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");

    //display what the bookmark is and give it a title
    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = 'bookmark-title';

    //display the time of the bookmark
    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = 'bookmark';
    newBookmarkElement.setAttribute("timestamp, " + bookmark.time);


    //add the bookmark to the bookmarks element
    newBookmarkElement.appendChild(bookmarkTitleElement);
    bookmarksElement.appendChild(newBookmarkElement);



};

const viewBookmarks = (currentBookmarks = []) => {
    // if there are not any bookmarks, set it to nothing
    const bookmarksElement = document.getElementById('bookmarks');
    bookmarksElement.innerHTML = '';

    // if there are bookmarks, loop through them and add them to the bookmarks element
    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        }

    } else {
        // if there are no bookmarks, add a message to the bookmarks element
        bookmarksElement.innerHTML = '<p>No bookmarks yet!</p>';
    }

};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement('img');
};

//fires when the popup or html is loaded
document.addEventListener("DOMContentLoaded", async() => {
    const activeTab = await getActiveTabURL();
    //get the video id from the url
    const queryParameters = activeTab.url.split("?")[1];
    //to get the unique identifier
    const urlParameters = new URLSearchParams(queryParameters);

    //this to able to get the video id from the url
    const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        //get any current video bookmarks from chrome storage
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

            //parse the bookmarks and add them to the popup
            viewBookmarks(currentVideoBookmarks);

        })
    } else {
        //if we are not in a youtube video page it will display message in the popup
        const container = document.getElementsByClassName("container")[0];

        container.innerHTML = '<div class="title">This is not a youtube video page</div>'
    }

});