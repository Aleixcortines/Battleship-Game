let app = new Vue({
    el: "#app",
    mounted() {
        this.getDataFunction();

    },
    data: {
        gameData: [],
        gameScores: [],
        leaderBoard: []

    },
    methods: {
        getDataFunction() {
            var url = "http://localhost:8080/api/games";

            fetch(url, {
                    mode: "cors",
                })
                .then(function (response) {
                    return response.json();
                })
                .then(function (gameJson) {
                    app.gameData = gameJson;
                    app.getScores();
                    app.createTable();
                })
        },

        //function to get players and scores and push on gameScores
        getScores() {

            let games = app.gameData;

            for (let i = 0; i < games.length; i++) {
                let sc = games[i].scores;
                this.gameScores.push(sc);

            }
        },
        createTable() {
            let players = this.gameScores;
            //unique player's name
            let filtered = [];
            //each match score
            let playerScores = [];
            //filtered players with their score
            let pl = [];

            for (let i = 0; i < players.length; i++) {
                players[i].map(score => {
                    playerScores.push(score)
                    if (!filtered.includes(score.player)) {
                        filtered.push(score.player)
                        pl.push({
                            name: score.player,
                            win: 0,
                            lose: 0,
                            tie: 0,
                            pts: 0,
                        })
                    }
                })
            }
            
            console.log(pl);

            for (let i = 0; i < filtered.length; i++) {
                for (let j = 0; j < playerScores.length; j++) {
                    if (filtered[i] == playerScores[j].player) {

                        pl[i].pts += playerScores[j].score;

                        switch (playerScores[j].score) {
                            case 1.0:
                                pl[i].win++
                                break;
                            case 0.5:
                                pl[i].tie++
                                break;
                            case 0.0:
                                pl[i].lose++
                                break;
                        }
                    }
                }
            }
            
            
            let sortedArray = pl.sort((a, b) => a.pts < b.pts ? 1 : a.pts > b.pts ? -1 : 0);
            app.leaderBoard = sortedArray;
        }

    }
})
