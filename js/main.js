import PreciseVideoPlayer from "./preciseVideoPlayer.js";
import PlaybackController from "./playbackController.js";

// URLs for PNG-sequences, adjust to use custom videos
const baseURL = "/media/FerrisWheel/";
const highQ = "Q30/thumb";
const lowQ = "Q60/thumb";

// Canvas to render high quality video & video player object
const canvasHQ = document.getElementById("video-high-quality");
let playerHQ = new PreciseVideoPlayer(canvasHQ, baseURL + highQ);

// Canvas to render low quality video & video player object
const canvasLQ = document.getElementById("video-low-quality");
let playerLQ = new PreciseVideoPlayer(canvasLQ, baseURL + lowQ);

// playback controller, keeps frames in sync between low and high quality player
let playbackController = new PlaybackController(24);
playbackController.addPlayer(playerLQ);
playbackController.addPlayer(playerHQ);

//////////////////////////////////////////////////////////////
//               Prepare Button Listener
//////////////////////////////////////////////////////////////

let btnPlayForward = document.getElementById("btn-play-forward");
btnPlayForward.onclick = () => {
    if (
        !playbackController.isPlaying ||
        (playbackController.isPlaying && !playbackController.forward)
    ) {
        playbackController.setDirection(true);
        playbackController.setPlay(true);
        btnPlayForward.classList.add("active");
        btnPlayBackward.classList.remove("active");
    } else {
        playbackController.setPlay(false);
        btnPlayForward.classList.remove("active");
    }
};

let btnPlayBackward = document.getElementById("btn-play-backward");
btnPlayBackward.onclick = () => {
    if (
        !playbackController.isPlaying ||
        (playbackController.isPlaying && playbackController.forward)
    ) {
        playbackController.setDirection(false);
        playbackController.setPlay(true);
        btnPlayBackward.classList.add("active");
        btnPlayForward.classList.remove("active");
    } else {
        playbackController.setPlay(false);
        btnPlayBackward.classList.remove("active");
    }
};

let btnNextFrame = document.getElementById("btn-next-frame");
btnNextFrame.onclick = () => {
    playbackController.nextFrame();
};

let btnPrevFrame = document.getElementById("btn-prev-frame");
btnPrevFrame.onclick = () => {
    playbackController.prevFrame();
};

let metricsTable = document.getElementById("metrics-table");
createTable()

// Start Render loop
render();

// Render loop, updates frames during playback
function render() {
    playbackController.render();
    requestAnimationFrame(render);
}

/**
 * Creates table for metrics values
 */
function createTable() {
    createPart("Max");
    createPart("Sad");
    createPart("Mad");
    createPart("Mse");
    createPart("Psnr");
}

/**
 * Helper method to create rows and columns for a table
 * @param metricsName
 */
function createPart(metricsName) {
    const rowTitle = document.createElement('tr');
    const columnR = document.createElement('td');
    const columnG = document.createElement('td');
    const columnB = document.createElement('td');
    const title = document.createElement('td');
    title.setAttribute("rowspan", "4");
    columnR.appendChild(document.createTextNode('R'));
    columnR.setAttribute("class", "red-text");
    columnG.appendChild(document.createTextNode('G'));
    columnG.setAttribute("class", "green-text");
    columnB.appendChild(document.createTextNode('B'));
    columnB.setAttribute("class", "blue-text");
    title.appendChild(document.createTextNode(metricsName.toUpperCase()));
    rowTitle.appendChild(title);
    rowTitle.appendChild(columnR);
    rowTitle.appendChild(columnG);
    rowTitle.appendChild(columnB);
    let rowValues = document.createElement('tr');
    let columnRvalue = document.createElement('td');
    columnRvalue.setAttribute("id", "red" + metricsName);
    let columnGvalue = document.createElement('td');
    columnGvalue.setAttribute("id", "green" + metricsName);
    let columnBvalue = document.createElement('td');
    columnBvalue.setAttribute("id", "blue" + metricsName);
    rowValues.appendChild(columnRvalue)
    rowValues.appendChild(columnGvalue)
    rowValues.appendChild(columnBvalue);
    const rowTitleMean = document.createElement('tr');
    const columnRmean = document.createElement('td');
    const columnGmean = document.createElement('td');
    const columnBmean = document.createElement('td');
    columnRmean.appendChild(document.createTextNode('Mean-R'));
    columnRmean.setAttribute("class", "red-text");
    columnGmean.appendChild(document.createTextNode('Mean-G'));
    columnGmean.setAttribute("class", "green-text");
    columnBmean.appendChild(document.createTextNode('Mean-B'));
    columnBmean.setAttribute("class", "blue-text");
    rowTitleMean.appendChild(columnRmean)
    rowTitleMean.appendChild(columnGmean)
    rowTitleMean.appendChild(columnBmean)
    let rowValuesMean = document.createElement('tr');
    let columnRvalueMean = document.createElement('td');
    columnRvalueMean.setAttribute("id", "red" + metricsName + "Mean");
    let columnGvalueMean = document.createElement('td');
    columnGvalueMean.setAttribute("id", "green" + metricsName + "Mean");
    let columnBvalueMean = document.createElement('td');
    columnBvalueMean.setAttribute("id", "blue" + metricsName + "Mean");
    rowValuesMean.appendChild(columnRvalueMean)
    rowValuesMean.appendChild(columnGvalueMean)
    rowValuesMean.appendChild(columnBvalueMean);
    metricsTable.appendChild(rowTitle);
    metricsTable.appendChild(rowValues);
    metricsTable.appendChild(rowTitleMean);
    metricsTable.appendChild(rowValuesMean);
}
