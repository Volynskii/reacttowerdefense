import React from 'react';
import Enemy from "../classes/Enemy";
import waypoints from "../mocks/waypoints";


const GenerateEnemies = (amount, c) => {

    const enemies = [];

        for (let i = 1; i < amount + 1; i++) {
            const xOffset = i * 150
            enemies.push(
                new Enemy({
                    position: { x: waypoints[0].x - xOffset, y: waypoints[0].y },
                    c: c
                })
            )
        }

    return {
        enemies
    }
};

export default GenerateEnemies;