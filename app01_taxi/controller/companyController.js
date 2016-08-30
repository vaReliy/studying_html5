function CompanyController(company)
{
	this.company = company;
	this.driversWithClients = [];
}
CompanyController.prototype = Object.create(null);
CompanyController.prototype.getDriversWithClients = function()
{
	return this.driversWithClients;
};
CompanyController.prototype.setDriversWithClients = function(value)
{
	this.driversWithClients.push(value);
};
CompanyController.prototype.removeDriversWithClients = function(driver)
{
	var origArr = this.driversWithClients;
	for (var i=0; i < origArr.length; i++)
	{
		var index = origArr.indexOf(driver);
		if (index > -1) {
			origArr.splice(index, 1);
		}
	}
	this.driversWithClients = origArr;
};
CompanyController.prototype.getAllClients = function()
{
	return this.company.clients;
};
CompanyController.prototype.getFreeClients = function()
{
	var arr = this.company.clients;
	var freeClients = [];
	for (var i=0; i < arr.length; i++)
	{
		if ((arr[i] instanceof ClientUnit) && !arr[i].getInProgress() && !arr[i].getIsWaitTaxi())
			freeClients.push(arr[i]);
	}
	return freeClients;
};
CompanyController.prototype.actualityFreeClients = function()
{
	var arr = this.company.clients;
	var actualClients = [];
	for (var i=0; i < arr.length; i++)
	{
		if ((arr[i] instanceof ClientUnit) && arr[i].getIsActive())
			actualClients.push(arr[i]);
	}
	this.company.clients = actualClients;
};
CompanyController.prototype.hasFreeClients = function()
{
	var arr = this.company.clients;
	for (var i=0; i < arr.length; i++)
	{
		if ((arr[i] instanceof ClientUnit) && !arr[i].getInProgress() && arr[i].getIsActive() && !arr[i].getIsWaitTaxi())
			return true;
	}
	return false;
};
CompanyController.prototype.getFreeDrivers = function()
{
	var arr = this.company.drivers;
	var freeDrivers = [];
	for (var i=0; i < arr.length; i++)
	{
		if ((arr[i] instanceof TaxiUnit) && arr[i].getIsAvailable())
			freeDrivers.push(arr[i]);
	}
	return freeDrivers;
};
CompanyController.prototype.hasFreeDrivers = function()
{
	var arr = this.company.drivers;
	for (var i=0; i < arr.length; i++)
	{
		if ((arr[i] instanceof TaxiUnit) && arr[i].getIsAvailable())
			return true;
	}
	return false;
};
CompanyController.prototype.hasMovedDriver = function()
{
	var arr = this.company.drivers;
	for (var i=0; i < arr.length; i++)
	{
		if ((arr[i] instanceof TaxiUnit) && arr[i].getIsMoved())
			return true;
	}
	return false;
};
CompanyController.prototype.getMovedDrivers = function()
{
	var arr = this.company.drivers;
	var movedDrivers = [];
	for (var i=0; i < arr.length; i++)
	{
		if ((arr[i] instanceof TaxiUnit) && arr[i].getIsMoved())
			movedDrivers.push(arr[i]);
	}
	return movedDrivers;
};
CompanyController.prototype.setNearerClientToDriver = function(clientsArray, driver, callback)
{
	var distance = Number.MAX_VALUE, index = 0;
	for (var i=0; i < clientsArray.length; i++)
	{
		var s = this.calculateDistanceBetweenTwoPoints(clientsArray[i].getPositionStart(), driver.getCurrentPosition())
		if (s < distance)
		{
			distance = s;
			index = i;
		}
	}
	clientsArray[index].setIsWaitTaxi(true);
	driver.setClient(clientsArray[index]);
	driver.moveTo(clientsArray[index].getPositionStart(), callback);
	this.setDriversWithClients(driver);
	return clientsArray[index];
};
CompanyController.prototype.calculateDistanceBetweenTwoPoints = function(pointA, pointB)
{
	var x1 = pointA.x, y1 = pointA.y, x2 = pointB.x, y2 = pointB.y;
	return Math.sqrt( (Math.pow( (x2 - x1), 2 )) + (Math.pow( (y2 - y1), 2 )) );
};
CompanyController.prototype.makeClientToComplete = function(driver)
{
	/* update money */
	var fare = this.calculateFare(driver.getClient());
	fare = Math.round(fare * 100) / 100;
	var taxiProfit = Math.round(FARE_PART_DRIVER * fare * 100) / 100;
	var companyProfit = Math.round(FARE_PART_COMPANY * fare * 100) / 100;
	driver.addMoney(taxiProfit);
	this.company.addMoney(companyProfit);

	driver.getClient().setIsActive(false);
	driver.getClient().setInProgress(false);
	driver.setIsAvailable(true);
	var ind = this.getAllClients().indexOf(driver.getClient());
	if (ind != -1)
	{
		this.getAllClients()[ind].setIsActive(false);
		this.getAllClients()[ind].setInProgress(false);
		//this.getAllClients()[ind].setIsWaitTaxi(false);
	}
	this.removeDriversWithClients(driver);
};
CompanyController.prototype.calculateDriverCurrentPosition = function(driver, deltaRT)
{
	if (driver.getIsMoved())
	{
		var x1 = driver.getCurrentPosition().x, y1 = driver.getCurrentPosition().y,
			x2 = driver.getPositionDestination().x, y2 = driver.getPositionDestination().y;
		var totalS = Math.sqrt( (Math.pow( (x2 - x1), 2 )) + (Math.pow( (y2 - y1), 2 )) );
		var currS = driver.getSpeed() * deltaRT / 1e3;

		var dx = (currS * (x2 - x1) / totalS);
		var dy = (currS * (y2 - y1) / totalS);
		driver.updateCurrentPosition(Math.round(dx), Math.round(dy));

		if (Math.abs(driver.getCurrentPosition().x - driver.getPositionDestination().x) < UNIT_RECT_SIDE/3 &&
			Math.abs(driver.getCurrentPosition().y - driver.getPositionDestination().y) < UNIT_RECT_SIDE/3)
		{
			driver.setCurrentPosition(driver.getPositionDestination());
			driver.setIsMoved(false);

			if (driver.getCallback)
			{
				driver.setPositionDestination(null);
				var callback = driver.getCallback();
				driver.setCallback(null);
				if (callback)
					callback();
			}
		}

		if (x1 != driver.getCurrentPosition().x || y1 != driver.getCurrentPosition().y)
		{
			driver.addMoney(-driver.getFuelPerTick());
			if (driver.getMoney() < 0)
			{
				//alert('taxi ' + driver.getId() + ' has no money: ' + driver.getMoney());
				//todo: mb some action?
			}
		}
	}
};
CompanyController.prototype.calculateFare = function(client)
{
	var distance = this.calculateDistanceBetweenTwoPoints(client.getPositionStart(), client.getPositionDestination());
	distance = Math.round(distance * 100) / 100;
	var totalFare = this.company.getBaseFareCost();
	if (distance > this.company.getBaseFareDistance())
	{
		distance -= this.company.getBaseFareDistance();
		totalFare += distance*0.17*this.company.getBaseFareCost();
	}
	totalFare = Math.round(totalFare * 100) / 100;
	return totalFare;
};




