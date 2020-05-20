var heigth_screen = window.innerHeight;
var width_screen = window.innerWidth;

var game = new Phaser.Game(width_screen, heigth_screen, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'images/sky.png');
	game.load.image('win', 'images/win.jpg');
    game.load.image('ground', 'images/ground.png');
	game.load.image('platform', 'images/platform.png');
    game.load.image('car', 'images/car.png');
    game.load.spritesheet('Alex', 'images/Alex.png', 32, 48);
	game.load.audio('sound', 'sound/sound.mp3');
	game.load.audio('jump', 'sound/jump.mp3');
	game.load.audio('car', 'sound/car.mp3');
	game.load.audio('hurt', 'sound/hurt.mp3');

}

var player;
var platforms;
var cursors;

var car;
var score = 0;
var scoreText;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the platform and the 4 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the platform.
    var platform = platforms.create(0, game.world.height - 32, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platform.scale.setTo(5, 1);

    //  This stops it from falling away when you jump on it
    platform.body.immovable = true;
	
	// The player and its settings
    player = game.add.sprite(30, game.world.height - 80, 'Alex');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 600;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some cars to collect
    cars = game.add.group();

    //  We will enable physics for any car that is created in this group
    cars.enableBody = true;

    //  Here we'll create 20 of them evenly spaced apart
    for (var i = 0; i < 20; i++)
    {
        //  Create a car inside of the 'cars' group
        var car = cars.create(i * width_screen/19.5, 0, 'car');

        //  Let gravity do its thing
        car.body.gravity.y = 300;

        //  This just gives each car a slightly random bounce value
        car.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    scoreText = game.add.text(16, 16, 'score: '+score, { fontSize: '32px', fill: '#fdf' });
	
	//  The level
    levelText = game.add.text(width_screen - 116, 16, 'Level 1', { fontSize: '32px', fill: '#fdf' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
	
	//  The sound
	var sound = this.game.add.audio('sound');
    sound.play();
    
}

function update() {

    //  Collide the player and the cars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(cars, platforms);

    //  Checks to see if the player overlaps with any of the cars, if he does call the collectCar function
    game.physics.arcade.overlap(player, cars, collectCar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
		var sound = this.game.add.audio('jump');
        sound.play();
	}
	
	if (player.body.y > heigth_screen-50) {
		var sound = this.game.add.audio('hurt');
        //sound.play();
	    setTimeout(function () {
            end();
        },50);
	}
	
	if (cursors.down.isDown) {return restartGame();
	}
}

function restartGame() {
    this.game.state.restart();
    score = 0;
}

function win() {
	game.add.sprite(-50, -150, 'win');
	var game_win = "YOU'VE GOT ALL COLLECTION\n\n" + '\n\nCLICK FOR RESTART!';
    overTxt = game.add.text(game.world.centerX, game.world.centerY, game_win, { fill: '#08f', fontSize: '64px' , align: 'center'});
	overTxt.anchor.x = 0.5;
    overTxt.anchor.y = 0.5;
	game.paused = true;
}

function end() {
	var game_end = 'GAME OVER\n\n' + '\n\nHIT THE DOWN ARROW FOR RESTART!';
    overTxt = game.add.text(game.world.centerX, game.world.centerY, game_end, { fill: '#fdf', fontSize: '64px' , align: 'center'});
	overTxt.anchor.x = 0.5;
    overTxt.anchor.y = 0.5;
}

function collectCar (player, car) {
    
    // Removes the car from the screen
    car.kill();

    //  Add and update the score
    score += 1;
	var sound = this.game.add.audio('car');
    sound.play();
    scoreText.text = 'Score: ' + score;
    if (score == 20) {return create_level_2();
	} else if (score == 40) {return create_level_3();
	} else if (score == 60) {return create_level_4();
	} else if (score == 80) {return create_level_5();
	} else if (score == 100) {return create_level_6();
	} else if (score == 114) {return create_level_7();
	} else if (score == 125) {return create_level_8();
 	} else if (score == 145) {return create_level_9();
	} else if (score == 165) {return create_level_10();
	} else if (score == 185) {return win();
	} 
}