function Background(/*PIXI*/pixi, /*Container*/stage)
{
	this.pixi = pixi;
	this.stage = stage;

	this.tiles = [];
	this.globalAlpha = 0.7;
}
Background.prototype = Object.create(null);
Background.prototype.init = function()
{
	for(var i = 0; i < Map.WORD_SIZE; i++)
	{
		for(var j = 0; j < Map.WORD_SIZE; j++)
		{
			var x = i * GameConstants.UNIT_RECT_SIDE;
			var y = j * GameConstants.UNIT_RECT_SIDE;
			var color = this.getColor(Map.WORD[j][i]);
			var tile = new Tile(this.pixi, x, y, color, this.globalAlpha);
			this.tiles.push(tile);
			this.stage.addChild(tile.getGraphics());
		}
	}
};
Background.prototype.getColor = function(/*string*/ sign)
{
	switch (sign)
	{
		case '0':
		{
			return Color.SKY;
		}

		case '#':
		{
			return Color.BOTTOM;
		}

		case '%':
		{
			return Color.BRICK;
		}

		default :
		{
			console.log('Background.getColor: SIGN "' + sign + '" NOT FOUND!');
			break;
		}
	}
};
Background.prototype.getBgTiles = function()
{
	return this.tiles;
};
Background.prototype.draw = function()
{

};

Background.prototype.update = function()
{

};