function GameLoop(document, gameControllerName)
{
    var _currentRenderTime = 0;
    var _deltaRenderTime = 0;
    var _lastRenderTime = 0;
    var _prevTickTime = 0;
    var _canvas, _context, _gameController;

    createCanvas();
    initGame();
    render();

    function createCanvas()
    {
        _canvas = document.createElement("canvas");
        _canvas.width = GameConstants.WIDTH;
        _canvas.height = GameConstants.HEIGHT;
        _context = _canvas.getContext("2d");
        document.body.appendChild( _canvas );
    }

    function initGame()
    {
        _gameController = new gameControllerName();
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
        _context.clearRect(0, 0, GameConstants.WIDTH, GameConstants.HEIGHT);
        _context.strokeRect(0, 0, GameConstants.WIDTH, GameConstants.HEIGHT);

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