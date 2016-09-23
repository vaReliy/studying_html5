function GameController(stage, renderer, pixi)
{
	this.pixi = pixi;
	this.stage = stage;
	this.renderer = renderer;

	this.view = undefined;
	this.bg = undefined;
	this.player = undefined;
}
GameController.prototype = Object.create(null);
GameController.prototype.init = function()
{
	/*this.view = new ViewController(this.stage, this.renderer, this.pixi);
 this.view.init();*/

	this.bg = new Background(this.pixi, this.stage);
	this.bg.init();

	this.player = new Player(this.pixi, this.stage);
	this.player.init();

	this.initKeyboard(this.player);
};

GameController.prototype.draw = function()
{
	this.renderer.render(this.stage);
};

GameController.prototype.update = function()
{
	this.player.updatePosition();
};

GameController.prototype.initKeyboard = function(/*Player*/player)
{
	var left = getKeyFromKeyboard(Key.LEFT),
		up = getKeyFromKeyboard(Key.UP),
		right = getKeyFromKeyboard(Key.RIGHT),
		down = getKeyFromKeyboard(Key.DOWN);

	left.press = function()
	{
		player.vx = -Velocity.SHIFT;
		player.vy = Velocity.ZERO;
	};

	left.release = function()
	{
		if(!right.isDown && player.vy === Velocity.ZERO)
		{
			player.vx = Velocity.ZERO;
		}
	};

	up.press = function()
	{
		player.vy = -Velocity.SHIFT;
		player.vx = Velocity.ZERO;
	};
	up.release = function()
	{
		if(!down.isDown && player.vx === Velocity.ZERO)
		{
			player.vy = Velocity.ZERO;
		}
	};

	right.press = function()
	{
		player.vx = Velocity.SHIFT;
		player.vy = Velocity.ZERO;
	};
	right.release = function()
	{
		if(!left.isDown && player.vy === Velocity.ZERO)
		{
			player.vx = Velocity.ZERO;
		}
	};

	down.press = function()
	{
		player.vy = Velocity.SHIFT;
		player.vx = Velocity.ZERO;
	};
	down.release = function()
	{
		if(!up.isDown && player.vx === Velocity.ZERO)
		{
			player.vy = Velocity.ZERO;
		}
	};
};


function getKeyFromKeyboard(/*number*/keyCode)
{
	var key = {};
	key.code = keyCode;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;

	//The `downHandler`
	key.downHandler = function(event)
	{
		console.log('down: ' + event.keyCode);
		if(event.keyCode === key.code)
		{
			if(key.isUp && key.press)
			{
				key.press();
			}
			key.isDown = true;
			key.isUp = false;
		}
		event.preventDefault();
	};

	//The `upHandler`
	key.upHandler = function(event)
	{
		console.log('up: ' + event.keyCode);
		if(event.keyCode === key.code)
		{
			if(key.isDown && key.release)
			{
				key.release();
			}
			key.isDown = false;
			key.isUp = true;
		}
		event.preventDefault();
	};

	//Attach event listeners
	window.addEventListener("keydown", key.downHandler, false);
	window.addEventListener("keyup", key.upHandler, false);
	return key;
}
