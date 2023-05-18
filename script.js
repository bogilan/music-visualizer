// Get a reference to the canvas element and create a 2D drawing context.
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

// Buttons
const playBtn = document.querySelector('.play');
const pauseBtn = document.querySelector('.pause');
const stopBtn = document.querySelector('.stop');

// Variable to track visualization state
let isPaused = false;

// Create an Audio element and set its src property to the URL of an audio file.
const audio = new Audio();
audio.src = 'inspire.mp3';

// Create an AudioContext object and use it to create an AnalyserNode.
const audioContext = new AudioContext();
const source = audioContext.createMediaElementSource(audio);
const analyser = audioContext.createAnalyser();

// Connect the Audio element to the AnalyserNode, and connect theAnalyserNode to the AudioContext destination.
source.connect(analyser);
analyser.connect(audioContext.destination);

// Get the number of frequency bins in the AnalyserNode, and create a new Uint8Array with that length to hold the frequency data.
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Define a draw function that will be called repeatedly to update the visualizer.
function draw() {
    // Only draw if not paused
    // If paused, visualization stops and freezes
    if (isPaused) {
      return;
    } 

    // Schedule the next call to draw.
    requestAnimationFrame(draw);

    // Get the frequency data into the dataArray.
    analyser.getByteFrequencyData(dataArray);

    // Clear the Canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Loop over the frequency data array and draw a rectangle for each frequency bin.
    const barWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      // Set the fill style of the rectangle based on the current frequency value.
      const hue = i / bufferLength * 360;
      const color = `hsla(${hue}, 100%, 50%, 1)`;
      ctx.fillStyle = color;
       // Draw the rectangle at the appropriate position and size on the canvas.
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
}

// Play the audio file when the user clicks on PLAY button.
playBtn.addEventListener('click', function() {
    isPaused = false; // Resume visualization
    audio.play();
    // Music by: https://www.bensound.com/free-music-for-videos
    // License code: 9NF0OTIYZCXIRVJN

    // Start the AudioContext
    audioContext.resume();
    
    // Call the draw function to start the visualizer.
    draw();
});
  
 // Pause the audio file and visualization when the user clicks on PAUSE button.
 pauseBtn.addEventListener('click', function() {
    isPaused = true; // Pause visualization
    audio.pause();
});

// Stop the audio file and visualization when the user clicks on STOP button.
stopBtn.addEventListener('click', function() {
    isPaused = false; // Resume visualization
    audio.currentTime = 0; // Reset audio playback to the beginning
    audio.pause();
    draw();
});