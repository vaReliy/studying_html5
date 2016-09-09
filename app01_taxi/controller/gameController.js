function GameController(sceneContext, sceneWidth, sceneHeight, unitRectSizeW, unitRectSizeH)
{
	this.scene = {
		context: sceneContext,
		width: sceneWidth,
		height: sceneHeight,
		unitRectSize: {
			width: unitRectSizeW,
			height: unitRectSizeH
		}
	};

	this.companyController = undefined;
	this.viewController = undefined;

	this.generator = new Generator(this.scene);
	this.timerId = null;
}
GameController.prototype = Object.create(null);
GameController.prototype.toJSON = function()
{
	return {
		__type:                 'GameController',
		scene:                  this.scene,
		companyController:      this.companyController,
		viewController:    		this.viewController,
		generator:          	this.generator,
		timerId:             	this.timerId
	};
};
GameController.revive = function(data, canvasContext)
{
	var scene = data.scene;
	data.scene.context = canvasContext;
	var u = scene.unitRectSize;
	var gameController = new GameController(scene.context, scene.width, scene.height, u.width, u.height);
	gameController.companyController = CompanyController.revive(data.companyController);
	gameController.viewController = new ViewController(gameController.scene, gameController.companyController);
    gameController.viewController.init();
	gameController.generator = new Generator(this.scene);
	gameController.timerId = data.timerId;
	return gameController;
};
GameController.prototype.initControllers = function()
{
	var company = this.generateCompany();
	this.companyController = new CompanyController(company);

	this.viewController = new ViewController(this.scene, this.companyController);
	this.viewController.init();

	this.runTimerClientsGeneration();
};
GameController.prototype.generateCompany = function()
{
	var clients = [];
	var drivers = [];
	for (var i=0; i < CLIENT_START_CONT; i++)
	{
		clients.push(this.generateOneClient());
		if(i < DRIVER_COUNT)
			drivers.push(this.generateOneDriver());

	}
	return new Company('UBER-ground taxi', clients, drivers, BASE_FARE_DISTANCE, BASE_FARE_COST);
};
GameController.prototype.generateOneClient = function()
{
	return new ClientUnit(this.generator.getPositionPoint(), this.generator.getPositionPoint());
};
GameController.prototype.generateOneDriver = function()
{
	var speed = this.generator.getRandomIntValue(300, 500);
	var startMoney = this.generator.getRandomIntValue(150, 350);
	var fuelPerTick = this.generator.getRandomNumber(0.8, 1.2);
	fuelPerTick = Math.round(fuelPerTick * 100) / 100;
	return new TaxiUnit(this.generator.getPositionPoint(), speed, startMoney, fuelPerTick);
};
GameController.prototype.runTimerClientsGeneration = function()
{
	var that = this;

	var delay = this.generator.getRandomNumber(15*TICK_TIME, 30*TICK_TIME);

	this.timerId = setInterval(generateClientToCompany, delay);

	function generateClientToCompany()
	{
		that.companyController.company.clients.push(that.generateOneClient());
	}
};
GameController.prototype.update = function()
{
	var companyController = this.companyController;
	companyController.actualityActiveClients();
	var hasFreeClient = companyController.hasFreeClients();
	var hasFreeDriver = companyController.hasFreeDrivers();
	var hasMovedDrivers = companyController.hasMovedDriver();
	var i, clientPos;

	if (hasFreeClient && hasFreeDriver)
	{
		var freeDrivers = companyController.getFreeDrivers();
		var freeClients = companyController.getFreeClients();

		var less = freeDrivers.length - freeClients.length <= 0 ? freeDrivers.length : freeClients.length;
		for(i=0; i < less; i++)
		{
			companyController.setNearerClientToDriver(freeClients, freeDrivers[i], onClientPosition);
		}

		var drivers, currentClient;
		function onClientPosition()
		{
			drivers = companyController.getDriversWithClients();
			for(i=0; i < drivers.length; i++)
			{
				currentClient = companyController.company.getClientById(drivers[i].getClientId());
				if(currentClient && drivers[i].inClientPositionStart(currentClient))
				{
					clientPos = currentClient.getPositionDestination();
					currentClient.setInProgress(true);
					drivers[i].moveTo(clientPos, onClientPositionDestination);
				}
			}
		}

		function onClientPositionDestination()
		{
			drivers = companyController.getDriversWithClients();
			for(i = 0; i < drivers.length; i++)
			{
				currentClient = companyController.company.getClientById(drivers[i].getClientId());
				if(drivers[i].inClientPositionDestination(currentClient))
				{
					companyController.makeClientToComplete(drivers[i], currentClient);
					currentClient.setIsActive(false);
					currentClient.setInProgress(false);
					currentClient.setIsWaitTaxi(false);
				}
			}
		}
	}
	else if(hasMovedDrivers)
	{
		var movedDrivers = companyController.getMovedDrivers();
		for (i=0; i < movedDrivers.length; i++)
		{
			companyController.calculateDriverCurrentPosition(movedDrivers[i], _deltaRenderTime);
		}
	}
};
GameController.prototype.printGameInfoInConsole = function()
{
	window.console.clear();
	this.companyController.company.printInfo();
};
GameController.prototype.draw = function()
{
	this.viewController.draw();
};
GameController.prototype.clientAdd = function()
{
	var client = this.generateOneClient();
	this.companyController.company.clients.push(client);
};
GameController.prototype.driverAdd = function()
{
	var driver = this.generateOneDriver();
	this.companyController.company.drivers.push(driver);
};
GameController.prototype.driverRemove = function()
{
	var drivers = this.companyController.company.drivers;
	var index = this.generator.getRandomIntValue(0, drivers.length);
	var driver = this.companyController.company.drivers[index];
	var currentClient = this.companyController.company.getClientById(driver.getClientId());
	if(currentClient)
	{
		currentClient.setIsActive(true);
		currentClient.setInProgress(false);
		currentClient.setIsWaitTaxi(false);
		currentClient.setPositionStart(driver.getCurrentPosition());
		this.companyController.removeDriverFromDriversWithClients(driver);
	}
	this.companyController.company.drivers.splice(index, 1);
};
GameController.prototype.saveGame = function()
{
	return JSON.stringify(this);
};