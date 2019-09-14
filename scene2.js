class Scene2 extends Phaser.Scene{
	constructor(){
		super('playGame');
	}

	preload(){
		
	}

	create(){
		this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background');
		this.background.setOrigin(0,0);

		this.ship1 = this.add.sprite(config.width / 2 - 50, config.height / 2, "ship");
	    this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
	    this.ship3 = this.add.sprite(config.width / 2 + 50, config.height / 2, "ship3");

	    this.anims.create({
	    	key: 'ship1_anim',
	    	frames: this.anims.generateFrameNumbers('ship'),
	    	frameRate: 20,
	    	repeat: -1
	    });

	    this.anims.create({
	    	key: 'ship2_anim',
	    	frames: this.anims.generateFrameNumbers('ship2'),
	    	frameRate: 20,
	    	repeat: -1
	    });

	    this.anims.create({
	    	key: 'ship3_anim',
	    	frames: this.anims.generateFrameNumbers('ship3'),
	    	frameRate: 20,
	    	repeat: -1
	    });

	    this.anims.create({
	    	key: 'explosion',
	    	frames: this.anims.generateFrameNumbers('explosion'),
	    	frameRate: 20,
	    	repeat: 0
	    });

	    this.ship1.play('ship1_anim');
	    this.ship2.play('ship2_anim');
	    this.ship3.play('ship3_anim');

	    //To make sure each ship's sprite and default animation is not overwritten we add them as a property.
	    let ships = [this.ship1,this.ship2,this.ship3];
	    ships.forEach( (ship) => {
	    	ship.defaultSprite = ship.texture.key;
	    	ship.defaultAnimation = ship.anims.currentAnim.key;
	    });

	    //When a ship completes an animation it will trigger a completion function related to that animation (if one exists).
	    ships.forEach( (ship) => {
	    	ship.on('animationcomplete', function (anim, frame) {
			  this.emit('animationcomplete_' + anim.key, anim, frame, ship);
			}, ship);

			ship.on('animationcomplete_explosion', (anim, frame, ship) => {
				this.reviveShip(ship);
			}, this);

			this.ship1.setInteractive();
		    this.ship2.setInteractive();
		    this.ship3.setInteractive();
	    });

	    this.input.on('gameobjectdown', this.destroyShip, this);
	}

	moveShip(ship, speed){
		ship.y += speed;
		if ( ship.y > config.height ) this.resetShipPos(ship);
	}

	resetShipPos(ship, pos = 0){
		ship.y = pos;
		let randomX = Phaser.Math.Between(0, config.width);
		ship.x = randomX;
	}

	destroyShip(pointer, gameObject){
		gameObject.setTexture('explosion');
		gameObject.play('explosion');
	}

	reviveShip(ship)
	{
		ship.setTexture(ship.defaultSprite);
		ship.play(ship.defaultAnimation);
		this.resetShipPos(ship, -200); //We reposition the ship at -200 pixels above the scene so that it is not immediatly back on screen.
	}

	update(){
		this.moveShip(this.ship1, 1);
		this.moveShip(this.ship2, 2);
		this.moveShip(this.ship3, 3);
		this.background.tilePositionY -= 0.5;
	}
}