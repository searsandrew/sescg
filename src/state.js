export const state = {
    playerDeck: [],
    opponentDeck: [],
    planetDeck: [],
    activePlanets: [],
    playerPlanets: [],
    opponentPlanets: [],
    playerScore: 0,
    opponentScore: 0,
    selectedCard: null,
    opponentCard: null,
    swiper: null,
};

export const originalPlayerDeck = [
    { id: 1, name: 'Plasma Knight', power: 1 },
    { id: 2, name: 'Void Wyrm', power: 2 },
    { id: 3, name: 'Shield Drone', power: 3 },
    { id: 4, name: 'Nova Wolf', power: 4 },
    { id: 5, name: 'Graviton Witch', power: 5 },
    { id: 6, name: 'Solar Titan', power: 6 },
    { id: 7, name: 'Cryo Sniper', power: 7 },
    { id: 8, name: 'Nebula Fox', power: 8 },
    { id: 9, name: 'Storm Golem', power: 9 },
    { id: 10, name: 'Chrono Bug', power: 10 },
    { id: 11, name: 'Warden Hawk', power: 11 },
    { id: 12, name: 'Echo Priest', power: 12 },
    { id: 13, name: 'Spore Beast', power: 13 },
    { id: 14, name: 'Iron Caller', power: 14 },
    { id: 15, name: 'Blight Siren', power: 15 }
];

export const originalOpponentDeck = [
    { id: 1, name: 'Cyber Hydra', power: 1 },
    { id: 2, name: 'Photon Blade', power: 2 },
    { id: 3, name: 'Grim Sentinel', power: 3 },
    { id: 4, name: 'Abyss Stalker', power: 4 },
    { id: 5, name: 'Titan Core', power: 5 },
    { id: 6, name: 'Ironclad Moth', power: 6 },
    { id: 7, name: 'Solar Reaver', power: 7 },
    { id: 8, name: 'Solar Reaver', power: 8 },
    { id: 9, name: 'Solar Reaver', power: 9 },
    { id: 10, name: 'Solar Reaver', power: 10 },
    { id: 11, name: 'Solar Reaver', power: 11 },
    { id: 12, name: 'Solar Reaver', power: 12 },
    { id: 13, name: 'Solar Reaver', power: 13 },
    { id: 14, name: 'Solar Reaver', power: 14 },
    { id: 15, name: 'Solar Reaver', power: 15 }
];

export const originalPlanetDeck = [
    { id: 1, name: 'Orion Prime', type: 'Colony', value: 1 },
    { id: 2, name: 'Zeta Mine', type: 'Mining', value: 1 },
    { id: 3, name: 'Nova Research Hub', type: 'Scientific', value: 1 },
    { id: 4, name: 'Haven Outpost', type: 'Colony', value: 2 },
    { id: 5, name: 'Draconis Refinery', type: 'Mining', value: 2 },
    { id: 6, name: 'Celeste Observatory', type: 'Scientific', value: 2 },
    { id: 7, name: 'Pioneer Settlement', type: 'Colony', value: 3 },
    { id: 8, name: 'Aurora Vein', type: 'Mining', value: 3 },
    { id: 9, name: 'Sagan Labs', type: 'Scientific', value: 3 },
    { id: 10, name: 'Frontier Base', type: 'Colony', value: 1 },
    { id: 11, name: 'Voltrum Pit', type: 'Mining', value: 1 },
    { id: 12, name: 'Kepler Institute', type: 'Scientific', value: 1 },
    { id: 13, name: 'Eden Settlement', type: 'Colony', value: 2 },
    { id: 14, name: 'Lunar Quarry', type: 'Mining', value: 2 },
    { id: 15, name: 'Galileo Station', type: 'Scientific', value: 2 }
];

export function resetState() {
    Object.assign(state, {
        playerDeck: [...originalPlayerDeck],
        opponentDeck: [...originalOpponentDeck],
        planetDeck: [...originalPlanetDeck],
        activePlanets: [originalPlanetDeck[0]], // Start with first planet
        playerPlanets: [],
        opponentPlanets: [],
        playerScore: 0,
        opponentScore: 0,
        selectedCard: null,
        opponentCard: null,
    });
}
