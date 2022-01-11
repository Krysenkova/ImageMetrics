class PreciseVideoPlayer {
	/**
	 * Constructor for a precise videoplayer. Handles logic to fetch
	 * a number of preceding and following images to allow for smooth
	 * playback in forward and backward direction.
	 *
	 * @param {*} canvasEl - output canvas element
	 * @param {*} baseURL - fetch url where frames are stored
	 */
	constructor(canvasEl, baseURL) {
		this.minFrameIndex = 0;
		this.maxFrameIndex = 853;

		this.canvas = canvasEl;
		this.ctx = this.canvas.getContext("2d");

		this.imgPrefix = baseURL;
		this.imgBuffer = [];

		this.prepare();

		let currentIndex = this.currentFrameIndex - this.lowestFrameIndex;
		this.imgBuffer[currentIndex].onload = () => {
			this.canvas.width = this.imgBuffer[currentIndex].naturalWidth;
			this.canvas.height = this.imgBuffer[currentIndex].naturalHeight;
			this.canvasSizeSet = true;
			this.available = true;
			this.renderFrame();
		};
	}

	/**
	 * Method that fetches the first 50 frames from the server and
	 * places the current frame index in the middle of the image range.
	 */
	prepare() {
		// Init Indices
		this.currentFrameIndex = 25;
		this.lowestFrameIndex = 25;
		this.highestFrameIndex = 75;

		// fetch first 50 frames
		this.fetchForwardFrames(50);
	}

	/**
	 * Moves the current frame one index ahead and renders the new
	 * image.
	 *
	 * Involves two important checks:
	 * - is the new position close to the last fetched index
	 * and therefore a new fetch necessary?
	 * - is the new position far away from the lowest index
	 * that these images can be removed from the local buffer?
	 */
	nextFrame() {
		if (this.currentFrameIndex <= this.maxFrameIndex) {
			this.currentFrameIndex++;
			this.renderFrame();
		}

		// Check if new fetch is necessary
		if (
			this.highestFrameIndex < this.maxFrameIndex &&
			this.highestFrameIndex - this.currentFrameIndex < 20
		) {
			this.fetchForwardFrames(30);
		}

		// Check if old frames can get removed
		if (this.currentFrameIndex - this.lowestFrameIndex > 30) {
			this.imgBuffer.shift();
			this.lowestFrameIndex++;
		}
	}

	/**
	 * Moves the current frame one index back and renders the
	 * new image.
	 *
	 * Involves two important checks:
	 * - is the new position close to the lowest fetched index
	 * and therefore a new fetch (backward) necessary?
	 * - is the new position far away from the highest index
	 * that these images can be removed from the local buffer?
	 */
	prevFrame() {
		if (this.currentFrameIndex >= this.minFrameIndex) {
			this.currentFrameIndex--;
			this.renderFrame();
		}

		// Check if new fetch is necessary
		if (
			this.lowestFrameIndex > this.minFrameIndex &&
			this.currentFrameIndex - this.lowestFrameIndex < 20
		) {
			this.fetchBackwardFrames(30);
		}

		// Check if old frames can get removed
		if (this.highestFrameIndex - this.currentFrameIndex > 30) {
			this.imgBuffer.pop();
			this.highestFrameIndex--;
		}
	}

	/**
	 * Draws the frame of the current index to the canvas.
	 * Sets variable to inform that a new frame is available.
	 *
	 * Ensures that the canvas width and height are set correctly,
	 * based on the images size.
	 */
	renderFrame() {
		let index = this.currentFrameIndex - this.lowestFrameIndex;

		if (this.imgBuffer[index] && this.imgBuffer[index].complete) {
			if (!this.canvasSizeSet) {
				this.canvasSizeSet = true;
				this.canvas.width = this.imgBuffer[index].naturalWidth;
				this.canvas.height = this.imgBuffer[index].naturalHeight;
			}
			// Draw new frame
			this.ctx.drawImage(this.imgBuffer[index], 0, 0);
			this.available = true;
		}
	}

	/**
	 * Checks if the bool this.available is true and sets it to false
	 * (returning the initial value). Helpful for checking if the current
	 * frame was already processed / analyzed.
	 */
	newFrameAvailable() {
		let result = this.available;
		this.available = false;
		return result;
	}

	/**
	 * Fetches the specified amount of frames from the server
	 * in forward direction. Checks for valid bounds.
	 *
	 * @param {number} amount - Amount of frames that should be fetched
	 */
	fetchForwardFrames(amount) {
		let upperThreshold = Math.min(
			this.maxFrameIndex,
			this.highestFrameIndex + amount
		);

		//console.log("Fetching Frames (forward) - from: "+(this.highestFrameIndex + 1) +
		//" / to: "+upperThreshold);

		for (let i = this.highestFrameIndex + 1; i <= upperThreshold; i++) {
			let imgURL = this.imgPrefix + i.toString().padStart(4, "0") + ".png";

			this.imgBuffer.push(new Image());
			this.imgBuffer[this.imgBuffer.length - 1].src = imgURL;
		}

		this.highestFrameIndex = upperThreshold;
	}

	/**
	 * Fetches the specified amount of frames from the server
	 * in backward direction. Checks for valid bounds.
	 *
	 * @param {number} amount - Amount of frames that should be fetched
	 */
	fetchBackwardFrames(amount) {
		// Prevent Indices lower zero
		const lowerThreshold = Math.max(0, this.lowestFrameIndex - amount);

		//console.log("Fetching Frames (backwards) - from: "+(this.lowestFrameIndex + -1) +
		//" / to: "+lowerThreshold);

		for (let i = this.lowestFrameIndex - 1; i >= lowerThreshold; i--) {
			let imgURL = this.imgPrefix + i.toString().padStart(4, "0") + ".png";

			this.imgBuffer.unshift(new Image());
			this.imgBuffer[0].src = imgURL;
		}

		this.lowestFrameIndex = lowerThreshold;
	}

	getCurrentIndex(){
		return this.currentFrameIndex - this.lowestFrameIndex;
	}
}

export default PreciseVideoPlayer;
