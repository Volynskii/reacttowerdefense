
class EnemiesGenerator {
    constructor(c, Enemy, waypoints) {
        this.c = c;
        this.Enemy = Enemy;
        this.waypoints = waypoints;
    }

    generate(amount) {
        const enemies = [];

        for (let i = 1; i < amount + 1; i++) {
            const xOffset = i * 150;
            enemies.push(
                new this.Enemy({
                    position: { x: this.waypoints[0].x - xOffset, y: this.waypoints[0].y },
                    c: this.c
                })
            );
        }

        return enemies;
    }
}

export default EnemiesGenerator;