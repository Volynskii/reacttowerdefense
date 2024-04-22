import React, {useEffect, useState} from 'react';
import Game from "../classes/game/game";
import Coins from "../components/coins";
import { EventObserver } from "../classes/observer";
import Hearts from "../components/hearts";

const GamePage = () => {



    const [coins,setCoins] = useState(100);
    const [hearts,setHearts] = useState(3);

    function handleCoinsChangedEvent(coins) {
        setCoins(coins);
    }

    function handleHeartsChangedEvent(hearts) {
        setHearts(hearts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    
    useEffect(() => {
        const game = new Game(coins, hearts);

        const coinsChangedObserver = new EventObserver(handleCoinsChangedEvent);
        const heartsChangedObserver = new EventObserver(handleHeartsChangedEvent);

        game.eventSubject.attach("coinsChanged", coinsChangedObserver);
        game.eventSubject.attach("heartsChanged", heartsChangedObserver);

        game.initialize();
        game.initGame();
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
                   <Coins coinsDisplayCount={coins}/>
                    <Hearts heartsDisplayCount={hearts}/>
                </div>
            </div>
        </>
    );
};

export default GamePage;
