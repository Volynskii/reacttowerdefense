import React from 'react';
import myImage from "../img/gameMap.png";

const GenerateMap = (width, height) => {
    const image = new Image();
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    image.src = myImage;

    return {
        image,
        canvas,
        ctx
    }
};

export default GenerateMap;