function randint(n) {
    return Math.round(Math.random() * n);
}

function rand(n) {
    return Math.random() * n;
}

class Pair {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return "(" + this.x + "," + this.y + ")";
    }

    normalize() {
        var magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
    }
}

class Stage {
    constructor(canvas) {
        this.canvas = canvas;

        this.actors = []; // all actors on this stage (monsters, player, boxes, ...)
        this.bullets = [];
        this.items = [];
        this.terrains = [];
        this.agents = [];
        this.player = null; // a special actor, the player

        // the logical width and height of the stage
        this.width = 1600;
        this.height = 1600;

        // the real window width and height
        this.windowWidth = this.canvas.width;
        this.windowheight = this.canvas.height;
        

        // the window top-left corner offset
        this.windowOffset = new Pair(this.width / 2 - this.windowWidth / 2, this.height / 2 - this.windowheight / 2);

        // Add the player to the center of the stage
        this.addPlayer(new Player(this, new Pair(Math.floor(this.width / 2), Math.floor(this.height / 2)), 30));

        // generate items at random places
        // generate wall
        var total = 20;
        while (total > 0) {
            var x = Math.floor((Math.random() * this.width));
            var y = Math.floor((Math.random() * this.height));
            if (this.getActor(x, y) === null) {
                if (randint(1)) {
                    var max = randint(10);
                    for (var i = 0; i < max; i++) {
                        if (x + i * 30 > this.width) {
                            break;
                        }
                        var wall = new Wall(this, new Pair(x + i * 30, y), 30);
                        this.addTerrain(wall);
                    }
                } else {
                    var max = randint(10);
                    for (var i = 0; i < max; i++) {
                        if (y + i * 30 > this.height) {
                            break;
                        }
                        var wall = new Wall(this, new Pair(x, y + i * 30), 30);
                        this.addTerrain(wall);
                    }
                }
                total--;
            }
        }

        // generate ammo
        var total = 5;
        while (total > 0) {
            var x = Math.floor((Math.random() * this.width));
            var y = Math.floor((Math.random() * this.height));
            if (this.getActor(x, y) === null) {
                var ammo = new Ammo(this, new Pair(x, y));
                this.addItem(ammo);
                total--;
            }
        }
        // generate bandage
        var total = 5;
        while (total > 0) {
            var x = Math.floor((Math.random() * this.width));
            var y = Math.floor((Math.random() * this.height));
            if (this.getActor(x, y) === null) {
                var bandage = new Bandage(this, new Pair(x, y));
                this.addItem(bandage);
                total--;
            }
        }
        // generate random enemy
        var total = 2;
        while (total > 0) {
            var x = Math.floor((Math.random() * this.width));
            var y = Math.floor((Math.random() * this.height));
            if (this.getActor(x, y) === null) {
                var randomEnemy = new RandomEnemy(this, new Pair(x, y), 30);
                this.addAgent(randomEnemy);
                total--;
            }
        }
        // generate simple enemy
        // var total = 2;
        // while (total > 0) {
        //     var x = Math.floor((Math.random() * this.width));
        //     var y = Math.floor((Math.random() * this.height));
        //     if (this.getActor(x, y) === null) {
        //         var simpleEnemy = new SimpleEnemy(this, new Pair(x, y), 30);
        //         this.addAgent(simpleEnemy);
        //         total--;
        //     }
        // }
        this.addAgent(new SimpleEnemy(this, new Pair(this.width / 2 - this.windowWidth / 4, this.height / 2 - this.windowheight / 4), 30));
        this.addAgent(new SimpleEnemy(this, new Pair(this.width / 2 - this.windowWidth / 4, this.height / 2 + this.windowheight / 4), 30));
        // generate dummy enemy
        this.addAgent(new DummyEnemy(this, new Pair(this.width / 2 + this.windowWidth / 4, this.height / 2 + this.windowheight / 4), 30));

        // generate rock
        var total = 25;
        while (total > 0) {
            var x = Math.floor((Math.random() * this.width));
            var y = Math.floor((Math.random() * this.height));
            if (this.getActor(x, y) === null) {
                var rock = new Rock(this, new Pair(x, y), 30);
                this.addTerrain(rock);
                total--;
            }
        }


    }

    addActor(actor) {
        this.actors.push(actor);
    }

    removeActor(actor) {
        var index = this.actors.indexOf(actor);
        if (index != -1) {
            this.actors.splice(index, 1);
        }
    }

    addAgent(agent) {
        this.agents.push(agent);
        this.addActor(agent);
    }

    removeAgent(agent) {
        var index = this.agents.indexOf(agent);
        if (index != -1) {
            this.agents.splice(index, 1);
        }
        this.removeActor(agent);
    }

    addPlayer(player) {
        this.addAgent(player);
        this.player = player;
    }

    removePlayer() {
        this.removeAgent(this.player);
        this.player = null;
    }

    addItem(item) {
        this.items.push(item);
        this.addActor(item);
    }

    removeItem(item) {
        var index = this.items.indexOf(item);
        if (index != -1) {
            this.items.splice(index, 1);
        }
        this.removeActor(item);
    }

    addTerrain(terrain) {
        this.terrains.push(terrain);
        this.addActor(terrain);
    }

    removeTerrain(terrain) {
        var index = this.terrains.indexOf(terrain);
        if (index != -1) {
            this.terrains.splice(index, 1);
        }
        this.removeActor(terrain);
    }

    addBullet(bullet) {
        this.bullets.push(bullet);
        this.addActor(bullet);
    }

    removeBullet(bullet) {
        var index = this.bullets.indexOf(bullet);
        if (index != -1) {
            this.bullets.splice(index, 1);
        }
        this.removeActor(bullet);
    }

    // Take one step in the animation of the game.  Do this by asking each of the actors to take a single step.
    // NOTE: Careful if an actor died, this may break!
    step() {
        for (var i = 0; i < this.actors.length; i++) {
            this.actors[i].step();
        }
    }

    draw() {
        var context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.windowWidth, this.windowheight);
        this.drawBoundary(context);
        for (var i = 0; i < this.actors.length; i++) {
            this.actors[i].draw(context);
        }
        if (this.player != null) {
            this.drawAmmoBar(context);
            this.drawHealthBar(context);
        }
    }

    drawBoundary(context) {
        context.beginPath();
        context.strokeStyle = "#000";
        context.rect(0 - this.windowOffset.x, 0 - this.windowOffset.y, this.width, this.height);
        context.stroke();
    }

    drawAmmoBar(context) {
        var length = 0.2 * this.windowWidth;
        var height = 0.04 * this.windowheight;
        var offsetX = this.windowWidth - 0.02 * this.windowWidth - length;
        var offsetY = this.windowheight - 0.02 * this.windowheight - height;
        context.beginPath();
        context.strokeStyle = "#F00";
        context.rect(offsetX, offsetY, length, height);
        context.stroke();

        context.fillStyle = "rgba(255, 0, 0, 0.5)";
        context.fillRect(offsetX, offsetY, length * (this.player.getAmmoStatus()[0] / this.player.getAmmoStatus()[1]), height);
        context.fill();

        context.font = height / 2 + "px Arial";
        context.textAlign = "center";
        context.fillText(this.player.getAmmoStatus()[0] + " / " + this.player.getAmmoStatus()[1], offsetX + length / 2, offsetY + height * 0.65);
    }

    drawHealthBar(context) {
        var length = 0.2 * this.windowWidth;
        var height = 0.04 * this.windowheight;
        var offsetX = 0.02 * this.windowWidth;
        var offsetY = this.windowheight - 0.02 * this.windowheight - height;
        context.beginPath();
        context.strokeStyle = "#00F";
        context.rect(offsetX, offsetY, length, height);
        context.stroke();

        context.fillStyle = "rgba(0, 0, 255, 0.5)";
        context.fillRect(offsetX, offsetY, length * (this.player.getHealth() / 100), height);
        context.fill();

        context.font = height / 2 + "px Arial";
        context.textAlign = "center";
        context.fillText(this.player.getHealth() + " / 100", offsetX + length / 2, offsetY + height * 0.65);
    }

    // return the first actor at coordinates (x,y) return null if there is no such actor
    getActor(x, y) {
        for (var i = 0; i < this.actors.length; i++) {
            if (Math.abs(this.actors[i].position.x - x) < 100 && Math.abs(this.actors[i].position.y - y) < 100) {
                return this.actors[i];
            }
        }
        return null;
    }

    getAgents() {
        return this.agents;
    }

    getItems() {
        return this.items;
    }

    getTerrains() {
        return this.terrains;
    }

    getBullets() {
        return this.bullets;
    }

    getWindowSize() {
        return new Pair(this.windowWidth, this.windowheight);
    }

    getWindowOffset() {
        return this.windowOffset;
    }

    setWindowOffset(newPosition) {
        this.windowOffset.x = newPosition.x;
        this.windowOffset.y = newPosition.y;
    }
} // End Class Stage

class Actor {
    constructor(stage, position, size) {
        this.stage = stage;
        this.position = position;
        this.size = size;
    }

    draw(context) {
    }

    intPosition() {
        this.position.x = Math.round(this.position.x);
        this.position.y = Math.round(this.position.y);
    }

    getSize() {
        return this.size;
    }
}

// Agents declaration starts here
class Agent extends Actor {
    constructor(stage, position, size) {
        super(stage, position, size);
        this.direction = 1 / 2 * Math.PI;
        this.headTo = new Pair(0, 0);
        this.prevPos = new Pair(0,0);
        this.leftAmmo = 24;
        this.maxAmmo = 120;
        this.health = 100;
        this.weapon = 0;    // 0 is pistol; 1 is shotgun
    }

    setHeadTo(dx, dy) {
        this.headTo.x = dx;
        this.headTo.y = dy;
    }

    setDirection(dir) {
        this.direction = dir;
    }

    getAmmoStatus() {
        return [this.leftAmmo, this.maxAmmo];
    }

    getHealth() {
        return this.health;
    }

    fireWeapon() {
        if (this.leftAmmo > 0) {
            switch (this.weapon) {
                case 0: // pistol
                    this.stage.addBullet(new PistolBullet(this.stage, new Pair(this.position.x, this.position.y), this.direction, this));
                    this.leftAmmo -= 1;
                    break;
                case 1: // shotgun
                    if (this.leftAmmo >= 3) {
                        this.stage.addBullet(new ShotgunBullet(this.stage, new Pair(this.position.x, this.position.y), this.direction - Math.PI / 6, this));
                        this.stage.addBullet(new ShotgunBullet(this.stage, new Pair(this.position.x, this.position.y), this.direction, this));
                        this.stage.addBullet(new ShotgunBullet(this.stage, new Pair(this.position.x, this.position.y), this.direction + Math.PI / 6, this));
                        this.leftAmmo -= 3;
                    }
                    break;
            }
        }
    }

    collideWith(actor) {
        if (actor instanceof Ammo) {
            // console.log("found ammo");
            if (this.leftAmmo < this.maxAmmo) {
                if (this.leftAmmo + 12 > this.maxAmmo) {
                    this.leftAmmo = this.maxAmmo;
                } else {
                    this.leftAmmo += 12;
                }
                this.stage.removeItem(actor);
            }
        }
        if (actor instanceof Bandage) {
            // console.log("found bandage");
            if (this.health < 100) {
                if (this.health + 20 > 100) {
                    this.health = 100;
                } else {
                    this.health += 20;
                }
                this.stage.removeItem(actor);
            }
        }
        if (actor instanceof Rock || actor instanceof Wall) {
            // console.log("bump into solid terrain");
            var distance = (this.size + actor.size) / 2;
            if (this.headTo.x < 0) {
                if (!(this.position.y < actor.position.y - actor.size / 2 && this.headTo.y > 0 || this.position.y > actor.position.y + actor.size / 2 && this.headTo.y < 0)) {
                    if (actor.position.x <= this.position.x && this.position.x - actor.position.x < distance) {
                        this.position.x = actor.position.x + distance;
                    }
                }
            }
            if (this.headTo.x > 0) {
                if (!(this.position.y < actor.position.y - actor.size / 2 && this.headTo.y > 0 || this.position.y > actor.position.y + actor.size / 2 && this.headTo.y < 0)) {
                    if (this.position.x <= actor.position.x && actor.position.x - this.position.x < distance) {
                        this.position.x = actor.position.x - distance;
                    }
                }
            }
            if (this.headTo.y < 0) {
                if (!(this.position.x < actor.position.x - actor.size / 2 && this.headTo.x > 0 || this.position.x > actor.position.x + actor.size / 2 && this.headTo.x < 0)) {
                    if (actor.position.y <= this.position.y && this.position.y - actor.position.y < distance) {
                        this.position.y = actor.position.y + distance;
                    }
                }
            }
            if (this.headTo.y > 0) {
                if (!(this.position.x < actor.position.x - actor.size / 2 && this.headTo.x > 0 || this.position.x > actor.position.x + actor.size / 2 && this.headTo.x < 0)) {
                    if (this.position.y <= actor.position.y && actor.position.y - this.position.y < distance) {
                        this.position.y = actor.position.y - distance;
                    }
                }
            }
        }
    }
}

class Player extends Agent {
    constructor(stage, position, size) {
        super(stage, position, size);
        this.velocity = 3;
    }

    step() {
        if (this.health <= 0) {
            this.stage.removePlayer();
        }
        this.prevPos.x = this.position.x;
        this.prevPos.y = this.position.y;
        var magnitude = Math.sqrt(this.headTo.x * this.headTo.x + this.headTo.y * this.headTo.y);
        if (magnitude) {
            this.position.x = this.position.x + this.velocity * this.headTo.x / magnitude;
            this.position.y = this.position.y + this.velocity * this.headTo.y / magnitude;
        }
        if (this.position.x < 0) {
            this.position.x = 0;
        }
        if (this.position.x > this.stage.width) {
            this.position.x = this.stage.width;
        }
        if (this.position.y < 0) {
            this.position.y = 0;
        }
        if (this.position.y > this.stage.height) {
            this.position.y = this.stage.height;
        }
        this.stage.setWindowOffset(new Pair(this.position.x - this.stage.getWindowSize().x / 2, this.position.y - this.stage.getWindowSize().y / 2));
    }

    draw(context) {
        var offset = this.stage.getWindowOffset();
        // console.log(this.position.x, this.position.y);
        context.save();
        context.translate(this.position.x - offset.x, this.position.y - offset.y);
        context.rotate(this.direction);
        context.beginPath();
        context.fillStyle = "#000";
        context.arc(0, 0, this.size / 2, 0, 2 * Math.PI, false);
        context.moveTo(this.size / 4, -this.size / 4);
        context.arc(this.size / 4, -this.size / 4, this.size / 4, 0, 2 * Math.PI, false);
        context.moveTo(this.size / 4, this.size / 4);
        context.arc(this.size / 4, this.size / 4, this.size / 4, 0, 2 * Math.PI, false);
        context.fill();
        context.translate(-(this.position.x - offset.x), -(this.position.y - offset.y));
        context.restore();
    }

    changeWeapon() {
        this.weapon = 1 - this.weapon;
    }

    collideWith(actor) {
        super.collideWith(actor);
        this.stage.setWindowOffset(new Pair(this.position.x - this.stage.getWindowSize().x / 2, this.position.y - this.stage.getWindowSize().y / 2));
    }
}

class Enemy extends Agent {
    constructor(stage, position, size) {
        super(stage, position, size);
        this.color = "#FF0";
    }

    draw(context) {
        var offset = this.stage.getWindowOffset();
        var drawPos = new Pair(this.position.x - offset.x, this.position.y - offset.y);
        context.save();
        context.translate(drawPos.x, drawPos.y);
        context.rotate(this.direction);

        context.beginPath();
        context.rotate(Math.PI / 2);
        context.moveTo(-this.size / 2, -this.size / 2 - 7);
        context.strokeStyle = "#F00";
        context.rect(-this.size / 2, -this.size / 2 - 7, this.size, 5);
        context.stroke();
        context.beginPath();
        context.fillStyle = "#F00";
        context.fillRect(-this.size / 2, -this.size / 2 - 7, this.size * (this.health / 100), 5);
        context.fill();
        context.rotate(-Math.PI / 2);

        context.beginPath();
        context.fillStyle = this.color;
        context.arc(0, 0, this.size / 2, 0, 2 * Math.PI, false);
        context.moveTo(this.size / 4, -this.size / 4);
        context.arc(this.size / 4, -this.size / 4, this.size / 4, 0, 2 * Math.PI, false);
        context.moveTo(this.size / 4, this.size / 4);
        context.arc(this.size / 4, this.size / 4, this.size / 4, 0, 2 * Math.PI, false);
        context.fill();
        context.translate(-drawPos.x, -drawPos.y);
        context.restore();
    }
}

class DummyEnemy extends Enemy {
    constructor(stage, position, size = 15) {
        super(stage, position, size);
        this.color = "#0FF";
    }

    step() {
        if (this.health <= 0) {
            this.stage.removeAgent(this);
        }
    }
}

class SimpleEnemy extends Enemy {
    constructor(stage, position, size = 15) {
        super(stage, position, size);
        this.color = "#F0F";
        this.counter = 0;
    }

    step() {
        if (this.health <= 0) {
            this.stage.removeAgent(this);
        }

        if (this.stage.player === null) {
            return
        }

        if (this.counter === 0) {
            var dx = this.position.x - this.stage.player.position.x;
            var dy = this.position.y - this.stage.player.position.y;
            this.direction = Math.atan2(dy, dx) + Math.PI;
            if (this.direction === 0) {
                this.headTo.x = 1;
                this.headTo.y = 0;
            } else if (0 < this.direction && this.direction < Math.PI / 2) {
                this.headTo.x = 1;
                this.headTo.y = 1;
            } else if (this.direction === Math.PI / 2) {
                this.headTo.x = 0;
                this.headTo.y = 1;
            } else if (Math.PI / 2 < this.direction && this.direction < Math.PI) {
                this.headTo.x = -1;
                this.headTo.y = 1;
            } else if (this.direction === Math.PI) {
                this.headTo.x = -1;
                this.headTo.y = 0;
            } else if (Math.PI < this.direction && this.direction < Math.PI * 3 / 2) {
                this.headTo.x = -1;
                this.headTo.y = -1;
            } else if (this.direction === Math.PI * 3 / 2) {
                this.headTo.x = 0;
                this.headTo.y = -1;
            } else if (Math.PI * 3 / 2 < this.direction && this.direction < Math.PI * 2) {
                this.headTo.x = 1;
                this.headTo.y = -1;
            }
        }
        this.counter = (this.counter + 1) % 10;
        var fire = randint(100);
        if (fire <= 2 && this.leftAmmo > 0) {
            this.fireWeapon();
        }

        this.prevPos.x = this.position.x;
        this.prevPos.y = this.position.y;

        this.position.x = this.position.x + 1 * this.headTo.x;
        this.position.y = this.position.y + 1 * this.headTo.y;

        if (this.position.x < 0) {
            this.position.x = 0;
        }
        if (this.position.x > this.stage.width) {
            this.position.x = this.stage.width;
        }
        if (this.position.y < 0) {
            this.position.y = 0;
        }
        if (this.position.y > this.stage.height) {
            this.position.y = this.stage.height;
        }
        this.intPosition();
    }
}

class RandomEnemy extends Enemy {
    constructor(stage, position, size = 15) {
        super(stage, position, size);
        this.counter = 0;
        this.dx = 0;
        this.dy = 0;
        this.leftAmmo = 60;
        this.color = "#0F0";
    }

    step() {
        if (this.health <= 0) {
            this.stage.removeAgent(this);
        }
        if (this.counter === 0) {
            this.headTo.x = randint(2) - 1;
            this.headTo.y = randint(2) - 1;
            this.direction = rand(2 * Math.PI) - Math.PI;
        }
        this.counter = (this.counter + 1) % 10;
        var fire = randint(100);
        if (fire <= 10 && this.leftAmmo > 0) {
            this.fireWeapon();
        }

        this.prevPos.x = this.position.x;
        this.prevPos.y = this.position.y;

        this.position.x = this.position.x + 3 * this.headTo.x;
        this.position.y = this.position.y + 3 * this.headTo.y;

        if (this.position.x < 0) {
            this.position.x = 0;
        }
        if (this.position.x > this.stage.width) {
            this.position.x = this.stage.width;
        }
        if (this.position.y < 0) {
            this.position.y = 0;
        }
        if (this.position.y > this.stage.height) {
            this.position.y = this.stage.height;
        }
        this.intPosition();
    }
}

// Agents declaration ends here

// Items declaration starts here
class Item extends Actor {
    constructor(stage, position, size, color) {
        super(stage, position);
        this.size = size;
        this.color = color;
    }

    step() {
        var agents = this.stage.getAgents();
        for (var i = 0; i < agents.length; i++) {
            var agent = agents[i];
            var dx = agent.position.x - this.position.x;
            var dy = agent.position.y - this.position.y;
            if (Math.sqrt(dx * dx + dy * dy) < (this.size + agent.getSize()) / 2) {
                agent.collideWith(this);
            }
        }
    }

    draw(context) {
        var offset = this.stage.getWindowOffset();
        var drawPos = new Pair(this.position.x - offset.x, this.position.y - offset.y);
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(drawPos.x, drawPos.y, this.size / 2, 0, 2 * Math.PI, false);
        context.fill();
    }
}

class Ammo extends Item {
    constructor(stage, position) {
        super(stage, position, 24, "rgba(255, 0, 0, 0.5)");
    }
}

class Bandage extends Item {
    constructor(stage, position) {
        super(stage, position, 24, "rgba(0, 0, 255, 0.5)");
    }
}

// Items declaration ends here

// Terrains declaration starts here
class Terrain extends Actor {
    constructor(stage, position, size) {
        super(stage, position, size);
    }

    step() {}
}

class Rock extends Terrain {
    constructor(stage, position, size) {
        super(stage, position, size);
        this.color = "rgba(128, 128, 128, 0.7)";
    }

    draw(context) {
        var offset = this.stage.getWindowOffset();
        var drawPos = new Pair(this.position.x - offset.x, this.position.y - offset.y);
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(drawPos.x - this.size / 2, drawPos.y - this.size / 2, this.size, this.size);
        context.fill();
    }

    step() {
        var agents = this.stage.getAgents();
        for (var i = 0; i < agents.length; i++) {
            var agent = agents[i];
            var dx = agent.position.x - this.position.x;
            var dy = agent.position.y - this.position.y;
            if (Math.abs(dx) < (this.size + agent.getSize()) / 2 && Math.abs(dy) < (this.size + agent.getSize()) / 2) {
                agent.collideWith(this);
            }
        }
    }
}

class Wall extends Terrain {
    constructor(stage, position, size) {
        super(stage, position, size);
        this.color = "#FF9900";
        this.health = 2;
    }

    draw(context) {
        var offset = this.stage.getWindowOffset();
        var drawPos = new Pair(this.position.x - offset.x, this.position.y - offset.y);

        context.beginPath();
        context.strokeStyle = this.color;
        context.rect(drawPos.x - this.size / 2, drawPos.y - this.size / 2, this.size, this.size);
        context.stroke();
        context.beginPath();
        context.fillStyle = "rgba(255, 153, 0, 0.6)";
        context.fillRect(drawPos.x - this.size / 2, drawPos.y - this.size / 2, this.size, this.size);
        context.fill();
    }

    step() {
        if (this.health <= 0) {
            this.stage.removeTerrain(this);
        }
        var agents = this.stage.getAgents();
        for (var i = 0; i < agents.length; i++) {
            var agent = agents[i];
            var dx = agent.position.x - this.position.x;
            var dy = agent.position.y - this.position.y;
            if (Math.abs(dx) < (this.size + agent.getSize()) / 2 && Math.abs(dy) < (this.size + agent.getSize()) / 2) {
                agent.collideWith(this);
            }
        }
    }
}

// Terrains declaration ends here


// Bullets declaration starts here
class Bullet extends Actor {
    constructor(stage, position, direction, shooter) {
        super(stage, position);
        this.size = 10;
        this.range = 400;
        this.intPosition(); // this.x, this.y are int version of this.position
        this.velocity = 10;   // speed
        this.direction = direction; // in terms of pi
        this.shooter = shooter;
    }

    step() {
        this.position.x = this.position.x + this.velocity * Math.cos(this.direction);
        this.position.y = this.position.y + this.velocity * Math.sin(this.direction);
        this.range -= this.velocity;
        if (this.range <= 0) {
            this.delete();
        }

        if (this.position.x > 0 && this.position.x < this.stage.width && this.position.y > 0 && this.position.y < this.stage.height) {
            this.intPosition();
        } else {
            this.delete();
        }

        var agents = this.stage.getAgents();
        for (var i = 0; i < agents.length; i++) {
            var agent = agents[i];
            var dx = agent.position.x - this.position.x;
            var dy = agent.position.y - this.position.y;
            if (agent !== this.shooter && Math.sqrt(dx * dx + dy * dy) < (agent.getSize() + this.size) / 2) {
                agent.health -= 20;
                this.delete();
            }
        }
        var terrains = this.stage.getTerrains();
        for (var i = 0; i < terrains.length; i++) {
            var terrain = terrains[i];
            var dx = terrain.position.x - this.position.x;
            var dy = terrain.position.y - this.position.y;
            if (Math.abs(dx) < (this.size + terrain.getSize()) / 2 && Math.abs(dy) < (this.size + terrain.getSize()) / 2) {
                this.delete();
                if (terrain instanceof Wall) {
                    terrain.health -= 1;
                }
            }
        }
    }

    draw(context) {
        var offset = this.stage.getWindowOffset();
        var drawPos = new Pair(this.position.x - offset.x, this.position.y - offset.y);
        context.beginPath();
        context.fillStyle = "#F00";
        context.arc(drawPos.x, drawPos.y, this.size / 2, 0, 2 * Math.PI, false);
        context.fill();
    }

    delete() {
        this.stage.removeBullet(this);
    }
}

class PistolBullet extends Bullet {
    constructor(stage, position, direction, shooter) {
        super(stage, position, direction, shooter);
        this.size = 10;
        this.range = 500;
        this.velocity = 15;
    }
}

class ShotgunBullet extends Bullet {
    constructor(stage, position, direction, shooter) {
        super(stage, position, direction, shooter);
        this.size = 20;
        this.range = 300;
        this.velocity = 25;
    }
}

// Bullets declaration ends here