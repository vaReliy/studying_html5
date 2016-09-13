function GameController()
{

}
GameController.prototype = Object.create(null);


GameController.prototype.draw = function()
{
    console.log("I'm drawing");
};

GameController.prototype.update = function()
{
    console.log("I'm updated");
};
