function Generator(scene)
{
	this.scene = scene;
}
Generator.prototype = Object.create(null);

Generator.prototype.getRandomIntValue = function(min, max)
{
	return Math.round(Math.random() * (max - min) + min);
};
Generator.prototype.getRandomNumber = function(min, max)
{
	return Math.random() * (max - min) + min;
};

Generator.prototype.getPositionPoint = function()
{
	var x = this.getRandomIntValue(0, this.scene.width - this.scene.unitRectSize.width);
	var y = this.getRandomIntValue(0, this.scene.height - this.scene.unitRectSize.height);
	return new PositionPoint(x, y);
};

Generator.prototype.getRandomName = function()
{
	return NAMES[this.getRandomIntValue(0, NAMES.length-1)];
};

Generator.prototype.getRandomAutoBrand = function()
{
	return AUTO_NAMES[this.getRandomIntValue(0, AUTO_NAMES.length-1)];
};
