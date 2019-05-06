let app = new Vue({
    el: "#app",
    mounted() {
        this.populateTable("table1");
        this.populateTable("table2");
        this.getID();
        this.getData();

    },

    data: {
        //variable to take the link
        url: new URL(window.location.href),
        gamePlayers: [],
        games: [],
        ships: [],
        gameDat: [],
        salvoOpponent: [],
        mySalvoes: [],
        shipLength: null,
        shipType: null,
        locations: [],
        types: null,
        origin_allIDs:[],
        testallIDs:[],
    },

    methods: {
        getData() {

            let url = "/api/game_view/" + this.gamePlayers;

            fetch(url, {
                    mode: "cors"
                })
                .then(function (response) {
                    return response.json()
                })
                .then(function (gameJson) {
                    //check the properties of gameJson, if there is an error
                    if (gameJson.hasOwnProperty("Error")) {
                        //error! you can't see other games
                        alert(gameJson.error);
                        //goes to page before 
                        history.go(-1);
                        //if not, caharge the object gameJson
                    } else {



                        app.gameDat = gameJson;

                        app.games = gameJson.game.GamePlayer;

                        app.ships = gameJson.game.Ships;

                        app.salvoOpponent = gameJson.game.opponentSalvoes;

                        app.mySalvoes = gameJson.game.mySalvoes;

                        app.gameVs();

                        app.printSalvoesOpponent();
                    }

                })
                .catch(error => console.log(error))
        },


        //method to send ships
        sendShips() {
            // " + this.gamePlayers + "  to obtain the id of the game player
            fetch("/api/games/players/" + this.gamePlayers + "/ships", {

                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                method: "POST",
                //some ships to send and try to put on the grid
                body: JSON.stringify([{
                        "type": "destroyer",
                        "locations": ["A1", "B1", "C1"]
                        },
                    {
                        "type": "patrol boat",
                        "locations": ["H5", "H6"]
                        },
                    {
                        "type": "patrol boat",
                        "locations": ["A5", "A6"]
                                      },
                    {
                        "type": "patrol boat",
                        "locations": ["E5", "E6"]
                                          },
                    {
                        "type": "submarine",
                        "locations": ["J1", "J2", "J3"]
                                      }

                                ])
            }).then(function (response) {
                return response.json();
            }).then(function (data) {

                console.log('Request success', data)

                return data.json();

            }).catch(function (error) {

                console.log('Request failure:', error)
            });

        },

        //function to take de gamePlayers ID
        getID() {

            var vars = {};
            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                vars = value;
                //Value + Key = vars[key]=....
            });

            this.gamePlayers = vars;
        },
        //funtion to crate the grid
        populateTable(tablesHTML) {


            const column = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
            const tables = document.getElementById(tablesHTML);
            const table = document.createElement("table");
            const tbody = document.createElement("tbody");

            //the element above will be use later

            table.appendChild(tbody);

            //bind the tbody  to the table element, the tbody will be then build with the 2 loops below

            for (var i = 0; i < 11; i++) {


                var tr = document.createElement("tr");

                tbody.appendChild(tr);

                //bind the tr element to the tbody, the tr will be built below:

                for (var j = 0; j < 11; j++) {

                    var td = document.createElement("td");
                    //add on all the cell the property empty-cell, 
                    td.classList.add('empty-cell');

                    if (i == 0 && j > 0) {
                        td.textContent = j;
                    } //this will add the content of the first column(the letter)

                    if (i > 0 && j == 0) {
                        td.textContent = column[i];
                    } //this will add the content of the first row(the numbers)
                    //this will add an ID to match each cell (eg: cell A1 will have the ID="A1" )
                    td.setAttribute("id", column[i] + j + tablesHTML);

                    tr.appendChild(td);
                    //this bind the builded cells to the rows, whichare themselves built at the first loop

                }
            }
            tables.appendChild(table);

            //td bind to  tr
            // tr bind to tbody
            //tbody bind to table
            // and now, we are pushing the table to the body , which is the ID of the div in HTMl page
        },

        gameVs() {



            let playersGameId = document.getElementById("playersGame");

            if (this.gameDat.game.GamePlayer.length == 1) {


                let playerOne = this.gameDat.game.GamePlayer[0].player.email;


                playersGameId.textContent = playerOne + " VS Waiting for a opponent "

            } else {

                let playerOne = this.gameDat.game.GamePlayer[0].player.email;
                let playerTwo = this.gameDat.game.GamePlayer[1].player.email;

                if (this.gameDat.game.GamePlayer[0].id == this.gamePlayers) {

                    playersGameId.textContent = playerOne + " (YOU) vs " + playerTwo;

                } else {

                    playersGameId.textContent = playerTwo + " (YOU) vs " + playerOne;

                }

            }

        },

        printSalvoesOpponent() {


            var shipLocationArray = [];


            for (var s = 0; s < this.mySalvoes.length; s++) {

                var mySalvoLocation = this.mySalvoes[s].Location;

                var mySalvoTurn = this.mySalvoes[s].Turn;


                for (var l = 0; l < mySalvoLocation.length; l++) {

                    document.getElementById(mySalvoLocation[l] + "table2").style.backgroundColor = 'yellow'

                    document.getElementById(mySalvoLocation[l] + "table2").innerHTML = mySalvoTurn;
                }

            }
            //print ships on the grid


            for (var i = 0; i < this.ships.length; i++) {


                this.locations = this.ships[i].Location;
                this.types = this.ships[i].Type;

                for (var j = 0; j < this.locations.length; j++) {


                    document.getElementById(this.locations[j] + "table1").classList.add('ship-color');
                    document.getElementById(this.locations[j] + "table1").setAttribute('data-shiptype', this.types);
                    document.getElementById(this.locations[j] + "table1").setAttribute('data-shiplength', this.locations.length);


                    //put draggable attribute to the ships

                    if (j == 0) {
                        document.getElementById(this.locations[j] + "table1").setAttribute('draggable', 'true');
                    }

                    if (document.getElementById(this.locations[j] + "table1").classList.contains('ship-color')) {

                        document.getElementById(this.locations[j] + "table1").classList.remove('empty-cell');
                    }

                    let empties = document.getElementsByClassName('empty-cell');
                    let filled = document.getElementsByClassName('ship-color');


                    for (let fill of filled) {

                        fill.addEventListener("dragstart", this.dragStart);
                        fill.addEventListener("dragend", this.dragEnd);
                    }

                    for (let empty of empties) {
                        empty.addEventListener("dragover", this.dragOver);
                        empty.addEventListener("dragenter", this.dragEnter);
                        empty.addEventListener("dragleave", this.dragLeave);
                        empty.addEventListener("drop", this.dragDrop);
                    }


                    shipLocationArray.push(this.locations[j]);

                }

            }

    //            for (var i = 0; i < this.salvoOpponent.length; i++) {
    //
    //
    //                var salvoLocations = this.salvoOpponent[i].Location;
    //
    //                var salvoTurnOpp = this.salvoOpponent[i].Turn;
    //
    //                for (var j = 0; j < salvoLocations.length; j++) {
    //
    //                    document.getElementById(salvoLocations[j] + "table1").style.backgroundColor = 'yellow'
    //                    document.getElementById(salvoLocations[j] + "table1").innerHTML = salvoTurnOpp;
    //
    //
    //                    for (var x = 0; x < shipLocationArray.length; x++) {
    //
    //                        if (salvoLocations[j].includes(shipLocationArray[x])) {
    //
    //                            document.getElementById(salvoLocations[j] + "table1").style.backgroundColor = 'red'
    //
    //                        }
    //                    }
    //                }
    //            }

        },

        dragStart(e) {

            console.log("START", e.target.id);
            //capture the horizontal letter and number 
            let letter = e.target.id.split("")[0];
            let number = Number(e.target.id.split("")[1]);
            
            console.log("putain")


            console.log(letter);
            console.log(number);

            this.shipLength = document.getElementById(e.target.id).getAttribute('data-shiplength');
            this.shipType = document.getElementById(e.target.id).getAttribute('data-shiptype');

            // create a variable to save the IDs of the horizontal ships (example:H5 , H6 )


            for (let i = 0; i < this.shipLength; i++) {

                let newID = letter + (Number(number) + i);

                this.origin_allIDs.push(newID);


            }
            //disabled all this attributes when drag finish 
            
            console.log("test123")

            console.log(this.origin_allIDs);

            for (let i = 0; i < this.origin_allIDs.length; i++) {

                document.getElementById(this.origin_allIDs[i] + "table1").classList.remove('ship-color');
                document.getElementById(this.origin_allIDs[i] + "table1").removeAttribute('draggable');
                document.getElementById(this.origin_allIDs[i] + "table1").classList.add('empty-cell');
                document.getElementById(this.origin_allIDs[i] + "table1").removeAttribute('data-shiplength');
                document.getElementById(this.origin_allIDs[i] + "table1").removeAttribute('data-shiptype');

            }


        },

        dragEnter(e) {
            e.preventDefault();
            console.log("ENTER", e.target.id);
            

        },

        dragOver(e) {
            //dragOver is necessary otherwise the ship goes back to its original place
            e.preventDefault();
            console.log("OVER", e.target.id);
        },

        dragLeave(e) {
            console.log("LEAVE", e.target.id);
            let letter = e.target.id.split("")[0]
            let number = Number(e.target.id.split("")[1])

        },

        dragDrop(e) {

            console.log("DROP", e.target.id);


            let letter = e.target.id.split("")[0]
            let number = Number(e.target.id.split("")[1])
            
            let allIDs = app.testallIDs;
            
            console.log("testabc")
           
            let types = this.ships;

            //en esta variable pondremos los IDs de destino donde dejaremos el barco
           
            for (let i = 0; i < this.shipLength; i++) {
                let newID = letter + (Number(number) + i)
                allIDs.push(newID);
            }
            
            console.log(allIDs)


            // si cuando dejamos el barco hay celdas vacías lo pintamos con los valores da la variable local AllIds
            for (let i = 0; i < allIDs.length; i++) {

                if (document.getElementById(allIDs[i] + "table1").classList.contains("empty-cell")) {

                    console.log('hola de primer if');

                    document.getElementById(allIDs[i] + "table1").classList.add('ship-color')
                    document.getElementById(allIDs[i] + "table1").classList.remove('empty-cell')
                    document.getElementById(allIDs[0] + "table1").setAttribute("draggable", "true");
                    document.getElementById(allIDs[i] + "table1").setAttribute("data-shiplength", this.shipLength);
                    document.getElementById(allIDs[i] + "table1").setAttribute("data-shiptype", this.shipType);
                    document.getElementById(allIDs[0] + "table1").addEventListener("dragstart", this.dragStart)
                    //ponemos Ids del barco original a 0
                    this.origin_allIDs = [];
                    
                    app.testallIDs = [];
                    
                    
                

                    //Caso contrario, hay un barco pintado tomamos el valor de la variable global origin_AllIds del barco original pintado    

                } else {


                    console.log('hola des de else');

                    console.log(this.origin_allIDs);

                    for (let i = 0; i < this.origin_allIDs.length; i++) {

                        document.getElementById(this.origin_allIDs[i] + "table1").classList.add('ship-color');
                        document.getElementById(this.origin_allIDs[i] + "table1").classList.remove('empty-cell')
                        document.getElementById(this.origin_allIDs[0] + "table1").setAttribute("draggable", "true");
                        document.getElementById(this.origin_allIDs[i] + "table1").getAttribute("data-shiplength");
                        document.getElementById(this.origin_allIDs[i] + "table1").getAttribute("data-shiptype");
                        document.getElementById(this.origin_allIDs[i] + "table1").addEventListener("dragstart", this.dragStart)
                    }
                    //ponemos Ids del barco original a 0
                    this.origin_allIDs = [];

                    // Alertamos con libreria alertify de que esta accion no esta permitida

                    alertify.alert('Alert!', 'You can not overlap your ships!', function () {

                    });

                }

                
            }

        },

        dragEnd(e) {

            console.log("END", e.target.id);

        },

    }

})
