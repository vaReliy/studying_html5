function ViewController(stage, renderer, pixi)
{
	this.pixi = pixi;
	this.stage = stage;
	this.renderer = renderer;

	//aliases
	this.Container = this.pixi.Container;
	this.autoDetectRenderer = this.pixi.autoDetectRenderer;
	this.loader = this.pixi.loader;
	this.resources = this.pixi.loader.resources;
	this.Texture = this.pixi.Texture;
	this.Sprite = this.pixi.Sprite;

	//textures
	this.prefix = 'resources/';
	this.preloaderTile = null;
}
ViewController.prototype = Object.create(null);
ViewController.prototype.init = function()
{
	console.log(this.pixi);
	this.loadTextures();
};
ViewController.prototype.loadTextures = function()
{
	this.loader
		.add(this.prefix + 'mario_atlas.json')
		.load(this.applyTextures.bind(this));
};
ViewController.prototype.applyTextures = function()
{
	var sprite = new this.Sprite(this.resources[this.prefix + 'mario_atlas.json'].textures['mario_preloader.jpg']);
	sprite.anchor.x = sprite.width / 2;
	sprite.anchor.y = sprite.height / 2;
	sprite.x = GameConstants.WIDTH/2;
	sprite.y = GameConstants.HEIGHT/2;
	sprite.scale.x = 1.2;
	sprite.scale.y = 1.2;
	console.log('sprite.x = ' + sprite.x + ', sprite.y = ' + sprite.y);
	this.stage.addChild(sprite);
};