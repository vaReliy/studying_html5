function Tile(/*PIXI*/pixi, /*number*/x, /*number*/y, /*number*/color, /*number*/alpha)
{
	this.pixi = pixi;

	this.x = x;
	this.y = y;
	this.color = color;
	this.alpha = alpha;
	this.graphics = null;

	this.initGraphics();
}
Tile.prototype = Object.create(null);
Tile.prototype.initGraphics = function()
{
	this.graphics = new this.pixi.Graphics();
	this.graphics.beginFill(this.color, this.alpha);
	this.graphics.drawRect(this.x, this.y, GameConstants.UNIT_RECT_SIDE, GameConstants.UNIT_RECT_SIDE);
};
Tile.prototype.getGraphics = function()
{
	return this.graphics;
};
