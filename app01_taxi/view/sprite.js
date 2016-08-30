function Sprite(context, imgX, imgY, imgWidth, imgHeight)
{
	this.context = context;
	this.img_elem = null;

	this.imgX = imgX;
	this.imgY = imgY;
	this.imgWidth = imgWidth;
	this.imgHeight = imgHeight;

	this.x = 0;
	this.y = 0;
	this.width = this.imgWidth;
	this.height = this.imgHeight;
}
Sprite.prototype = Object.create(null);
Sprite.prototype.setImage = function(value, x, y, w, h)
{
	if (value instanceof Image)
	{
		this.img_elem = value;
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	}
};
Sprite.prototype.updatePosition = function(x, y)
{
	this.x = x;
	this.y = y;
};
Sprite.prototype.draw = function(alpha)
{
	if (this.img_elem instanceof Image)
	{
		this.context.save();
		//this.context.translate(this.x, this.y);
		if (alpha && typeof(alpha) == 'number')
			this.context.globalAlpha = alpha;
		this.context.drawImage(this.img_elem, this.x, this.y);
		this.context.restore();
	}

};
