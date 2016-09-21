function GameController(stage, renderer, pixi)
{
	this.pixi = pixi;
	this.stage = stage;
	this.renderer = renderer;

	this.view = null;
}
GameController.prototype = Object.create(null);
GameController.prototype.init = function()
{
	this.view = new ViewController(this.stage, this.renderer, this.pixi);
	this.view.init();
};

GameController.prototype.draw = function()
{
	this.renderer.render(this.stage);
};

GameController.prototype.update = function()
{
    //console.log("I'm updated");
};
