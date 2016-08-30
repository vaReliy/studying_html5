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
		if(i < DEIVER_COUNT)
			drivers.push(this.generateOneDriver());

	}
	return new Company('UBER-ground taxi', clients, drivers, BASE_FARE_DISTANCE, BASE_FARE_COST);
};
GameController.prototype.generateOneClient = function()
{
	return new ClientUnit(this.generator.getRandomName(), this.generator.getPositionPoint(), this.generator.getPositionPoint());
};
GameController.prototype.generateOneDriver = function()
{
	var speed = this.generator.getRandomIntValue(300, 500);
	var startMoney = this.generator.getRandomIntValue(150, 350);
	var fuelPerTick = this.generator.getRandomNumber(0.8, 1.2);
	fuelPerTick = Math.round(fuelPerTick * 100) / 100;
	return new TaxiUnit(this.generator.getRandomName() + " on '" + this.generator.getRandomAutoBrand() + "'", this.generator.getPositionPoint(), speed, startMoney, fuelPerTick);
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
	var hasFreeClient = companyController.hasFreeClients();
	var hasFreeDriver = companyController.hasFreeDrivers();
	var hasMovedDrivers = companyController.hasMovedDriver();
	var i, clientPos;

	if (hasFreeClient && hasFreeDriver)
	{
		var freeDrivers = companyController.getFreeDrivers();
		var freeClients = companyController.getFreeClients();

		if (freeClients.length > 50)
		{
			companyController.actualityFreeClients();
			freeClients = companyController.getFreeClients();
		}

		var less = freeDrivers.length - freeClients.length <= 0 ? freeDrivers.length : freeClients.length;
		for(i=0; i < less; i++)
		{
			var client = companyController.setNearerClientToDriver(freeClients, freeDrivers[i], onClientPosition);

			//todo: make global client to 'wait' status?
			var index = companyController.getAllClients().indexOf(client);
			if (index != -1)
				companyController.company.getClients()[index].setIsWaitTaxi(true);
		}

		var drivers;
		function onClientPosition()
		{
			drivers = companyController.getDriversWithClients();
			for(i=0; i < drivers.length; i++)
			{
				if(drivers[i].inClientPositionStart())
				{
					/*var index = companyController.getAllClients().indexOf(drivers[i].getClient());
					if (index != -1)
						companyController.company.getClients()[index].setIsWaitTaxi(false);*/

					clientPos = drivers[i].getClient().getPositionDestination();
					drivers[i].getClient().setInProgress(true);

					//todo:set client setIsWaitTaxi
					//drivers[i].getClient().setIsWaitTaxi(false);
					drivers[i].moveTo(clientPos, onClientPositionDestination);
				}
			}
		}

		function onClientPositionDestination()
		{
			drivers = companyController.getDriversWithClients();
			for(i = 0; i < drivers.length; i++)
			{
				if(drivers[i].inClientPositionDestination())
					companyController.makeClientToComplete(drivers[i]);
			}
			//companyController.company.printInfo();
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
	this.companyController.company.drivers.splice(index, 1);
};