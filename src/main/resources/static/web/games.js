let app = new Vue({
    el: "#app",
    mounted() {
        this.getDataFunction();

    },
    data: {
        gameData: [],
        gameScores: [],
        leaderBoard: [],
        emailInput: "",
        passwordInput: "",
        player: "null"
    },
    methods: {
        getDataFunction() {
            var url = "/api/games";

            fetch(url, {
                    mode: "cors",
                })
                .then(function (response) {
                    return response.json();
                })
                .then(function (gameJson) {

                    app.gameData = gameJson.games;
                    app.player = gameJson.player
                    app.getScores();
                    app.createTable();
                })
                .catch(function (error) {
                    console.log("error  " + error.message)
                })
        },

        getBody(user) {
            var body = [];
            for (var key in user) {
                var encKey = encodeURIComponent(key);
                var encVal = encodeURIComponent(user[key]);
                body.push(encKey + "=" + encVal);
            }
            return body.join("&");
        },

        login() {

            fetch("/api/login", {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    body: this.getBody({
                        username: this.emailInput,
                        password: this.passwordInput
                    })
                })
                .then(function (response) {
                    if (response.status >= 401) {
                        alert("Username or password invalid")
                    } else {
                        location.reload(true);
                    }
                })
                .catch(function (error) {
                    console.log('Request failure: ', error);
                });
        },

        signup() {
            fetch("/api/players", {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        userName: this.emailInput,
                        password: this.passwordInput
                    })
                })
                .then(function (response) {
                    console.log('Request success: ', response);


                }).then(function (data) {

                    console.log(data);
                    app.login()

                }).catch(function (error) {
                    console.log('Request failure: ', error);
                });

        },

        logout() {
            fetch("/api/logout", {
                    method: "POST",
                })
                .then(function (gameJson) {
                    console.log("Log out success")
                })
                .then(function () {
                    location.reload(true)
                })
                .catch(error => console.log(error))
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

            let sortedArray = pl.sort((a, b) => {
                var gamesA = a.win + a.lose + a.tie;
                var gamesB = b.win + b.lose + b.tie;

                return a.pts < b.pts ? 1 : a.pts > b.pts ? -1 : (gamesA > gamesB ? 1 : gamesA < gamesB ? -1 : 0)
            });
            app.leaderBoard = sortedArray;
        },
        //function to take the id of the current player that is login
        enterGame(gamePlayers) {

            for (var i = 0; i < gamePlayers.length; i++) {

                if (this.player.email === gamePlayers[i].player.email) {

                    this.getURL(gamePlayers[i].id);
                }
            }
        },
        //function that takes the id of the current player login and goes with the link to the game
        getURL(id) {

            window.location.href = "http://localhost:8080/web/game.html?gp=" + id;

        },

    }
})
