var canvas = document.getElementById("canvas");
var page = document.getElementsByTagName("body")[0];
var snake; //Snake array
var speed = 70;//interval in milliseconds
var difficulty = 1;
var count;//count up to new unattached block
var addToSnake = 0;//buffer of blocks to be added to snake
var keynum = 0;//eventlistener keynum
var mainLoop;
var score;//game score
var scoreCard = document.getElementById("scorecard");
var scoreValue = document.getElementById("score");
var highScore;
var clickFX = new Audio("click.wav");
var music = [new Audio("ice.mp3"), new Audio("bitbop.mp3"), new Audio("big-bang.mp3")];//possible music
var currentMusicIndex;//the index of the current music the the music array
var deathAudio = new Audio("endNoise.wav");
var whoosh = new Audio("whoosh.wav");
var gameOverMenuLinks = document.getElementById("scorecard").getElementsByTagName("div");
var mainMenuLinks = document.getElementById("mainmenu").getElementsByTagName("div");
var newBodySound = new Audio("newBody.wav");
var addBodySound = new Audio("addBody.wav");
var otherWhoosh = new Audio("otherWhoosh.wav");
var powerUpSound = new Audio("powerup.wav");
var powerUpCount = 0;
var powerUp = 0;
var menuMusic = new Audio("menumusic.wav");
var powerDownSound = new Audio("powerdown.wav");
var reverseSound = new Audio("reversesound.wav");
var pause = document.getElementById("pause");
var options = document.getElementById("options");
var optionsLink = document.getElementById("optionsLink");
var optionsBack = document.getElementById("optionsBack");
var playMusic = true;
var playSFX = true;
var usePickups = true;

// //gets high score from storage
// chrome.storage.sync.get({"highscore":0},function(highscoreStored){
// 	highScore = highscoreStored.highscore;
// });

playAudio(otherWhoosh);
//playAudio(menuMusic);

function gameFunc(){
	setup();
	startLoop();
}

//main game loop: updates, draws, and checks for collisions
function startLoop(){
	mainLoop = setInterval(function(){
		update();
		draw();
	}, speed);
}

function setup(){
	menuMusic.pause();
	page.className = "";
	addToSnake = 0;
	count = 0;
	score = 0;
	powerUp = 0;
	powerUpCount = 0;
	keynum = 0;

	setSpeed();
	snake = [{element:document.getElementById("head"), direction: 3, top:305, left:430}];
	currentMusicIndex = parseInt(Math.random()*music.length);
	music[currentMusicIndex].playbackRate = 1;

	playAudio(music[currentMusicIndex]);

	while(document.getElementsByClassName("body").length > 0){
		canvas.removeChild(document.getElementsByClassName("body")[0]);
	}
}

function setSpeed(){
	switch(difficulty){
		case 0:
			speed = 90;
			break;
		case 1:
			speed = 70;
			break;
		case 2:
			speed = 50;
			break;
		case 3:
			speed = 20;
			break;
	}

}
//event listeners for menu clicks
document.getElementById("restartCard").onclick = restart;
document.getElementById("startGame").onclick = gameFunc;
document.getElementById("mainmenulink").onclick = enterMainMenu;
document.getElementById("website").onclick = function(){
	window.open("http://eleventhour.xyz");
}
document.getElementById("difficulty").onclick = function(){
	var difficultySelector = document.getElementById("difficulty");
	switch(difficulty){
		case 0:
			difficultySelector.innerHTML = "Tricky";
			difficulty++;
			break;
		case 1:
			difficultySelector.innerHTML = "Uber-tricky";
			difficulty++;
			break;
		case 2:
			difficultySelector.innerHTML = "Insta-death";
			difficulty++;
			break;
		case 3:
			difficultySelector.innerHTML = "Pathetic";
			difficulty = 0;
			break;
	}
}
document.getElementById("controlsLink").onclick = function(){
	for(var i = 0; i < mainMenuLinks.length; i++){
		if(mainMenuLinks[i].className == "open")
			mainMenuLinks[i].className = "closed";
	}
	if(controls.className != "open"){
		controls.className = "open";
	}
}
optionsLink.onclick = function(){
	for(var i = 0; i < mainMenuLinks.length; i++){
		if(mainMenuLinks[i].className == "open")
			mainMenuLinks[i].className = "closed";
	}
	if(options.className != "open"){
		options.className = "open";
	}
}
optionsBack.onclick = function(){
	options.className = "closed";
}
document.getElementById("controlsBack").onclick = function(){
	controls.className = "closed";
}
document.getElementById("musicToggle").onclick = function(){
	if(playMusic){
		playMusic = false;
		this.innerHTML = "Music: Off";
	} else {
		playMusic = true;
		this.innerHTML = "Music: On";
	}
}
document.getElementById("soundToggle").onclick = function(){
	if(playSFX){
		playSFX = false;
		this.innerHTML = "SFX: Off";
	} else {
		playSFX = true;
		this.innerHTML = "SFX: On";
	}
}
document.getElementById("pickupsToggle").onclick = function(){
	if(usePickups){
		usePickups = false;
		this.innerHTML = "Pickups: Off";
	} else {
		usePickups = true;
		this.innerHTML = "Pickups: On";
	}
}
pause.onclick = function(){
	if(pause.className == "paused"){
		pause.className = "unpaused";
		music[currentMusicIndex].play();
		startLoop();
	}
}

//event listener for menu hover
for(var i = 0; i < gameOverMenuLinks.length; i++){
	gameOverMenuLinks[i].addEventListener("mouseover", function(){
		clickFX.play();
	});
}
for(var i = 0; i < mainMenuLinks.length; i++){
	mainMenuLinks[i].addEventListener("mouseover", function(){
		clickFX.play();
	});
}
//keypress event listener to change direction of snake head and restart/pause game
document.addEventListener("keypress",function(event){

	if(event.which && keynum == 0){
		keynum = event.which;
	}

	switch(keynum){
		case 119:
			if(snake[0].direction != 2)
			snake[0].direction = 1;
			break;
		case 115:
			if(snake[0].direction != 1)
			snake[0].direction = 2;
			break;
		case 100:
			if(snake[0].direction != 4)
			snake[0].direction = 3;
			break;
		case 97:
			if(snake[0].direction != 3)
			snake[0].direction = 4;
			break;
		case 32:
			if(page.className == "dead"){
				restart();
			} else {
				if(page.className == ""){
					if(pause.className == "paused"){
						startLoop();
						music[currentMusicIndex].play();
						pause.className = "unpaused";
					} else {
						clearInterval(mainLoop);
						playAudio(whoosh);
						pause.className = "paused";
						music[currentMusicIndex].pause();
					}
				}
			}
	}

	if(page.className == "dead")
				keynum = 0;
});


//main update function
function update(){
	if(powerUp != 0 && powerUpCount > 50){
		switch(powerUp){
			case 2:
				if(powerUpCount < 150)
				break;
			case 1:
				setSpeed();
				clearInterval(mainLoop);
				startLoop();
				powerUp = 0;
				music[currentMusicIndex].playbackRate = 1;
				playAudio(powerDownSound);
		}
	}
	score += ((snake.length / (speed / 5)) * 10) * speed / 5;
	count++;
	powerUpCount++;

	//checks if snake head is over unattached block
	var unattached = document.getElementById("unattached");
	if(unattached != null && snake[0].top == parseInt(unattached.style.top) && snake[0].left == parseInt(unattached.style.left)){
		addToSnake += 7;
		if(unattached.className != " body"){
			switch(unattached.className){
				case "slowdown body":
					powerUp = 1;
					powerUpCount = 0;
					speed *= 2;
					clearInterval(mainLoop);
					startLoop();
					music[currentMusicIndex].playbackRate = .5;
					playAudio(powerUpSound);
					break;
				case "speedup body":
					powerUp = 2;
					powerUpCount = 0;
					speed -= .5 * speed;
					clearInterval(mainLoop);
					startLoop();
					music[currentMusicIndex].playbackRate = 1.5;
					playAudio(powerUpSound);
					break;
				case "shorten body":
					powerUp = 0;
					poweUpCount = 0;
					addToSnake = parseInt(-(snake.length / 3));
					document.getElementById("unattached").remove();
					playAudio(powerUpSound);
					break;
				case "lengthen body":
					powerUp = 0;
					powerUpCount = 0;
					addToSnake += 20;
					playAudio(powerDownSound);
					break;
			}
		} else {
			playAudio(addBodySound);
		}
	}

	//add blocks to snake if there are any in buffer
	if(addToSnake > 0){
		addToSnake--;
		score += 1000;
		if(document.getElementById("unattached")== null){
			var newBody = document.createElement("div");
			newBody.id = "unattached";
			canvas.appendChild(newBody);
		}
		document.getElementById("unattached").className = "body";
		snake.push({element:document.getElementById("unattached"), top:0, left:0});
		document.getElementById("unattached").removeAttribute("id");
	} else {
		while(addToSnake < 0){
			addToSnake++;
			snake[snake.length-1].element.remove();
			snake.pop();
		}
	}
	//gives each block of snake the position of the previous block
	for(var i = snake.length-1; i > 0; i--){
		snake[i].top = snake[i-1].top;
		snake[i].left = snake[i-1].left;
	}

	//updates head position based on head direction if it does not collide with border
	switch(snake[0].direction){
		case 1:
			snake[0].top -= 25;
			break;
		case 2:
			snake[0].top += 25;
			break;
		case 3:
			snake[0].left += 25;
			break;
		case 4:
			snake[0].left -= 25;
			break;
	};

	keynum = 0;

	checkForDeath();

	//update score card
	var scoreString = "";
	score = parseInt(score);
	for(var i = 0; i < 7 - score.toString().length; i++){
		scoreString += "0";
	}
	scoreValue.innerHTML = scoreString + score;
}

//main drawing function
function draw(){

	//updates css values with object values for snake blocks
	for(var i = 0; i < snake.length; i++){

		snake[i].element.style.top = snake[i].top+"px";
		snake[i].element.style.left = snake[i].left+"px";

	};

	//draws an unattached block if none are present
	if(count >= 50 && document.getElementById("unattached") == null && addToSnake == 0){
			count=0;

			playAudio(newBodySound);

			var horizontal = Math.round(Math.random()*24);
			horizontal = ((horizontal * 50)+5)+"px";

			var vertical = Math.round(Math.random()*24);
			vertical = ((vertical * 25)+5)+"px";

			var newBody = document.createElement("div");
			if(powerUp == 0){
				switch(Math.round(Math.random()*8)){
					case 1:
						newBody.className = "slowdown";
						break;
					case 2:
						newBody.className = "speedup";
						break;
					case 3:
						newBody.className = "shorten";
						break;
					case 4:
						newBody.className = "lengthen";
						break;
				}
			}
			newBody.className += " body";
			newBody.id = "unattached";
			canvas.appendChild(newBody);

			document.getElementById("unattached").style.left = horizontal;
			document.getElementById("unattached").style.top = vertical;

	};
};

//checks for head collisions with other parts of snake
function checkForDeath(){

	if(snake[0].top<0|| snake[0].left<0)
		gameOver();

	if(snake[0].left >= 1230)
			gameOver();

	if(snake[0].top >= 630)
		gameOver();

	for(var j = 1; j < snake.length; j++)
		if(snake[0].top == snake[j].top && snake[0].left == snake[j].left)
			gameOver();
}

//enters game over menu after death
function gameOver(){
	music[currentMusicIndex].pause();

	playAudio(deathAudio);
	clearInterval(mainLoop);
	keynum = 0;

	page.className = "dead";

	//checks and saves high score
	score = parseInt(score);
	if(score > highScore){
		document.getElementById("highscore").innerHTML = "New high score!"
		highScore = score;
		chrome.storage.sync.set({"highscore":highScore});
	} else {
		document.getElementById("highscore").innerHTML = highScore;
	}

}

function restart(){

	if(page.className == "restart"){
		return;
	}

	playAudio(whoosh);

	page.className += " restart";

	setTimeout(function(){
		gameFunc();
	},250);
};
function startMusic(sound){
	if(playMusic){
		sound.currentTime = 0;
		sound.play();
	}
}
function playAudio(sound){
	if(playSFX){
		sound.currentTime = 0;
		sound.play();
	}
}
function enterMainMenu(){
	playAudio(otherWhoosh);
	page.className = "mainmenu";
	playAudio(menuMusic);
	for(var i = 0; i < mainMenuLinks.length; i++){
		mainMenuLinks[i].className = "";
	}
}
