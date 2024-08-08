const butterfly = document.getElementById('butterfly');
let speed = 10; // Interval in milliseconds
let step = 1; // Number of pixels to move in each step

let x = 0;
let y = 0;
let directionX = 1;
let directionY = 1;

function moveButterfly() {
    // Update position with a random step for more natural movement
    x += (Math.random() * step * directionX);
    y += (Math.random() * step * directionY);

    // Reverse direction if hitting screen boundaries
    if (x + butterfly.clientWidth >= window.innerWidth || x <= 0) {
        directionX *= -1;
    }
    if (y + butterfly.clientHeight >= window.innerHeight || y <= 0) {
        directionY *= -1;
    }

    // Apply new position
    butterfly.style.left = x + 'px';
    butterfly.style.top = y + 'px';

    butterfly.onclick = (e) => {
       step = 5
       setTimeout(() => {
        step = 1
       }, 1000)
    }

    // Continue animation
    setTimeout(moveButterfly, speed);
}


// Start the animation
moveButterfly();