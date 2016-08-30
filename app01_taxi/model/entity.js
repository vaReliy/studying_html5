//class EntityUnit
function EntityUnit(id)
{
	this.id = id;
}
EntityUnit.prototype = Object.create(null);
EntityUnit.prototype.getId = function()
{
	return this.id;
};
EntityUnit.prototype.tick = function()
{
	console.log(this.id + ': tick()');
};
EntityUnit.prototype.toString = function()
{
	console.log();
	var str = this.id + ': ';
	for (var field in this)
	{
		str += ', ' + field + ';';
	}
	console.log(str);
};


//class Company
function Company(id, clients, drivers, baseFareDistance, baseFareCost)
{
	this.id = id;
	this.clients = clients;
	this.drivers = drivers;
	this.baseFareDistance = baseFareDistance;
	this.baseFareCost = baseFareCost;
	this.totalMoney = 0;
}
Company.prototype = Object.create(null);
Company.prototype.getBaseFareDistance = function()
{
	return this.baseFareDistance;
};
Company.prototype.getBaseFareCost = function()
{
	return this.baseFareCost;
};
Company.prototype.getClients = function()
{
	return this.clients;
};
Company.prototype.getDrivers = function()
{
	return this.drivers;
};
Company.prototype.getDistance = function(posA, posB)
{
	var x1 = posA.x, y1 = posA.y, x2 = posB.x, y2 = posB.y;
	return Math.sqrt( (Math.pow( (x2 - x1), 2 )) + (Math.pow( (y2 - y1), 2 )) );
};
Company.prototype.toString = function()
{
	var str = this.id + ': totalMoney=' + this.totalMoney;
	str += '\nclients: ';
	for (var i=0; i < this.clients.length; i++)
	{
		str += this.clients[i].toString() + ', ';
	}
	str += '\ndrivers: ';
	for (i=0; i < this.drivers.length; i++)
	{
		str += this.drivers[i].toString() + ', ';
	}
	console.log(str);
};
Company.prototype.printInfo = function()
{
	var str = '\n>> ' + this.id + ' <<\t\t Money: ' + this.totalMoney.toFixed(2);;
	str += '\nclients [' + this.clients.length +  ']:\n';
	for (var i=0; i < this.clients.length; i++)
	{
		str += this.clients[i].printInfo();
		if(i != this.clients.length-1)
			str += ', ';
	}

	str += '\n>\tdrivers [' + this.drivers.length +  ']:\n';
	for (i=0; i < this.drivers.length; i++)
	{
		str += '\t' + this.drivers[i].printInfo();
		if(i != this.drivers.length-1)
			str += '\n';
	}
	console.log(str);
};
Company.prototype.getInfo = function()
{
	var str = '"' + this.id + '", $: ' + this.totalMoney.toFixed(2);
	str += '\nTotal clients:\t' + this.clients.length + ', ';
	str += 'Total drivers:\t' + this.drivers.length + '.';
	return str;
};
Company.prototype.addMoney = function(value)
{
	this.totalMoney += value;
};


//class TaxiUnit
function TaxiUnit(id, currentPosition, speed, money, fuelPerTick)
{
	EntityUnit.call(this, id);
	this.currentPosition = currentPosition;
	this.destinationPosition = null;
	this.speed = speed;
	this.money = money;
	this.fuelPerTick = fuelPerTick;
	this.isAvailable = true;
	this.isMoved = false;
	this.client = null;
	this.callback = null;
}
extend(TaxiUnit, EntityUnit);
TaxiUnit.prototype.setClient = function(value)
{
	this.client = value;
};
TaxiUnit.prototype.getClient = function()
{
	return this.client;
};
TaxiUnit.prototype.getCurrentPosition = function()
{
	return this.currentPosition;
};
TaxiUnit.prototype.setCurrentPosition = function(value)
{
	this.currentPosition = value;
};
TaxiUnit.prototype.updateCurrentPosition = function(deltaX, deltaY)
{
	this.currentPosition.x += deltaX;
	this.currentPosition.y += deltaY;
};
TaxiUnit.prototype.setPositionDestination = function()
{
	this.destinationPosition = null;
};
TaxiUnit.prototype.getPositionDestination = function()
{
	return this.destinationPosition;
};
TaxiUnit.prototype.getCallback = function()
{
	return this.callback;
};
TaxiUnit.prototype.setCallback = function(value)
{
	this.callback = value;
};
TaxiUnit.prototype.getIsAvailable = function()
{
	return this.isAvailable;
};
TaxiUnit.prototype.setIsAvailable = function(value)
{
	this.isAvailable = value;
};
TaxiUnit.prototype.addMoney = function(value)
{
	this.money += value;
	this.money = Math.round(this.money * 100) / 100;
};
TaxiUnit.prototype.getIsMoved = function()
{
	return this.isMoved;
};
TaxiUnit.prototype.setIsMoved = function(value)
{
	this.isMoved = value;
};
TaxiUnit.prototype.moveTo = function(destinationPosition, callback)
{
	if (!this.destinationPosition)
	{
		this.destinationPosition = destinationPosition;
		this.isAvailable = false;
		this.isMoved = true;
		this.callback = callback;
	}
};
TaxiUnit.prototype.inClientPositionStart = function()
{
	return (this.getClient() && this.getCurrentPosition().x == this.getClient().getPositionStart().x &&
		this.getCurrentPosition().y == this.getClient().getPositionStart().y);
};
TaxiUnit.prototype.inClientPositionDestination = function()
{
	return (this.getClient() && this.getCurrentPosition().x == this.getClient().getPositionDestination().x &&
		this.getCurrentPosition().y == this.getClient().getPositionDestination().y);
};
TaxiUnit.prototype.getMoney = function()
{
	return this.money;
};
TaxiUnit.prototype.getFuelPerTick = function()
{
	return this.fuelPerTick;
};
TaxiUnit.prototype.getSpeed = function()
{
	return this.speed;
};
TaxiUnit.prototype.toString = function()
{
	return 'id: ' + this.id + ', currentPosition: ' + this.currentPosition + ', speed: ' + this.speed + ', money: ' + this.money + ', fuelPerTick: ' +
		this.fuelPerTick + ', isAvailable: ' + this.getIsAvailable();
};
TaxiUnit.prototype.printInfo = function()
{
	return 'id: ' + this.id + ', money: ' + this.money + (this.getIsAvailable() ? ', available' : ', not available');
};


//class ClientUnit
function ClientUnit(id, posA, posB)
{
	EntityUnit.call(this, id);
	this.positionStart = posA;
	this.positionDestination = posB;
	this.inProgress = false;
	this.isActive = true;
	this.isWaitTaxi = false;
}
extend(ClientUnit, EntityUnit);
ClientUnit.prototype.toString = function()
{
	return 'id: ' + this.id + ', positionStart: ' + this.positionStart + ', positionDestination: ' + this.positionDestination;
};
ClientUnit.prototype.printInfo = function()
{
	return 'id: ' + this.id;
};
ClientUnit.prototype.getPositionStart = function()
{
	return this.positionStart;
};
ClientUnit.prototype.getPositionDestination = function()
{
	return this.positionDestination;
};
ClientUnit.prototype.setInProgress = function(value)
{
	this.inProgress = value;
};
ClientUnit.prototype.getInProgress = function()
{
	return this.inProgress;
};
ClientUnit.prototype.setIsActive = function(value)
{
	this.isActive = value;
};
ClientUnit.prototype.getIsActive = function()
{
	return this.isActive;
};
ClientUnit.prototype.setIsWaitTaxi = function(value)
{
	this.isWaitTaxi = value;
};
ClientUnit.prototype.getIsWaitTaxi = function()
{
	return this.isWaitTaxi;
};


//class PositionPoint
function PositionPoint(x, y)
{
	this.x = x;
	this.y = y;
}
PositionPoint.prototype = Object.create(null);
PositionPoint.prototype.toString = function()
{
	return 'x: ' + this.x + ', y: ' + this.y;
};



function extend(Child, Parent) {
	var F = function() {};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
}