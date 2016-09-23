function Player(/*PIXI*/pixi, /*Container*/stage)
{
	this.pixi = pixi;
	this.stage = stage;

	this.x = 0;
	this.y = GameConstants.UNIT_RECT_SIDE * (Map.WORLD_SIZE - 3);
	this.vx = 0;
	this.vy = 0;
	this.globalAlpha = 1;
	this.graphics = undefined;
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
Player.prototype.updatePosition = function()
{
	this.graphics.x += this.vx;
	this.graphics.y += this.vy;
};