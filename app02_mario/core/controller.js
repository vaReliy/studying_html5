importScripts('interfaces.js');
importScripts('enums/MessageDirection.js');

function Controller(parent, freePass)
{
	//private
	var _parent = parent;
	var _freePass = freePass || MessageDirection.ANY;
	var _children = [];
	var _childrenMap = {};
	var _listeners = [];

	// getters
	var getParent = function ()
	{
		return _parent;
	};
	var getFreePass = function ()
	{
		return _freePass;
	};
	var getChildren = function ()
	{
		return _children;
	};
	var getChildrenChildrenMap = function ()
	{
		return _childrenMap;
	};
	var getListeners = function ()
	{
		return _listeners;
	};

	this.setupChildren();
	this.setupListeners();
}
Controller.prototype = Object.create(IController);

GameController.prototype.setupChildren = function()
{
};
GameController.prototype.setupListeners = function()
{
};

