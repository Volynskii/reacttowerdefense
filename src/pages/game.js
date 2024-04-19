import React, {useEffect, useState} from 'react';
import generateTiles from "../utils/generateTiles";
import generateMap from "../utils/generateMap";
import generateEnemies from "../utils/generateEnemies";
import Building from "../classes/Building";
import Sprite from "../classes/Sprite";
import myImageExplosion from "../img/explosion.png";
import Level from "../utils/levels/level1";
import Coins from "../components/coins";
import Hearts from "../components/hearts";

const Game = () => {


    const [heartsDisplayCount, setHeartsDisplayCount] = useState(3);
    const [coinsDisplayCount, setCoinsDisplayCount] = useState(100);

    const test = Level(0);
    console.log('test!',test)

    useEffect(() => {
        const mouse = {
            x: undefined,
            y: undefined
        }
        let enemyCount = 3;
        const { image, canvas, ctx } = generateMap(1280,768);
        let { enemies } = generateEnemies(enemyCount, ctx);
        const { placementTiles } = generateTiles(ctx);
        let hearts = 10;
        let coins = 100;
        const explosions = [];
        const buildings = [];
        let activeTile = undefined;

        const onDecrementHearts = () => {
            setHeartsDisplayCount((prev)=> prev - 1)
        };
        const onDecrementHearts2 = () => {
            hearts--;
        };

        function spawnMoreEnemies(count) {
            enemyCount += count;
            const newEnemies = generateEnemies(enemyCount, ctx).enemies;
            enemies = newEnemies;
        }

        image.onload = () => {
            animate();
        };

        function animate() {
            const animationId = requestAnimationFrame(animate)
            ctx.drawImage(image, 0, 0);
            console.log('animate!')
            handleEnemyLogic(animationId);
            handleTilesLogic();
            handleBuildingsLogic();
        }

        function handleEnemyLogic(animationId) {

            if (enemies.length === 0) {
                spawnMoreEnemies(2)
            }

            for (let i = enemies.length - 1; i >= 0; i--) {
                const enemy = enemies[i]
                enemy.update()
                if (enemy.position.x > canvas.width) {
                    onDecrementHearts();
                    onDecrementHearts2();
                    enemies.splice(i, 1)
                    if (hearts <= 0) {
                        cancelAnimationFrame(animationId)
                        document.querySelector('#gameOver').style.display = 'flex'
                    }
                }
            }
        }

        function handleTilesLogic() {
            placementTiles.forEach((tile) => {
                tile.update(mouse)
            })
        }

        function handleBuildingsLogic() {
            buildings.forEach((building) => {
                updateBuilding(building);
                handleBuildingTarget(building);
                handleBuildingProjectiles(building);
            });
        }

        function updateBuilding(building) {
            building.update();
        }

        function handleBuildingTarget(building) {
            const validEnemies = findValidEnemies(building);
            building.target = validEnemies[0];
        }

        function findValidEnemies(building) {
            return enemies.filter((enemy) => {
                const distance = calculateDistance(enemy.center, building.center);
                return distance < enemy.radius + building.radius;
            });
        }

        function handleBuildingProjectiles(building) {
            for (let i = building.projectiles.length - 1; i >= 0; i--) {
                const projectile = building.projectiles[i];
                updateProjectile(projectile);
                handleProjectileCollision(projectile, building, i); // pass 'i' to handleProjectileCollision
            }
        }

        function updateProjectile(projectile) {
            projectile.update();
        }

        function handleProjectileCollision(projectile, building, i) {
            const distance = calculateDistance(projectile.enemy.center, projectile.position);
            if (distance < projectile.enemy.radius + projectile.radius) {
                handleEnemyHit(projectile.enemy);
                handleProjectileHit(projectile, building, i);
            }
        }

        function handleEnemyHit(enemy) {
            enemy.health -= 20;
            if (enemy.health <= 0) {
                const enemyIndex = enemies.findIndex((e) => e === enemy);
                if (enemyIndex > -1) {
                    enemies.splice(enemyIndex, 1);
                    coins += 25;
                    document.querySelector('#coins').innerHTML = coins;
                }
            }
        }

        function handleProjectileHit(projectile, building, i) {
            explosions.push(
                new Sprite({
                    position: { x: projectile.position.x, y: projectile.position.y },
                    imageSrc: myImageExplosion,
                    frames: { max: 4 },
                    offset: { x: 0, y: 0 },
                    c: ctx
                })
            );
            building.projectiles.splice(i, 1);
        }

        function calculateDistance(point1, point2) {
            const xDifference = point1.x - point2.x;
            const yDifference = point1.y - point2.y;
            return Math.hypot(xDifference, yDifference);
        }


        canvas.addEventListener('click', (event) => {
            if (activeTile && !activeTile.isOccupied && coins - 50 >= 0) {
                coins -= 50
                document.querySelector('#coins').innerHTML = coins
                buildings.push(
                    new Building({
                        position: {
                            x: activeTile.position.x,
                            y: activeTile.position.y
                        },
                        c:ctx
                    })
                )
                activeTile.isOccupied = true
                buildings.sort((a, b) => {
                    return a.position.y - b.position.y
                })
            }
        })

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.clientX
            mouse.y = event.clientY

            activeTile = null
            for (let i = 0; i < placementTiles.length; i++) {
                const tile = placementTiles[i]
                if (
                    mouse.x > tile.position.x &&
                    mouse.x < tile.position.x + tile.size &&
                    mouse.y > tile.position.y &&
                    mouse.y < tile.position.y + tile.size
                ) {
                    activeTile = tile
                    break
                }
            }
        })

    }, []);


    return (
        <>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <canvas id="gameCanvas"></canvas>
                <div
                    id="gameOver"
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '72px',
                        color: 'white',
                        WebkitTextStroke: '3px black'
                    }}
                >
                    GAME OVER
                </div>
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '400px',
                        height: '80px',
                        background: 'linear-gradient(to left bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))'
                    }}
                ></div>
                <div
                    style={{
                        position: 'absolute',
                        top: '4px',
                        right: '8px',
                        fontSize: '36px',
                        color: 'white',
                        WebkitTextStroke: '2px black',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                   <Coins coinsDisplayCount={coinsDisplayCount}/>
                    <Hearts heartsDisplayCount={heartsDisplayCount}/>
                </div>
            </div>
        </>
    );
};

export default Game;
