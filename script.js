let Baggrund;

let spawnCooldown = 4.0;
let despawnTime = 20.0;

let targetSize = 50;
let targets = [];

let score = 0;
let state = "start";

let difficiulty = "Mellem";

function setup() {
    createCanvas(windowWidth, windowHeight);
    Baggrund = loadImage('Assets/background.jpg');
}

function draw() {
    background(Baggrund)
    if (state === "playing") {
        tegnData();

        for (let i = 0; i < targets.length; i++) {
            targets[i].checkDespawn();
            targets[i].tegn();
        }
    } else if (state === "gameover") {
        noStroke();
        fill(255);
        rect(windowWidth / 2 - 100, windowHeight / 2 - 50, 200, 60, 20);
        let rx = windowWidth / 2 - 100;
        let ry = windowHeight / 2 - 50;
        textSize(24);
        fill(0);
        textAlign(CENTER, CENTER);
        text("Klik for at prøv igen", rx + 100, ry + 30);
        text("Du fejlede en opgave!", windowWidth / 2, windowHeight / 2 - 100);
    } else if (state === "start") {
        noStroke();
        fill(255);
        rect(windowWidth / 2 - 100, windowHeight / 2 - 50, 200, 60, 20);
        let rx = windowWidth / 2 - 100;
        let ry = windowHeight / 2 - 50;
        textSize(24);
        fill(0);
        textAlign(CENTER, CENTER);
        text("Klik for at starte!", rx + 100, ry + 30);
        text("Klik på de rigtige brøkopgaver!", windowWidth / 2, windowHeight / 2 - 100);
    }
}

function mousePressed() {
    if (state === "playing") {
        for (let i = 0; i < targets.length; i++) {
            targets[i].checkClick();
        }
    } else if (state === "start") {
        let rx = windowWidth / 2 - 100;
        let ry = windowHeight / 2 - 50;
        let rw = 200;
        let rh = 60;
        if (mouseX >= rx && mouseX <= rx + rw && mouseY >= ry && mouseY <= ry + rh) {
            spawnTarget();
            state = "playing";
        }
    } else if (state === "gameover") {
        let rx = windowWidth / 2 - 100;
        let ry = windowHeight / 2 - 50;
        let rw = 200;
        let rh = 60;
        if (mouseX >= rx && mouseX <= rx + rw && mouseY >= ry && mouseY <= ry + rh) {
            targets = [];
            score = 0;
            spawnTarget();
            state = "playing";
        }
    }
}  

function tegnData() {
    textAlign(LEFT, TOP);
    textSize(16);
    fill(255)
    text(`Score: ${score}`, 200, 220);
}

function spawnTarget() {
    let correct = false;
    if (Math.random() < 0.5) {
        correct = true;
    }
    if (state == "playing") {
        new opgave(
            random(windowWidth * 0.1, windowWidth * 0.9),
            random(windowHeight * 0.1, windowHeight * 0.9),
            targetSize,
            correct
        );
    }
}   

function Denominator(x, x2) { 
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    return (x / gcd(x, x2)) * x2;
}

function generateQuestion(correct) {
    if (difficiulty === "Nem") {
        x = Math.floor(Math.random() * 8) + 1;
        y = Math.floor(Math.random() * 8) + 1;

        if (correct) {
            return `${x}/${y} = ${(x / y).toFixed(2)}`;
        } else {
            let wrongAnswer;
            if (Math.random() < 0.5) {
                wrongAnswer = (x / y) + (Math.random() / 2 + 0.1);
            } else {
                wrongAnswer = (x / y) - (Math.random() / 2 + 0.1);
            }
            return `${x}/${y} = ${wrongAnswer.toFixed(2)}`;
        }
    } else if (difficiulty === "Mellem") {
        x = Math.floor(Math.random() * 8) + 1;
        y = Math.floor(Math.random() * 8) + 1;
    
        x2 = Math.floor(Math.random() * 8) + 1;
        y2 = Math.floor(Math.random() * 8) + 1;
    
        let denom = Denominator(y, y2);

        let xAdd = denom / y;
        let x2Add = denom / y2;

        if (correct) {
            return `${x}/${y} + ${x2}/${y2} = ${(x * xAdd + x2 * x2Add)}/${denom}`;
        } else {
            let wrongAnswer;
            if (Math.random() < 0.5) {
                wrongAnswer = `${x}/${y} + ${x2+Math.ceil(Math.random() * 3)}/${y2} = ${(x * xAdd + x2 * x2Add)}/${denom}`;
            } else {
                wrongAnswer = `${x+Math.ceil(Math.random() * 3)}/${y} + ${x2}/${y2} = ${(x * xAdd + x2 * x2Add)}/${denom}`;
            }
            return wrongAnswer;
        }
    }
}

class opgave {
    constructor(x, y, size, correct) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.question = generateQuestion(correct);
        this.correct = correct;
        this.created = millis();

        targets.push(this);
    }

    tegn() {
        fill('#36B2D1')
        ellipse(this.x, this.y, this.size * 2, this.size * 2);
        fill(255);
        textAlign(CENTER, CENTER);
        text(this.question, this.x, this.y);
    }

    checkDespawn() {
        if (this.created + despawnTime * 1000 <= millis()) {
            if (this.correct) {
                state = "gameover";
            }
            targets.splice(targets.indexOf(this), 1);
        }
    }

    checkClick() {
        let d = dist(mouseX, mouseY, this.x, this.y);
        if (d <= this.size) {
            if (this.correct) {
                score++;
                targets.splice(targets.indexOf(this), 1);
            } else {
                state = "gameover";
            }
        }
    }   
}

setInterval(spawnTarget, spawnCooldown * 1000);