stage = null;
view = null;
interval = null;
keys = {};

function setupGame() {
    stage = new Stage(document.getElementById('stage'));

    // https://javascript.info/keyboard-events
    // https://developer.mozilla.org/en-US/docs/Web/Events#Keyboard_events
    document.addEventListener('keydown', moveByKey);
    document.addEventListener('keyup', moveByKey);
    // https://developer.mozilla.org/en-US/docs/Web/Events#Mouse_events
    document.addEventListener('mousemove', setDirection);
    // document.getElementById('stage').addEventListener('mousemove', faceDirection);
    document.addEventListener('mousedown', fireWeapon);
}

function startGame() {
    interval = setInterval(function () {stage.step(); stage.draw();}, 20);
}

function pauseGame() {
    clearInterval(interval);
    interval = null;
}

function moveByKey(event) {
    keys[event.code] = event.type === "keydown";
    var moveMap = {
        'KeyA': {"dx": -1, "dy": 0},
        'KeyS': {"dx": 0, "dy": 1},
        'KeyD': {"dx": 1, "dy": 0},
        'KeyW': {"dx": 0, "dy": -1}
    };
    var dx = 0, dy = 0;
    for (var key in keys) {
        if (key in moveMap && keys[key]) {
            dx += moveMap[key].dx;
            dy += moveMap[key].dy;
        }
        if (key === 'Tab' && keys[key]) {
            stage.player.changeWeapon();
        }
    }
    // console.log(dx, dy);
    if (stage.player != null) {
        stage.player.setHeadTo(dx, dy);
    }
}

function setDirection(event) {
    if (stage.player != null) {
        var canvas = document.getElementById('stage');
        var x = event.clientX - canvas.offsetLeft;
        var y = event.clientY - canvas.offsetTop;
        // console.log(event.clientX, event.clientY);
        // console.log(event.screenX, event.screenY);
        // console.log(canvas.offsetLeft, canvas.offsetTop);
        // console.log(x, y);
        var dx = x - stage.getWindowSize().x / 2;
        var dy = y - stage.getWindowSize().y / 2;
        stage.player.setDirection(Math.atan2(dy, dx));
    }
}

function fireWeapon() {
    if (stage.player != null) {
        stage.player.fireWeapon();
    }
}