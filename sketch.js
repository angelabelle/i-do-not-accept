let video;
let poseNet;
let pose;
let skeleton;
let eyeR;
let eyeL;
let wristR;
let wristL;
let d;

let wArr;
let cArr;
let nArr;
var timer = 60000;

let wSoundPlayed = false;
let cSoundPlayed = false;
let nSoundPlayed = false;

var stringToDelete;
var detectCount = 0;

let noPose;

function preload() {
    soundFormats('mp3', 'ogg');
    wSound1 = loadSound('sound/watching1.mp3');
    wSound2 = loadSound('sound/watching2.mp3');
    wSound3 = loadSound('sound/watching3.mp3');
    wSound4 = loadSound('sound/watching4.mp3');
    wSound5 = loadSound('sound/watching5.mp3');

    cSound1 = loadSound('sound/close1.mp3');
    cSound2 = loadSound('sound/close2.mp3');
    cSound3 = loadSound('sound/close3.mp3');
    cSound4 = loadSound('sound/close4.mp3');
    cSound5 = loadSound('sound/close5.mp3');

    nSound1 = loadSound('sound/far1.mp3');
    nSound2 = loadSound('sound/far2.mp3');
    nSound3 = loadSound('sound/far3.mp3');
    nSound4 = loadSound('sound/far4.mp3');

    loadStrings('sketch.txt', changeToString);
}


function setup() {
    createCanvas(windowWidth, windowHeight);

    wArr = [wSound1, wSound2, wSound3, wSound5, wSound4];
    cArr = [cSound1, cSound3, cSound3, cSound4, cSound5];
    nArr = [nSound1, nSound3, nSound3, nSound4];
    //frameRate(60);
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    //creates an array of data with this function, and runs it through the
    //gotPoses function to store it
    poseNet.on('pose', gotPoses);


}

//"poses" is the new array
function gotPoses(poses) {
    //console.log(poses);
    if (poses.length > 0) {
        //stores the always refreshing pose to a variable
        pose = poses[0].pose;
        //skeleton = poses[0].skeleton;
        noPose = false;
    }
    else {
        noPose = true;
        console.log(noPose);
    }

}

function modelLoaded() {
    console.log('poseNet ready');
    select('#status').html(' ');
}

function draw() {
    if (pose) {
        eyeR = pose.rightEye;
        eyeL = pose.leftEye;
        wristR = pose.rightWrist;
        wristL = pose.leftWrist;
        d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
        select('#status').html(d);
    }
 detectCloseness();
stringDelete(stringToDelete);
}

// Uses variable d to detect wether you are close, far/undetectable, or at normal distance.
function detectCloseness() {
    var cSound = cArr[0];
    var wSound = wArr[0];
    var nSound = nArr[0];

    if (millis() > timer) {
        wArr[4].play();
        timer += 60000;
        detectCount += 5;
    }
    //console.log(d);
    if (d >= 150.00 && noPose == false) {
        //background(255, 0, 0);
        //select('#status').html('Super Close to screen');
            nSound.stop();
            wSound.stop();
        if (cSoundPlayed == false) {
            cSound = random(cArr);
            cSound.playMode('restart');
            cSound.play();
            cSoundPlayed = true;
            detectCount += 5;
        }
        wSoundPlayed = false;
        nSoundPlayed = false;

    } else if (d < 130.00 && d >= 50.00 && noPose == false) {

        //background(255, 255, 0);
        //select('#status').html('Normal Distance From Screen');
            cSound.stop();
            nSound.stop();
        if (wSoundPlayed == false) {

            wSound = random(wArr);
            wSound.playMode('restart');
            wSound.play();
            wSoundPlayed = true;
            detectCount += 5;
        }
        cSoundPlayed = false;
        nSoundPlayed = false;

    } else if (d < 20.00 || noPose == true) {
        //    background(0, 255, 0);
        //select('#status').html('Far or not in vision or hiding face');
        cSound.stop();
        wSound.stop();
        if (nSoundPlayed == false) {

            nSound = random(nArr);
            nSound.playMode('restart');
            nSound.play();
            nSoundPlayed = true;
            detectCount += 5;
        }
        cSoundPlayed = false;
        wSoundPlayed = false;
    }
}

//grabs the text file and prints it
function printString(string) {
    select('#deleteSome').html(string);
}

//deletes part of the string to make a statement about how some of us have to slowly to adjust themselves because of the feeling of discomfort, and new awareness.
function stringDelete(string) {
    if (string.length <= 1) {
        string = " ";
    } else {
        string = string.substring(0, string.length - detectCount);
    }
    printString(string);
}
//grabs the array of strings and turns it into a regular string
function changeToString(stringArray) {
    let separator = ' ';
    stringToDelete = join(stringArray, separator);
}
