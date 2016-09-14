//interface IDisposable
function IDisposable()
{
}
IDisposable.prototype = Object.create(null);
	GameController.prototype.dispose = function()
	{
		console.log('this function must be override!');
	};

//interface IController
function IController()
{
	IDisposable.call(this);
}
IController.prototype = Object.create(IDisposable);
	//Graph
	GameController.prototype.parent = function()
	{
		console.log('this function must be override!');
	};
	GameController.prototype.children = function()
	{
		console.log('this function must be override!');
	};
	GameController.prototype.childrenMap = function()
	{
		console.log('this function must be override!');
	};
	GameController.prototype.addChild = function()
	{
		console.log('this function must be override!');
	};
	GameController.prototype.getChild = function()
	{
		console.log('this function must be override!');
	};
	GameController.prototype.getChildKey = function()
	{
		console.log('this function must be override!');
	};
	//Listeners
	GameController.prototype.listeners = function()
	{
		console.log('this function must be override!');
	};
	GameController.prototype.addListener = function()
	{
		console.log('this function must be override!');
	};
	GameController.prototype.removeListener = function()
	{
		console.log('this function must be override!');
	};
	GameController.prototype.getListenersBy = function()
	{
		console.log('this function must be override!');
	};
	//Messages
	GameController.prototype.processMessage = function()
	{
		console.log('this function must be override!');
	};
	GameController.prototype.sendMessage = function()
	{
		console.log('this function must be override!');
	};
	GameController.prototype.setFreePass = function()
	{
		console.log('this function must be override!');
	};
	GameController.prototype.getFreePass = function()
	{
		console.log('this function must be override!');
	};

