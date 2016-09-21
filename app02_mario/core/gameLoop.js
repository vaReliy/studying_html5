function StartGameLoop(document, gameControllerName)
{
    var _currentRenderTime = 0;
    var _deltaRenderTime = 0;
    var _lastRenderTime = 0;
    var _prevTickTime = 0;
    var _stage, _renderer, _gameController;

    createStage();
    initGame();
    render();

    function createStage()
    {
	    _stage = new PIXI.Container();
	    _renderer = PIXI.autoDetectRenderer(GameConstants.WIDTH, GameConstants.HEIGHT);
	    document.body.appendChild(_renderer.view);
    }

    function initGame()
    {
        _gameController = new gameControllerName(_stage, _renderer, PIXI);
	    if (_gameController instanceof GameController)
	    {
		    _gameController.init();
	    }
	    else
	    {
		    console.log('ERROR! ');
	    }
    }

    function render()
    {
        _currentRenderTime = Date.now();
        _deltaRenderTime = _currentRenderTime - _lastRenderTime;

        globalUpdate();
        globalRender();
        requestAnimationFrame( render );

        _lastRenderTime = _currentRenderTime;
    }

    function globalRender()
    {
        _gameController.draw();
    }

    function globalUpdate()
    {
        if (_prevTickTime < GameConstants.TICK_TIME)
        {
            _prevTickTime += _deltaRenderTime;
        }
        else
        {
            _prevTickTime = 0;
            _gameController.update();
        }
    }
}