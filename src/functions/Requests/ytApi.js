/* eslint-disable no-unused-vars */
class YouTubePlayerManager {
    constructor(playerElementId, videoId, onReadyCallback) {
        this.playerElementId = playerElementId;
        this.videoId = videoId;
        this.onReadyCallback = onReadyCallback;
        this.player = null;
        this.loadYouTubeAPI()
        this.firstTime = false
        
    }

    loadYouTubeAPI() {
        if (!window.YT) {
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            script.id = "ytApiId"
            script.async = false;
            document.body.appendChild(script);
            this.firstTime = true

        }
        
        window.onYouTubeIframeAPIReady = this.onYouTubeAPIReady.bind(this);
    }

    onYouTubeAPIReady() {
        this.player = new window.YT.Player(this.playerElementId, {
            height: '315',
            width: '560',
            videoId: this.videoId,
            playerVars: {
                controls: 0,           // Hide controls
                modestbranding: 1,     // Hide YouTube logo
                showinfo: 0,           // Deprecated, but included for completeness
                rel: 0,                // Disable related videos at the end
                fs: 0,                 // Enable fullscreen button
                autoplay: 0,           // Autoplay video
                cc_load_policy: 0,     // Hide closed captions
                iv_load_policy: 3      // Hide video annotations
            },
            events: {
                onReady: this.onReadyCallback
            }
        });
    }

    play() {
        if (this.player && typeof this.player.playVideo === 'function') {
            this.player.playVideo();
        }
    }

    pause() {
        if (this.player && typeof this.player.pauseVideo === 'function') {
            this.player.pauseVideo();
        }
    }

    seek(seconds) {
        if (this.player && typeof this.player.seekTo === 'function') {
            this.player.seekTo(seconds, true);
        }
    }

    /**
     * Converts a digit ranging from 1 to 100 into a timing position of the video
     * and seeks to that position.
     * @param {number} digit - The digit ranging from 1 to 100.
     */
    seekToPercentage(digit) {
        if (digit < 1 || digit > 100) {
            throw new Error('Digit must be in the range of 1 to 100');
        }
        if (this.player && typeof this.player.getDuration === 'function') {
            const videoDuration = this.player.getDuration();
            const position = (digit / 100) * videoDuration;
            this.seek(position);
        } else {
            throw new Error('Player is not initialized or getDuration method is not available');
        }
    }

    /**
     * Returns the current playback time and total duration of the video.
     * @returns {Object} An object containing currentTime and duration.
     */
    getCurrentTimeAndDuration() {
        if (this.player) {
            const currentTime = this.player.getCurrentTime();
            const duration = this.player.getDuration();
            return {
                currentTime: currentTime,
                duration: duration
            };
        } else {
            throw new Error('Player is not initialized');
        }
    }


    getPercentageFromPosition(position) {
        if (position < 0 || position > this.player.getDuration()) {
            throw new Error('Position must be within the range of 0 to the video duration');
        }
        if (this.player && typeof this.player.getDuration === 'function') {
            const videoDuration = this.player.getDuration();
            const percentage = (position / videoDuration) * 100;
            return percentage;
        } else {
            throw new Error('Player is not initialized or getDuration method is not available');
        }
    }
}

export default YouTubePlayerManager;
