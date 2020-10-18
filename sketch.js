// Emotion library added
// AV library added
// Family words added 
let bugs = []; //array of Jitter objects
let myRec = new p5.SpeechRec(); // new P5.SpeechRec object
let myVoice = new p5.Speech(); // new P5.Speech object
myRec.continuous = true; // do continuous recognition
myRec.interimResults = false; // allow partial recognition (faster, less accurate)
let wordArray = [];
let words;
let wh = 24; //idk what this variable is? 
var afinnE; // emotion
var afinnAV; //action verbs
var afinnFN; //family nouns
let x;
let y;
let xspeed = 8;
let yspeed = 8;
let r = 35;
let c = ["green", "red", "yellow"];

var checkG = false;
function preload() {
  afinnE = loadJSON('emotion.json');
  afinnAV = loadJSON('actionverb.json');
  afinnFN = loadJSON('family.json');
}

function setup() {
  // graphics stuff:
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  // instructions:
  textSize(16);
  textAlign(CENTER);
  textFont('Gill Sans');
  text("Hey there!", width / 2, height / 2);
  myRec.onResult = showResult;
  myRec.start();
}

function draw() {
  background(255);
  for (let i = 0; i < bugs.length; i++) {
    if (i > 0) {
      stroke(c[i%c.length]);
      strokeWeight(1);
      line(bugs[i - 1].x, bugs[i - 1].y + bugs[i - 1].n, bugs[i].x, bugs[i].y + bugs[i].n);
      noStroke();
    }
    bugs[i].move();
    bugs[i].display();
    bugs[i].hover();
    bugs[i].grow();
  }
}

//text string result 
function showResult() {
  if (myRec.resultValue === true) {
    var words = myRec.resultString.split(' ');
    var score;
    var scoredwords = [];
    totalEScore = 0;
    totalAVScore = 0;
    totalFNScore = 0;
    for (var word of words) {
      var lowerWord = word.toLowerCase();
      //detecting emotional words
      if (afinnE.hasOwnProperty(lowerWord)) {
        score = afinnE[lowerWord];
        console.log(lowerWord, score);
        totalEScore += Number(score);
        checkG = true;
        scoredwords.push(lowerWord + ': ' + score + ' ');
      }
      //detecting action verbs
      if (afinnAV.hasOwnProperty(lowerWord)) {
        score = afinnAV[lowerWord];
        console.log(lowerWord, score);
        totalAVScore += Number(score);
        scoredwords.push(lowerWord + ': ' + score + ' ');
      }
      //detecting family nouns
      if (afinnFN.hasOwnProperty(lowerWord)) {
        score = afinnFN[lowerWord];
        console.log(lowerWord, score);
        totalFNScore += Number(score);
        scoredwords.push(lowerWord + ': ' + score + ' ');
      }
    }
    print(words);

    wordArray.push(myRec.resultString);
    bugs.push(new Jitter(myRec.resultString, totalEScore, totalAVScore, totalFNScore, bugs.length));
    console.log(myRec.resultString);
  }
}
//Jitter class - for emotions 
class Jitter {
  constructor(t, totalEScore, totalAVScore, totalFNScore, id) {
    this.id = id;
    this.x = random(width);
    this.y = random(height);
    this.txt = t;
    this.diameter = this.txt.length * 8;
    this.ishover = false;
    this.speed = 1;
    this.count = 0;
    this.nf = 0;
    this.n = 0;
    this.colors = ["red", "yellow", "green"];
    this.colorred = color(200, 10, 10);
    this.colorgreen = color(10, 200, 10);
    this.colorblue = color(10, 10, 200);
    this.influencecolor = color(150, 150, 150);
    this.stopGrow = false;
    this.isGradient = false;
    if (checkG == true){
        this.isGradient = true;
    }
    this.emotionarray = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4];
    this.totalAVScore = totalAVScore;
    this.totalEScore = totalEScore;
    this.totalFNScore = totalFNScore;
    this.centerColor = 0;
    this.outerColor = 0;
  }
  move() {
    if (this.totalAVScore == 1) {
      this.nf = this.nf + 0.03;
      this.n = noise(this.nf) * 50 - 25;
    }
    if (this.totalAVScore == 5) {
      this.x += xspeed;
      this.y += yspeed;
      if (this.x > windowWidth - r || this.x < r) {
        xspeed = -xspeed;
      }
      if (this.y > windowHeight - r || this.y < r) {
        yspeed = -yspeed;
      }
    }
  }


  grow() {
    if (this.totalFNScore == 6) {
      if (this.stopGrow == false) {
        this.diameter += 1;
      }
      if (this.diameter == this.txt.length * 10) {
        this.stopGrow = true;
      }
    }
  }
  display() {
    if(this.isGradient == false){
      checkG = false;
      for(var t = 0; t < this.colors.length; t++) {
          fill(this.colors[this.id%this.colors.length]);
          ellipse(this.x, this.y + this.n, this.diameter - t, this.diameter - t);
        }
     }

    if(this.isGradient == true){
      for (var i = 0; i <= this.diameter; i++ ) { //i is size of circle
        if (this.totalEScore >= 3) {
          this.centerColor = color(200, 100, 20);
          this.outerColor = color(20, 10, 200);
        }
        if (this.totalEScore < 3) {
          this.centerColor = color(10, 40, 140);
          this.outerColor = color(140, 60, 10);
        }
        var gradientColor = map(i, 0, this.diameter, 0, 1);
        let finalColor = lerpColor(this.outerColor, this.centerColor, gradientColor);
        fill(finalColor);
        ellipse(this.x, this.y + this.n, this.diameter - i, this.diameter - i);
      }
    }
         
    noStroke();
    fill(0);
    text(this.txt, this.x, this.y + this.n + 5);
  }
  hover() {
    if (this.x - this.diameter <= mouseX && this.x + this.diameter >= mouseX && this.y - this.diameter <= mouseY && this.y + this.diameter >= mouseY && this.ishover == false && mouseIsPressed) {
      console.log(this.txt + " is selected!");
      this.ishover = true;
      this.count = frameCount;
    }
    if (this.count < frameCount - 100 && this.ishover == true) {
      this.ishover = false;
    }
  }
}