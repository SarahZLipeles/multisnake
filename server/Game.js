const models = require("./Models");
const Snake = models.Snake;
const Food = models.Food;

module.exports = class Game {
    constructor(size = 100) {
        this.snakes = {};
        this.players = [];
        this.playerMoves = {};
        this.foods = [];
        this.size = size;
        this.playArea = (this.size / 2);
        this.safeRange = Math.floor(this.playArea * 0.9);
        this.players.length = 0;
    }

    playerJoin(playerId) {
        this.snakes[playerId] = new Snake("x+", this.safeRange);
        this.players.push(playerId);
        this.playerMoves[playerId] = { move: "", ready: false };
        if (this.players.length > (2 * this.foods.length)) {
            this.foods.push(new Food(this.safeRange, 3));
        }
    }

    playerLeave(playerId) {
        delete this.snakes[playerId];
        delete this.playerMoves[playerId];
        this.players.splice(this.players.indexOf(playerId), 1);
    }

    ready() {
        for (var i = 0; i < this.players.length; i++) {
            if (!this.playerMoves[this.players[i]].ready) return false;
        }
        return true;
    }

    state() {
        const newSnake = {};
        let currentSegment;
        for (const id in this.snakes) {
            newSnake[id] = [];
            currentSegment = this.snakes[id].head;
            while (currentSegment) {
                newSnake[id].push({
                    x: currentSegment.x,
                    y: currentSegment.y,
                    z: currentSegment.z
                });
                currentSegment = currentSegment.next;
            }
        }
        return { snakes: newSnake, foods: this.foods };
    }

    /* Time complexity assuming the following:
            p = number of players
            s = longest snake length
        O(s(p^2))
        Note: maximum complexity is size^6 (all squares checked against eachother)
    */
    //--------------------------------------------------------------------------
    tick() {
        let currPlayerId, currMove, currSnake;
        for (let i = 0; i < this.players.length; i++) {
            currPlayerId = this.players[i];
            currSnake = this.snakes[currPlayerId];
            currSnake.turn(this.playerMoves[currPlayerId].move);
            currSnake.move();
            this.playerMoves[currPlayerId].ready = false;
            // Check for food collision
            let currFood;
            for (let j = 0; j < this.foods.length; j++) {
                currFood = this.foods[j];
                if (currSnake.head.coincides(currFood)) {
                    for (let k = 0; k < currFood.value; k++) {
                        currSnake.grow();
                    }
                    this.foods[j] = new Food(this.safeRange, 3);
                }
            }
            //Check for snake collision
            if (Math.abs(currSnake.head.x) > this.playArea || Math.abs(currSnake.head.y) > this.playArea || Math.abs(currSnake.head.z) > this.playArea) {
                currSnake.die();
            } else {
                for (let j = 0; j < this.players.length; j++) {
                    if (this.players[j] === currPlayerId) {
                        if (currSnake.suicides()) {
                            currSnake.die();
                        } else {continue;}
                    }
                    if (this.snakes[this.players[j]].collides(currSnake.head)) {
                        currSnake.die();
                        break;
                    }
                }
            }
        }
    }
    //--------------------------------------------------------------------------
};

