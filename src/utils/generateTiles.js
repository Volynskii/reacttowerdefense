import React from 'react';
import placementTilesData from "../mocks/placementTilesData";
import PlacementTile from "../classes/PlacementTile";

const GenerateTiles = (ctx) => {

    const placementTilesData2D = [];
    for (let i = 0; i < placementTilesData.length; i += 20) {
        placementTilesData2D.push(placementTilesData.slice(i, i + 20));
    }

    const placementTiles = [];
    placementTilesData2D.forEach((row, y) => {
        row.forEach((symbol, x) => {
            if (symbol === 14) {
                placementTiles.push(
                    new PlacementTile({
                        position: {
                            x: x * 64,
                            y: y * 64,
                        },
                        c: ctx, // Pass the canvas context here
                    })
                );
            }
        });
    });

    return {
        placementTiles
    }
};

export default GenerateTiles;