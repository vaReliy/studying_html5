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
    if(this.player.getIsChangedPosition())
    {
	    this.player.updatePosition();
	    //this.player.setIsChangedPosition(false);
    }
};

GameController.prototype.initKeyboard = function(player)
{
	var mc = player.getGraphics();

	var left = keyboard(Keys.LEFT),
		up = keyboard(Keys.UP),
		right = keyboard(Keys.RIGHT),
		down = keyboard(Keys.DOWN);

	//Left
	left.press = function()
	{
		mc.vx = -Velociti.SHIFT;
		mc.vy = Velociti.ZERO;
		player.setIsChangedPosition(true);
	};

	left.release = function()
	{
		if(!right.isDown && mc.vy === Velociti.ZERO)
		{
			mc.vx = Velociti.ZERO;
			player.setIsChangedPosition(true);
		}
	};

	//Up
	up.press = function()
	{
		mc.vy = -Velociti.SHIFT;
		mc.vx = Velociti.ZERO;
		player.setIsChangedPosition(true);
	};
	up.release = function()
	{
		if(!down.isDown && mc.vx === Velociti.ZERO)
		{
			mc.vy = Velociti.ZERO;
			player.setIsChangedPosition(true);
		}
	};

	//Right
	right.press = function()
	{
		mc.vx = Velociti.SHIFT;
		mc.vy = Velociti.ZERO;
		player.setIsChangedPosition(true);
	};
	right.release = function()
	{
		if(!left.isDown && mc.vy === Velociti.ZERO)
		{
			mc.vx = Velociti.ZERO;
			player.setIsChangedPosition(true);
		}
	};

	//Down
	down.press = function()
	{
		mc.vy = Velociti.SHIFT;
		mc.vx = Velociti.ZERO;
		player.setIsChangedPosition(true);
	};
	down.release = function()
	{
		if(!up.isDown && mc.vx === Velociti.ZERO)
		{
			mc.vy = Velociti.ZERO;
			player.setIsChangedPosition(true);
		}
	};
};


function keyboard(keyCode)
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
	window.addEventListener("keydown", key.downHandler.bind(key), false);
	window.addEventListener("keyup", key.upHandler.bind(key), false);
	return key;
}
