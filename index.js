const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

let players = JSON.parse(fs.readFileSync('players.json', 'utf8'));
// READ
app.get('/players', (req, res) => {
    res.json(players);
});

// READ by ID
app.get('/players/:id', (req, res) => {
    const playerId = parseInt(req.params.id);
    const player = players.find(p => p.id === playerId);

    if (player) {
        res.json(player);
    } else {
        res.status(404).send('Player not found');
    }
});

// READ players by team ID
app.get('/players/team/:idEquipe', (req, res) => {
    const teamId = parseInt(req.params.idEquipe);
    const teamPlayers = players.filter(p => p.idEquipe === teamId);

    if (teamPlayers.length > 0) {
        res.json(teamPlayers);
    } else {
        res.status(404).send('No players found for the team');
    }
});

// SEARCH by name
app.get('/players/search/:nom', (req, res) => {
    const playerName = req.params.nom;
    const player = players.find(p => p.nom === playerName);

    if (player) {
        res.json(player);
    } else {
        res.status(404).send('Player not found');
    }
});

// CREATE
app.post('/players', (req, res) => {
    players.push(req.body);
    fs.writeFileSync('players.json', JSON.stringify(players));
    res.status(201).json(req.body);
});

// UPDATE
app.put('/players/:id', (req, res) => {
    const playerId = parseInt(req.params.id);
    const playerIndex = players.findIndex(p => p.id === playerId);

    if (playerIndex > -1) {
        players[playerIndex] = req.body;
        fs.writeFileSync('players.json', JSON.stringify(players));
        res.json(req.body);
    } else {
        res.status(404).send('Player not found');
    }
});

// DELETE
app.delete('/players/:id', (req, res) => {
    const playerId = parseInt(req.params.id);
    const playerIndex = players.findIndex(p => p.id === playerId);

    if (playerIndex > -1) {
        players.splice(playerIndex, 1);
        fs.writeFileSync('players.json', JSON.stringify(players));
        res.status(204).send();
    } else {
        res.status(404).send('Player not found');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

