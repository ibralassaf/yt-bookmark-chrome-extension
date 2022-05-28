(() => {
    //for accessing the youtube player and accessing the controls
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => { //listener that's going to listen to tabs
        const { type, value, videoId } = obj;

        if (type === "NEW") { //if it has type new it will set the current video to the video id 
            currentVideo = videoId;
            newVideoLoaded();
        } else if (type === "PLAY") {
            youtubePlayer.currentTime = value; //if it has type play it will set the current time to the value
        } else if (type === "DELETE") {
            currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time !== value); //if it has type delete it will filter the current video bookmarks and remove the bookmark with the value
            chrome.storage.sync.set({
                [currentVideo]: JSON.stringify(currentVideoBookmarks)
            }); //set the current video bookmarks to the current video bookmarks

            response(currentVideoBookmarks); //send the current video bookmarks back to the popup
        }
    });

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get(currentVideo, (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []); //if there is a value for the current video it will parse it and return it
            });
        });
    }
    const newVideoLoaded = async() => {
        //check if the bookmark button exists
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        currentVideoBookmarks = await fetchBookmarks();

        if (!bookmarkBtnExists) {
            //create a new bookmark button
            const bookmarkBtn = document.createElement("img");

            //set the src to the bookmark icon
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            //set the class name to the bookmark button
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            //set the title to the bookmark button
            bookmarkBtn.title = "Click to bookmark current timestamp";

            //set the youtube left controls to the left controls
            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            //set the youtube player to the player
            youtubePlayer = document.getElementsByClassName("video-stream")[0];

            //append the bookmark button to the youtube left controls
            youtubeLeftControls.appendChild(bookmarkBtn);

            //add an event listener to listen to any clicks and add a new bookmark using the addNewBookmarkEventHandler function
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);


        }
    }
    const addNewBookmarkEventHandler = async() => {
        //get the current time of the video
        const currentTime = youtubePlayer.currentTime;
        //create a new bookmark object
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime), //getTime function going to convert seconds to a time
        };

        currentVideoBookmarks = await fetchBookmarks(); //fetch the bookmarks for the current video


        //set the current video bookmarks to the current video bookmarks
        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)) //note: need to save date in JSON format for the storage so we used JSON.stringify
        });
    }


    //calls newVideoLoaded function anytime we hit the match pattern of youtube.com/watch
    newVideoLoaded();
})();


const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);

    return date.toISOString().substr(11, 8);
};