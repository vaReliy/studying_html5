function Player(/*PIXI*/pixi, /*Container*/stage)
{
	this.pixi = pixi;
	this.stage = stage;

	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	this.globalAlpha = 1;
	this.graphics = undefined;
	this.isChangedPosition = false;
}
Player.prototype = Object.create(null);
Player.prototype.init = function()
{
	var tile = new Tile(this.pixi, this.x, this.y, Color.PLAYER, this.globalAlpha);
	this.graphics = tile.getGraphics();
	this.stage.addChild(this.graphics);
};
Player.prototype.getGraphics = function()
{
	return this.graphics;
};
Player.prototype.setIsChangedPosition = function(/*boolean*/value)
{
	this.isChangedPosition = value;
};
Player.prototype.getIsChangedPosition = function()
{
	return this.isChangedPosition;
};
Player.prototype.updatePosition = function()
{
	this.graphics.x += this.graphics.vx;
	this.graphics.y += this.graphics.vy;
};