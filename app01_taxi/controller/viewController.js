function ViewController(scene, companyController)
{
	this.scene = scene;
	this.companyController = companyController;
	this.resources = {
		clientAvailable:    'resources/cl_15_04.png',
		clientWait:         'resources/cl_15_01.png',
		clientDestination:  'resources/money.png',
		taxiAvailable:      'resources/taxi_04.png',
		taxiInProgress:     'resources/taxi_01.png',
		backGround:     'resources/map_bg.png'
	};
	this.images = {};
}
ViewController.prototype = Object.create(null);
ViewController.prototype.toJSON = function()
{
	return {
		__type:		'ViewController',
		scene:		this.scene,
		resources:	this.resources,
		images:		this.images
	};
};
ViewController.revive = function(data, companyController)
{
	var vc = new ViewController(data.scene, companyController);
    vc.resources = data.resources;
    vc.images = data.images;
    return vc;
};
ViewController.prototype.draw = function()
{
	//var c = this.scene.context;
	var sprite;

	var clientsArray = this.companyController.company.getClients();
	
	sprite = this.images.backGround;
	sprite.updatePosition(0, 0);
	sprite.draw(0.5);
	
	for(var i = 0; i < clientsArray.length; i++)
	{
		var clientIsActive = clientsArray[i].getIsActive();
		var clientInProgress = clientsArray[i].getInProgress();
		var clientIsWaitTaxi = clientsArray[i].getIsWaitTaxi();
		if(!clientInProgress && !clientIsWaitTaxi && clientIsActive)
		{
			var clientPos = clientsArray[i].getPositionStart();
			sprite = this.images.clientAvailable;
			sprite.updatePosition(clientPos.x, clientPos.y);
			sprite.draw(0.6);
		}

		if(!clientInProgress &&clientIsWaitTaxi && clientIsActive)
		{
			clientPos = clientsArray[i].getPositionStart();
			sprite = this.images.clientWait;
			sprite.updatePosition(clientPos.x, clientPos.y);
			sprite.draw();
		}

		if(clientInProgress && clientsArray[i].getPositionDestination() && clientIsActive)
		{
			var clientPosDestination = clientsArray[i].getPositionDestination();
			sprite = this.images.clientDestination;
			sprite.updatePosition(clientPosDestination.x, clientPosDestination.y);
			sprite.draw();
		}
	}

	var driversArray = this.companyController.company.getDrivers();
	for(i = 0; i < driversArray.length; i++)
	{
		var driverPos = driversArray[i].getCurrentPosition();

		if (driversArray[i].getIsMoved())
		{
			sprite = this.images.taxiInProgress;
			sprite.updatePosition(driverPos.x, driverPos.y);
			sprite.draw();
		}
		else
		{
			sprite = this.images.taxiAvailable;
			sprite.updatePosition(driverPos.x, driverPos.y);
			sprite.draw();
		}
	}
};
ViewController.prototype.init = function()
{
	this.images = {
		clientAvailable:     new Sprite(this.scene.context, 0, 0, UNIT_RECT_SIDE, UNIT_RECT_SIDE),
		clientWait:          new Sprite(this.scene.context, 0, 0, UNIT_RECT_SIDE, UNIT_RECT_SIDE),
		clientDestination:   new Sprite(this.scene.context, 0, 0, UNIT_RECT_SIDE, UNIT_RECT_SIDE),
		taxiAvailable:       new Sprite(this.scene.context, 0, 0, UNIT_RECT_SIDE, UNIT_RECT_SIDE),
		taxiInProgress:      new Sprite(this.scene.context, 0, 0, UNIT_RECT_SIDE, UNIT_RECT_SIDE),
		backGround:			new Sprite(this.scene.context, 0, 0, this.scene.width, this.scene.height)
	};

	this.loadTexture('clientAvailable', this.resources.clientAvailable);
	this.loadTexture('clientWait', this.resources.clientWait);
	this.loadTexture('clientDestination', this.resources.clientDestination);
	this.loadTexture('taxiAvailable', this.resources.taxiAvailable);
	this.loadTexture('taxiInProgress', this.resources.taxiInProgress);
	this.loadTexture('backGround', this.resources.backGround);
};
ViewController.prototype.loadTexture = function(key, src)
{
	var that = this;
	var img = new Image();
	img.src = src;
	img.onload = function ()
	{
		that.images[key].setImage(img, 0, 0, UNIT_RECT_SIDE, UNIT_RECT_SIDE);
	};
};