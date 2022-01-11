const maxRedArray = [], maxGreenArray = [], maxBlueArray = [];
const sadRedArray = [], sadGreenArray = [], sadBlueArray = [];
const madRedArray = [], madGreenArray = [], madBlueArray = [];
const mseRedArray = [], mseGreenArray = [], mseBlueArray = [];
const psnrRedArray = [], psnrGreenArray = [], psnrBlueArray = [];
//all arrays together for future iterations
const globalArray = [maxRedArray, maxGreenArray, maxBlueArray, sadRedArray, sadGreenArray, sadBlueArray, madRedArray, madGreenArray, madBlueArray, mseRedArray, mseGreenArray, mseBlueArray, psnrRedArray, psnrGreenArray, psnrBlueArray];
const namesArray = ["redMax", "greenMax", "blueMax", "redSad", "greenSad", "blueSad", "redMad", "greenMad", "blueMad", "redMse", "greenMse", "blueMse", "redPsnr", "greenPsnr", "bluePsnr"]

class PlaybackController {
    /**
     * Constructor, creates a PlaybackController object
     * with a given framerate. Needs player-objects to work
     * properly. Players are added using addPlayer method.
     *
     * @param {number} framerate - the desired framerate for playback
     */
    constructor(framerate) {
        this.framerate = framerate;
        this.millisPerFrame = 1000 / this.framerate;

        this.isPlaying = false;
        this.forward = true;

        this.player = [];
    }


    /**
     * Adds a player to the array of videoplayers controlled by this PlaybackController
     *
     * @param {preciseVideoPlayer} newPlayer - object of PreciseVideoPlayer class,
     * that will be controlled using this PlaybackController
     */
    addPlayer(newPlayer) {
        this.player.push(newPlayer);
    }

    /**
     * Should be called from an update-loop.
     *
     * Checks if a new frame should be rendered based on the time that passed
     * since the last refresh.
     */
    render() {
        if (!this.isPlaying) {
            return;
        }

        let deltaT = performance.now() - this.timestamp;
        while (deltaT > this.millisPerFrame) {
            this.startReadingData();
            this.updatePlayerFrames();
            deltaT -= this.millisPerFrame;
        }

    }

    /**
     * Calls the correct method to render the next frame of all added
     * PreciseVideoPlayers. Based on the forward-variable this is either
     * nextFrame or prevFrame.
     */
    updatePlayerFrames() {
        let frameMethod = this.forward ? "nextFrame" : "prevFrame";
        this.player.forEach((player) => {
            player[frameMethod]();
            this.timestamp = performance.now();
        });
    }

    /**
     * Controls wether the PlaybackController is in automated playback mode or paused
     *
     * @param {bool} play - True for automated playback, false for pause
     */
    setPlay(play) {
        this.isPlaying = play;
        if (this.isPlaying) {
            this.timestamp = performance.now();
        }
    }

    /**
     * The PlaybackController can play a video forward and backward, this methods sets
     * the current direction.
     *
     * @param {bool} isForward - true to set the playback direction to forward, false for backward
     */
    setDirection(isForward) {
        this.forward = isForward;
    }

    nextFrame() {
        this.player[0].nextFrame();
        this.player[1].nextFrame();
        this.startReadingData();
    }

    prevFrame() {
        this.player[0].prevFrame();
        this.player[1].prevFrame();
        this.startReadingData();
    }

    /**
     * Checks if data was already calculated and saved
     * @param currentIndex
     * @returns {boolean}
     */
    isDefined(currentIndex) {
        for (let i = 0; i < globalArray.length; i++) {
            if (globalArray[i][currentIndex] === undefined) {
                return false;
            }
        }
        return true;
    }

    /**
     * starts reading data. If there is no data read and saved before - calls calculation method,
     * when the data was already calculated - reads the saved Info
     */
    startReadingData() {
        let currentIndex = this.player[0].getCurrentIndex();
        if (this.isDefined(currentIndex)) {
            this.read(currentIndex);
        } else {
            this.calculate(currentIndex);
        }
    }

    /**
     * reads saved data from array for each index
     * @param currentIndex
     */
    read(currentIndex) {
        for (let i = 0; i < namesArray.length; i++) {
            for (let j = 0; j < globalArray.length; j++) {
                document.getElementById(namesArray[i]).innerHTML = globalArray[j][currentIndex]
            }
        }
    }

    /**
     * calculates metrics values if it wasn't done before for each index
     * @param currentIndex
     */
    calculate(currentIndex) {
        let ctx1 = this.player[0].ctx
        let ctx2 = this.player[1].ctx

        let redMax = 0, greenMax = 0, blueMax = 0;
        let redSad = 0, greenSad = 0, blueSad = 0;
        let redMse = 0, greenMse = 0, blueMse = 0;
        let redMad, greenMad, blueMad;
        let redPsnr, greenPsnr, bluePsnr;
        let width = Math.max(this.player[0].canvas.width, this.player[1].canvas.width);
        let height = Math.max(this.player[0].canvas.height, this.player[1].canvas.height);
        for (let i = 0; i < height; i = i + 1) {
            for (let j = 0; j < width; j = j + 1) {
                let pixelsPlayer1 = ctx1.getImageData(i, j, 1, 1).data;
                let pixelsPlayer2 = ctx2.getImageData(i, j, 1, 1).data;
                let deltaR = Math.abs(pixelsPlayer1[0] - pixelsPlayer2[0]);
                let deltaG = Math.abs(pixelsPlayer1[1] - pixelsPlayer2[1]);
                let deltaB = Math.abs(pixelsPlayer1[2] - pixelsPlayer2[2]);
                redMax = Math.max(deltaR, redMax);
                greenMax = Math.max(deltaG, greenMax);
                blueMax = Math.max(deltaB, blueMax);
                redSad = redSad + deltaR;
                greenSad = greenSad + deltaG;
                blueSad = blueSad + deltaB;
                redMse = redMse + deltaR * deltaR;
                greenMse = greenMse + deltaG * deltaG;
                blueMse = blueMse + deltaB * deltaB;
            }
        }

        redMad = (redSad / height) * width;
        greenMad = (greenSad / height) * width;
        blueMad = (blueSad / height) * width;

        redMse = (redMse / height) * width;
        greenMse = (greenMse / height) * width;
        blueMse = (blueMse / height) * width;

        redPsnr = 10 * Math.log10(255 * Math.sqrt(redMse));
        greenPsnr = 10 * Math.log10(255 * Math.sqrt(greenMse));
        bluePsnr = 10 * Math.log10(255 * Math.sqrt(blueMse));

        let resultsArray = [redMax, greenMax, blueMax, redSad, greenSad, blueSad, redMad, greenMad, blueMad, redMse, greenMse, blueMse, redPsnr, greenPsnr, bluePsnr]
        for (let i = 0; i < namesArray.length; i++) {
            document.getElementById(namesArray[i]).innerHTML = resultsArray[i].toString()
            globalArray[i][currentIndex] = resultsArray[i]
        }
        this.calculateMean()
        this.drawHistogram()
    }

    /**
     * Sets the mean value in table
     */
    calculateMean() {
        for (let i = 0; i < namesArray.length; i++) {
            document.getElementById(namesArray[i] + "Mean").innerHTML = this.getMeanValue(globalArray[i]).toString();
        }
    }

    /**
     * draws histogram for MAX values
     */
    drawHistogram() {
        const canvas = document.getElementById('histogram');
        const ctx = canvas.getContext('2d');
        let marginBottom = 8;
        let startY = (canvas.height - marginBottom);
        let dx = canvas.width / 256;
        let dy = startY / 1000;
        ctx.lineWidth = dx;
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let R = 0, G = 0, B = 0;
        for (let i = 0; i < maxRedArray.length; i++) {
            let x = i * dx;
            // Red
            ctx.strokeStyle = "rgba(220,0,0,0.4)";
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY - (maxRedArray[i] * dy));
            ctx.closePath();
            ctx.stroke();
            // Green
            ctx.strokeStyle = "rgba(0,210,0,0.4)";
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY - (maxGreenArray[i] * dy));
            ctx.closePath();
            ctx.stroke();
            // Blue
            ctx.strokeStyle = "rgba(0,0,255,0.4)";
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY - (maxBlueArray[i] * dy));
            ctx.closePath();
            ctx.stroke();
        }

    }


    /**
     * Helper method to calculate the mean value
     * @param array array with values
     * @returns {number} mean value
     */
    getMeanValue(array) {
        let total = 0;
        let count = 0;
        for (let i = 0; i < array.length; i++) {
            total += array[i];
            count++;
        }
        return total / count;
    }
}

export default PlaybackController;
