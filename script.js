const scoreTxt = document.querySelector(".score");
const gameoverTxt = document.querySelector(".gameover");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const states = {
    GAME_OVER: "gameover",
    IDLE: "idle",
    FALL: "fall"
};

let state;
let boxes = [];
const boxHeight = 50;
const debris = {
    x: 0,
    width: 0
};

let scrollCounter;
let cameraY;
let currentIdx;
let xSpeed;
let ySpeed;

const updateScoreTxt = () => {
    let prevScore = 0;

    return () => {
        if (prevScore !== currentIdx - 1) {
            scoreTxt.innerHTML = `Score: ${currentIdx - 1}`;
            prevScore = currentIdx - 1;
        }
    };
};

const updateScore = updateScoreTxt();

const addBox = (idx) => {
    boxes[idx] = {
        x: 0,
        y: (idx + 10) * boxHeight,
        width: boxes[idx - 1].width,
        color: `hsl(${211 + idx}, 71%, 8%)`
    };
};

const gameOver = () => {
    state = states.GAME_OVER;
    gameoverTxt.classList.remove("hide");
};

const drawBoxes = () => {
    for (let i = 0; i < boxes.length; i++) {
        const {
            x,
            y,
            width,
            color
        } = boxes[i];
        ctx.fillStyle = color;
        ctx.fillRect(x, 600 - y + cameraY, width, boxHeight);
    }

    ctx.fillStyle = "#a8c3c0";
    ctx.fillRect(debris.x, 600 - debris.y + cameraY, debris.width, boxHeight);
};

const animate = () => {
    if (state === states.GAME_OVER) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateScore();
    drawBoxes();

    const currentBox = boxes[currentIdx];
    const prevBox = boxes[currentIdx - 1];
    if (state === states.IDLE) {
        currentBox.x = currentBox.x + xSpeed;
        if (xSpeed > 0 && currentBox.x + currentBox.width > canvas.width) {
            xSpeed = -xSpeed;
        }

        if (xSpeed < 0 && currentBox.x < 0) {
            xSpeed = -xSpeed;
        }
    }

    if (state === states.FALL) {
        currentBox.y = currentBox.y - ySpeed;

        if (currentBox.y == prevBox.y + boxHeight) {
            state = states.IDLE;

            const difference = currentBox.x - prevBox.x;
            if (Math.abs(difference) >= currentBox.width) {
                gameOver();
            }

            debris.y = currentBox.y;
            debris.width = difference;

            if (currentBox.x > prevBox.x) {
                currentBox.width = currentBox.width - difference;
                debris.x = currentBox.x + currentBox.width;
            } else {
                debris.x = currentBox.x - difference;
                currentBox.width = currentBox.width + difference;
                currentBox.x = prevBox.x;
            }

            if (xSpeed > 0) {
                xSpeed++;
            } else {
                xSpeed--;
            }

            currentIdx++;
            scrollCounter = boxHeight;
            addBox(currentIdx);
        }
    }

    debris.y = debris.y - ySpeed;
    if (scrollCounter) {
        cameraY++;
        scrollCounter--;
    }

    window.requestAnimationFrame(animate);
};

const start = () => {
    gameoverTxt.classList.add("hide");
    boxes = [{
        x: 300,
        y: 300,
        width: 200,
        color: "hsl(211, 71%, 8%"
    }];
    state = states.IDLE;

    cameraY = 0;
    scrollCounter = 0;
    xSpeed = 2;
    ySpeed = 5;
    currentIdx = 1;

    addBox(currentIdx);
    debris.y = 0;

    animate();
};

const dropBox = () => {
    if (state === states.GAME_OVER) {
        start();
    } else {
        if (state === states.IDLE) state = states.FALL;
    }
};

canvas.addEventListener("click", () => dropBox());
window.addEventListener("keypress", (e) => {
    if (e.code === "Enter") {
        dropBox();
    }
});
window.addEventListener("load", () => start());