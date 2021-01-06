var database;
//This stores the page state so it can be easily changed
var page;
//This stores the dimensions of sprites relative to the screen size
var spriteWidth, spriteHeight;
//These are required to login or sign up
var signUpChoiceSprite, signUpChoiceImage, loginChoiceImage, loginChoiceSprite, signUpBox, signUpButton, loginBox, loginButton, passwordBox;
//These store user details
var userAuth, userName, userPassword, userKey, userRepeat;
//These store the sprites and their images
var logoSprite, logoImage;
var gratitudeSprite, gratitudeImage;
var meditationSprite, meditationImage;
var startSprite, startImage, resetSprite, resetImage;
var backSprite, backImage;
//This is for the menu
var quote;
//These are used in meditation
var startTime, currentTime, minutesElapsed, timeLimit;
var meditationSound, meditationScore, percentComplete;
//These are used in gratitude journaling
var gratitudeInput, gratitudeDay, gratitudeMonth, gratitudeInputBox, gratitudeInputButton;
var gratitudeDayObject, gratitudeMonthObject, gratitudeInputObject;

function preload() {
  //Loading audio-visual assets
  signUpChoiceImage = loadImage('assets/signUpImage.png');
  loginChoiceImage = loadImage('assets/loginImage.png');
  logoImage = loadImage('assets/logoImage.png');
  gratitudeImage = loadImage('assets/gratitudeImage.png');
  meditationImage = loadImage('assets/meditationImage.png');
  backImage = loadImage('assets/backImage.png');
  startImage = loadImage('assets/startImage.png');
  resetImage = loadImage('assets/resetImage.png');
  meditationSound = loadSound('assets/meditationSound.mp3');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();

  textAlign(CENTER);
  textSize(21);
  angleMode(DEGREES);
  //This is the first page, where you pick to sign up or login
  page = "open";
  //This is used to size the sprites relative to the screen (for best experience use a 1920x1080 window or close)
  //The ratios are intended for a 16:9 or 9:16 screen
  if (windowWidth < 500 || windowHeight < 1600) {
    if (windowWidth > windowHeight) {
      if (windowWidth < 500) {
        spriteWidth = windowWidth * (0.2);
        spriteHeight = spriteWidth * (9 / 16);
      } else if (windowHeight < 1600) {
        spriteHeight = windowHeight * (0.2);
        spriteWidth = spriteHeight * (16 / 9);
      }
    } else {
      if (windowWidth < 500) {
        spriteWidth = windowWidth * (16 / 45);
        spriteHeight = spriteWidth * (9 / 16);
      } else if (windowHeight < 1600) {
        spriteHeight = windowHeight * (9 / 80);
        spriteWidth = spriteHeight * (16 / 9);
      }
    }
  } else {
    //These are the default sizes of the sprites;
    spriteWidth = 384;
    spriteHeight = 216;
  }

  logoSprite = createSprite(windowWidth / 2, windowHeight / 8, spriteWidth, spriteHeight);
  logoImage.resize(logoSprite.width, logoSprite.height)
  logoSprite.addImage(logoImage);
  logoSprite.visible = false;

  gratitudeSprite = createSprite(windowWidth / 2, windowHeight / 8 * 3, spriteWidth, spriteHeight);
  gratitudeImage.resize(gratitudeSprite.width, gratitudeSprite.height)
  gratitudeSprite.addImage(gratitudeImage);
  gratitudeSprite.visible = false;

  meditationSprite = createSprite(windowWidth / 2, windowHeight / 8 * 5, spriteWidth, spriteHeight);
  meditationImage.resize(meditationSprite.width, meditationSprite.height)
  meditationSprite.addImage(meditationImage);
  meditationSprite.visible = false;

  backSprite = createSprite(windowWidth / 2, windowHeight / 8 * 7, spriteWidth, spriteHeight);
  backImage.resize(backSprite.width, backSprite.height)
  backSprite.addImage(backImage);
  backSprite.visible = false;

  startSprite = createSprite(windowWidth / 2, windowHeight / 8 * 3, spriteWidth, spriteHeight);
  startImage.resize(startSprite.width, startSprite.height)
  startSprite.addImage(startImage);
  startSprite.visible = false;

  //This stores the dimension of a square sprite, as the others are rectangular
  var squareSpriteSide;
  if (spriteWidth > spriteHeight) {
    squareSpriteSide = spriteHeight;
  } else {
    squareSpriteSide = spriteWidth;
  }

  resetSprite = createSprite(windowWidth / 2, windowHeight / 6 * 1, squareSpriteSide, squareSpriteSide);
  resetImage.resize(resetSprite.width, resetSprite.height)
  resetSprite.addImage(resetImage);
  resetSprite.visible = false;

  loginChoiceSprite = createSprite(windowWidth / 2, windowHeight / 10 * 3, spriteWidth, spriteHeight);
  loginChoiceImage.resize(loginChoiceSprite.width, loginChoiceSprite.height)
  loginChoiceSprite.addImage(loginChoiceImage);

  signUpChoiceSprite = createSprite(windowWidth / 2, windowHeight / 10 * 7, spriteWidth, spriteHeight);
  signUpChoiceImage.resize(signUpChoiceSprite.width, signUpChoiceSprite.height)
  signUpChoiceSprite.addImage(signUpChoiceImage);

  gratitudeInput = [];
  gratitudeDay = [];
  gratitudeMonth = [];

  //This checks during Sign Up whether the username is unique
  userRepeat = [];
}

function draw() {
  background(rgb(247, 233, 227));

  if (page === "login") {
    push();
    fill(rgb(14, 49, 80));
    text("Enter your Login Details!", windowWidth / 2, windowHeight / 6 * 2);
    pop();

    loginButton.mousePressed(() => {

      //the username is not case sensitive
      initialName = loginBox.value();
      userName = initialName.toLowerCase();
      userPassword = passwordBox.value();

      var ref = database.ref('accounts');
      ref.once('value', gotLoginData);

      function gotLoginData(data) {

        var info = data.val();
        var keys = Object.keys(info);

        //This cycles through the array of all the keys
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var name = info[k].Name;
          var password = info[k].Password;

          //This is authorization to confirm that password and username are correct
          if (userName === name) {
            if (userPassword === password) {
              userAuth = true;
              //This stores the key that the user's data is stored under in the database
              userKey = keys[i];

              loginBox.remove();
              loginButton.remove();
              passwordBox.remove();

              page = "menu";
              quote = randomQuote();
            }
          } else {
            userAuth = false;
          }
        }
      }
    });

    if (userAuth === false) {
      fill(rgb(14, 49, 80));
      text("Incorrect Name or Password, please retry", windowWidth / 2, windowHeight / 7 * 6);
    }
  }

  if (page === "signUp") {
    push();
    fill(rgb(14, 49, 80));
    text("Enter a Username and Password!", windowWidth / 2, windowHeight / 6 * 2);
    pop();

    var ref = database.ref('accounts');
    signUpButton.mousePressed(() => {
      initialName = signUpBox.value();
      userName = initialName.toLowerCase();
      userPassword = passwordBox.value();

      ref.once('value', gotSignUpData);

      function gotSignUpData(data) {
        var info = data.val();
        var keys = Object.keys(info);

        userRepeat = [];

        //This cycles through the array of all the keys
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var name = info[k].Name;


          if (userName != name) {
            userRepeat.push(true);
          } else {
            userRepeat.push(false);
          }
        }

        for (i = 0; i < userRepeat.length; i++) {
          if (userRepeat[i] === false) {
            userRepeat = [];
            userRepeat.push(false);
          }
        }

        //This creates the initial part of all the nodes in the database
        if (userRepeat[0] === true) {
          var data = {
            Name: userName,
            Password: userPassword,
            MeditationScore: 0,
            gratitude: {
              GratitudeDay: {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0
              },
              GratitudeInput: {
                0: "",
                1: "",
                2: "",
                3: "",
                4: ""
              },
              GratitudeMonth: {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0
              }
            }
          }

          ref.push(data);
          ref.once('value', getInfo);
        }


        function getInfo(data) {
          var info = data.val();
          var keys = Object.keys(info);
          for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var name = info[k].Name;
            var password = info[k].Password;

            if (userName === name) {
              if (userPassword === password) {
                //This stores the key that the user's data is stored under in the database
                userKey = keys[i];

                signUpBox.remove();
                signUpButton.remove();
                passwordBox.remove();

                page = "menu";
                quote = randomQuote();
              }
            }
          }

        }
      }
    });

    if (userRepeat[0] === false) {
      fill(rgb(14, 49, 80));
      text("That username is already chosen", windowWidth / 2, windowHeight / 7 * 6);
    }
  }

  if (page === "menu") {
    logoSprite.visible = true;
    gratitudeSprite.visible = true;
    meditationSprite.visible = true;

    backSprite.visible = false;
    resetSprite.visible = false;
    startSprite.visible = false;

    //This turns off the meditation background sound if we enter the menu
    if (meditationSound.isPlaying()) {
      meditationSound.stop();
    }

    push();
    fill(rgb(14, 49, 80))
    text(quote, windowWidth / 2, windowHeight / 7 * 6);
    pop();
  }

  if (page === "gratitude") {
    logoSprite.visible = false;
    gratitudeSprite.visible = false;
    meditationSprite.visible = false;

    backSprite.visible = true;

    //These specifically refer to each node under gratitude in the database
    var referenceDay = "accounts/" + userKey + "/gratitude/GratitudeDay";
    var referenceInput = "accounts/" + userKey + "/gratitude/GratitudeInput";
    var referenceMonth = "accounts/" + userKey + "/gratitude/GratitudeMonth";

    var refDay = database.ref(referenceDay);
    var refInput = database.ref(referenceInput);
    var refMonth = database.ref(referenceMonth);

    refDay.on('value', gratitudeDayData);
    refInput.on('value', gratitudeInputData);
    refMonth.on('value', gratitudeMonthData);

    //These arrays store the five most recent entries, along with their time of entry

    function gratitudeDayData(data) {
      gratitudeDay = [];
      gratitudeDayObject = data.val();
      for (i = 0; i < 5; i++) {
        gratitudeDay.push(gratitudeDayObject[i]);
      }
    }

    function gratitudeInputData(data) {
      gratitudeInput = [];
      gratitudeInputObject = data.val();
      for (i = 0; i < 5; i++) {
        gratitudeInput.push(gratitudeInputObject[i]);
      }
    }

    function gratitudeMonthData(data) {
      gratitudeMonth = [];
      gratitudeMonthObject = data.val();
      for (i = 0; i < 5; i++) {
        gratitudeMonth.push(gratitudeMonthObject[i])
      }
    }

    //This updates the entered info to the database
    gratitudeInputButton.mousePressed(() => {
      gratitudeInput.push(gratitudeInputBox.value());
      var currentDay = day();
      gratitudeDay.push(currentDay);
      var currentMonth = month();
      gratitudeMonth.push(currentMonth);

      if (gratitudeInput.length > 5) {
        gratitudeInput.shift();
      }
      if (gratitudeMonth.length > 5) {
        gratitudeMonth.shift();
      }
      if (gratitudeDay.length > 5) {
        gratitudeDay.shift();
      }

      if (gratitudeInput[0] != undefined) {
        refDay.update({
          0: gratitudeDay[0],
          1: gratitudeDay[1],
          2: gratitudeDay[2],
          3: gratitudeDay[3],
          4: gratitudeDay[4]
        });
        refInput.update({
          0: gratitudeInput[0],
          1: gratitudeInput[1],
          2: gratitudeInput[2],
          3: gratitudeInput[3],
          4: gratitudeInput[4]
        });
        refMonth.update({
          0: gratitudeMonth[0],
          1: gratitudeMonth[1],
          2: gratitudeMonth[2],
          3: gratitudeMonth[3],
          4: gratitudeMonth[4]
        });
      }
    });


    //To display the five most recent entries along with their date and time
    if (gratitudeInput.length > 0) {
      for (var i = 0; i < gratitudeInput.length && i < 5; i++) {
        push();
        fill(rgb(14, 49, 80));
        textAlign(CENTER, TOP);
        text("Summary of last " + gratitudeInput.length + " day(s): ", windowWidth / 2, windowHeight / 20);
        text("On " + gratitudeDay[i] + "/" + gratitudeMonth[i] + " you were grateful for: " + gratitudeInput[i], windowWidth / 2, windowHeight / 20 * (i + 2));
        pop();
      }
    }
  }

  if (page === "meditation") {
    var reference = "accounts/" + userKey;
    var ref = database.ref(reference);

    ref.once('value', getData);

    //The meditation score is a metric of how much you have meditated, designed to motivate you to meditate more
    function getData(data) {
      meditationScore = data.val().MeditationScore;
    }

    backSprite.visible = true;
    logoSprite.visible = false;
    gratitudeSprite.visible = false;
    meditationSprite.visible = false;

    if (meditationScore >= 0) {
      fill(rgb(14, 49, 80));
      text("Your Score so far is: " + meditationScore, windowWidth / 2, windowHeight / 5 * 3);
      text("Meditate more to increase your score!", windowWidth / 2, windowHeight / 10 * 7);
    }
  }

  if (page === "meditation/start") {
    //The current time is compared to the start time to find out how much time has elapsed
    currentTime = millis();

    secondsElapsed = floor((currentTime - startTime) / 1000);
    minutesElapsed = floor((currentTime - startTime) / 60000);


    //This sets the seconds to 0 after a minute completes
    if (secondsElapsed >= 60) {
      secondsElapsed = secondsElapsed - minutesElapsed * 60;
    }

    if (secondsElapsed + minutesElapsed * 60 > timeLimit) {
      minutesElapsed = floor(timeLimit / 60);
      secondsElapsed = timeLimit % 60;
    }

    //This is used to check when the meditation is over
    percentComplete = ((minutesElapsed * 60 + secondsElapsed) / timeLimit) * 100;
    //This is used to show the visual completion percent
    var percentCompleteAngle = map(percentComplete, 0, 100, 0, 360);

    push();
    translate(windowWidth / 2, windowHeight / 2);
    noFill();
    strokeWeight(7);
    stroke(rgb(14, 49, 80));
    arc(0, 0, 300, 300, 270, 270);
    stroke(rgb(109, 201, 200));
    arc(0, 0, 300, 300, 270, (percentCompleteAngle * -1) - 90);
    pop();

    push();
    textSize(40);
    var textColor = color(14, 49, 80);
    fill(textColor);

    //This is used to format the time
    if (minutesElapsed > 9) {
      text(minutesElapsed + ":" + secondsElapsed, windowWidth / 2, windowHeight / 2.2);
    } else if (secondsElapsed > 9) {
      text("0" + minutesElapsed + ":" + secondsElapsed, windowWidth / 2, windowHeight / 2.2);
    } else {
      text("0" + minutesElapsed + ":" + "0" + secondsElapsed, windowWidth / 2, windowHeight / 2.2);
    }

    //This is used to create the fade-in and fade-out effects of the text
    if (secondsElapsed % 12 < 6) {
      var transparency = map(((currentTime - startTime) / 1000) % 12, 0, 5, 0, 255);
    } else {
      var transparency = map(((currentTime - startTime) / 1000) % 12, 6, 11, 255, 0);
    }

    textColor.setAlpha(transparency);

    if (percentComplete === 100) {
      fill(14, 49, 80);
      text("Complete", windowWidth / 2, windowHeight / 1.8);
      meditationSound.stop();
      resetSprite.visible = true;
    } else if (floor(((currentTime - startTime) / 1000)) % 12 < 6) {
      fill(textColor);
      text("Breathe In", windowWidth / 2, windowHeight / 1.8);
    } else {
      fill(textColor);
      text("Breathe Out", windowWidth / 2, windowHeight / 1.8);
    }
    pop();

  }

  //Restarts the countdown
  if (page === "meditation/reset") {
    meditationSound.play();
    resetSprite.visible = false;
    page = "meditation/start"
    startTime = millis();
    timeLimit = 60;
  }

  drawSprites();
}


//This is used to check if and when a sprite is clicked, and accordingly sets up the different pages
function mouseClicked() {

  if (page === "open") {
    if (checkClick(loginChoiceSprite)) {
      page = "login";

      loginChoiceSprite.visible = false;
      signUpChoiceSprite.visible = false;

      loginBox = createInput("Enter Name");
      loginBox.position(windowWidth / 2, windowHeight / 10 * 4);
      loginBox.center('horizontal');
      loginBox.style('font-size', '21px');
      loginBox.style('border', '2px solid #0e3150');
      loginBox.style('color', '#0e3150');
      loginBox.style('border-radius', '2px');
      loginBox.size(200);

      passwordBox = createInput("Enter Password");
      passwordBox.position(windowWidth / 2, windowHeight / 10 * 4.8);
      passwordBox.center('horizontal');
      passwordBox.style('font-size', '21px');
      passwordBox.style('border', '2px solid #0e3150');
      passwordBox.style('color', '#0e3150');
      passwordBox.style('border-radius', '2px');
      passwordBox.size(200);

      loginButton = createButton('Submit!');
      loginButton.position(windowWidth / 2, windowHeight / 10 * 5.6);
      loginButton.style('border', 'none');
      loginButton.style('background-color', '#6dc9c8');
      loginButton.style('text-align', 'center');
      loginButton.style('border-radius', '2px');
      loginButton.style('height', '30px');
      loginButton.style('width', '60px');
    }
    if (checkClick(signUpChoiceSprite)) {
      page = "signUp";

      loginChoiceSprite.visible = false;
      signUpChoiceSprite.visible = false;

      signUpBox = createInput("Enter Name");
      signUpBox.position(windowWidth / 2, windowHeight / 10 * 4);
      signUpBox.center('horizontal');
      signUpBox.style('font-size', '21px');
      signUpBox.style('border', '2px solid #0e3150');
      signUpBox.style('color', '#0e3150');
      signUpBox.style('border-radius', '2px');
      signUpBox.size(200);

      passwordBox = createInput("Enter Password");
      passwordBox.position(windowWidth / 2, windowHeight / 10 * 4.8);
      passwordBox.center('horizontal');
      passwordBox.style('font-size', '21px');
      passwordBox.style('border', '2px solid #0e3150');
      passwordBox.style('color', '#0e3150');
      passwordBox.style('border-radius', '2px');
      passwordBox.size(200);

      signUpButton = createButton('Submit!');
      signUpButton.position(windowWidth / 2, windowHeight / 10 * 5.6);
      signUpButton.style('border', 'none');
      signUpButton.style('background-color', '#6dc9c8');
      signUpButton.style('text-align', 'center');
      signUpButton.style('border-radius', '2px');
      signUpButton.style('height', '30px');
      signUpButton.style('width', '60px');
    }
  }

  if (page === "menu") {
    if (checkClick(gratitudeSprite)) {
      page = "gratitude";

      gratitudeInputBox = createInput("I'm grateful for...");
      gratitudeInputBox.position(windowWidth / 2, windowHeight / 7 * 3);
      gratitudeInputBox.center('horizontal');
      gratitudeInputBox.style('font-size', '21px');
      gratitudeInputBox.style('border', '2px solid #0e3150');
      gratitudeInputBox.style('color', '#0e3150');
      gratitudeInputBox.style('border-radius', '2px');
      gratitudeInputBox.size(200);

      gratitudeInputButton = createButton('Submit!');
      gratitudeInputButton.position(windowWidth / 2, windowHeight / 10 * 5.6);
      gratitudeInputButton.style('border', 'none');
      gratitudeInputButton.style('background-color', '#6dc9c8');
      gratitudeInputButton.style('text-align', 'center');
      gratitudeInputButton.style('border-radius', '2px');
      gratitudeInputButton.style('height', '30px');
      gratitudeInputButton.style('width', '60px');

    }
    if (checkClick(meditationSprite)) {
      page = "meditation";
      startSprite.visible = true;
    }
  }

  if (page === "gratitude") {
    if (checkClick(backSprite)) {
      gratitudeInputBox.remove();
      gratitudeInputButton.remove();
      page = "menu";
      quote = randomQuote();
    }
  }

  if (page === "meditation") {
    if (checkClick(startSprite)) {
      startSprite.visible = false;
      meditationSound.play();
      page = "meditation/start"
      startTime = millis();
      timeLimit = 60;
    }
    if (checkClick(backSprite)) {
      page = "menu";
      quote = randomQuote();
    }
  }

  if (page === "meditation/start") {
    if (checkClick(backSprite)) {
      page = "menu";
      quote = randomQuote();
      if (percentComplete === 100) {
        //The score is incremented by 10 after pressing the reset button or back button after completing meditation
        meditationScore += 10;
        var reference = "accounts/" + userKey;
        var ref = database.ref(reference);
        ref.update({
          "MeditationScore": meditationScore
        });
      }
    }
    if (checkClick(resetSprite)) {
      page = "meditation/reset";
      if (percentComplete === 100) {
        //The score is incremented by 10 after pressing the reset button or back button after completing meditation
        meditationScore += 10;
        var reference = "accounts/" + userKey;
        var ref = database.ref(reference);
        ref.update({
          "MeditationScore": meditationScore
        });
      }
    }
  }
}

//This uses the dimenions of a sprite to check whether or not the mouseclick occured on it
function checkClick(Sprite) {
  if (mouseX > Sprite.x - Sprite.width / 2 &&
    mouseX < Sprite.x + Sprite.width / 2 &&
    mouseY > Sprite.y - Sprite.height / 2 &&
    mouseY < Sprite.y + Sprite.height / 2) {
    return true;
  }
}

//This selects a random quote
function randomQuote() {
  var quoteBank = [
    '“Meditation is to be aware of what is going on: in your body, in your feelings, in your mind, and in the world.”',
    '“Walk as if you are kissing the Earth with your feet.”',
    '“Walk as if you are kissing the Earth with your feet.”',
    '“Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor."',
    '“The greatest communication is usually how we are rather than what we say.”',
    '“Wherever you are, be there totally.”',
    '“What you are looking for is what is looking."',
    '“Do every act of your life as though it were the last act of your life.”',
    '“Meditate … do not delay, lest you later regret it.”',
    '“You can not stop the waves, but you can learn to surf.”',
    '"Use every distraction as an object of meditation and they cease to be distractions."'
  ];
  var sendQuote = random(quoteBank);
  return sendQuote;
}