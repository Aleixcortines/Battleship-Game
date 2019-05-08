let app = new Vue({
    el: "#app",
    mounted() {
        this.populateTable("tableA");
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
        isVertical: false,
        locations: [],
        types: "",
        origin_allIDs: [],
        shipCurrentLoc: [],
        shipType: "",

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

                        app.showShips();

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
                        "type": "PatrolBoat",
                        "locations": ["H5", "H6"]
                        },
                    {
                        "type": "carrier",
                        "locations": ["A5", "A6"]
                                      },
                    {
                        "type": "battleship",
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

            for (var s = 0; s < this.mySalvoes.length; s++) {

                var mySalvoLocation = this.mySalvoes[s].Location;

                var mySalvoTurn = this.mySalvoes[s].Turn;


                for (var l = 0; l < mySalvoLocation.length; l++) {

                    document.getElementById(mySalvoLocation[l] + "table2").style.backgroundColor = 'yellow'

                    document.getElementById(mySalvoLocation[l] + "table2").innerHTML = mySalvoTurn;
                }

            }


            for (var i = 0; i < this.salvoOpponent.length; i++) {


                var salvoLocations = this.salvoOpponent[i].Location;

                var salvoTurnOpp = this.salvoOpponent[i].Turn;

                for (var j = 0; j < salvoLocations.length; j++) {

                    document.getElementById(salvoLocations[j] + "tableA").style.backgroundColor = 'yellow'
                    document.getElementById(salvoLocations[j] + "tableA").innerHTML = salvoTurnOpp;


                    for (var x = 0; x < shipLocationArray.length; x++) {

                        if (salvoLocations[j].includes(shipLocationArray[x])) {

                            document.getElementById(salvoLocations[j] + "tableA").style.backgroundColor = 'red'

                        }
                    }
                }
            }

        },

        showShips() {


            var shipLocationArray = [];

            let ships = app.ships;

            for (var i = 0; i < ships.length; i++) {

                let locations = ships[i].Location;
                let types = ships[i].Type;

                for (var j = 0; j < locations.length; j++) {


                    document.getElementById(locations[j] + "tableA").classList.add('ship-color');
                    document.getElementById(locations[j] + "tableA").setAttribute('data-shiptype', types);
                    document.getElementById(locations[j] + "tableA").classList.add(types);
                    document.getElementById(locations[j] + "tableA").setAttribute('data-shiplength', locations.length);
                    document.getElementById(locations[j] + "tableA").setAttribute('data-shipLocs', locations);


                    //put draggable attribute to the ships

                    if (j == 0) {
                        document.getElementById(locations[j] + "tableA").setAttribute('draggable', 'true');
                    }

                    if (document.getElementById(locations[j] + "tableA").classList.contains('ship-color')) {

                        document.getElementById(locations[j] + "tableA").classList.remove('empty-cell');
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


                    shipLocationArray.push(locations[j]);

                }

            }
        },

        dragStart(e) {

            console.log("START", e.target.id);
            //capture the horizontal letter and number 
            let shipCellID = e.target.id;
            let letter = shipCellID.split("")[0];
            //let number = Number(e.target.id.split("")[1]);
            
            let numberbis = shipCellID.split("");
            let numbertris = (letter + "tableA").split("");
           
          for (let x = 0; x < numberbis.length; x++) {
               for (let c = 0; c < numbertris.length; c++) {
                    if (numberbis[x] == numbertris[c]) {
                        numberbis.splice(x, 1);
                    }
                }
            }
            let numberquis = numberbis.join("");


            app.shipLength = document.getElementById(e.target.id).getAttribute('data-shiplength');
            app.shipType = document.getElementById(e.target.id).getAttribute('data-shiptype');
            //in this variable I capture the current location of the ship when the user drag
            app.shipCurrentLoc = document.getElementById(e.target.id).getAttribute("data-shipLocs");

            let boatLoc = [];
            let getShipType = document.getElementsByClassName(app.shipType);

            //llenamos en array boatloc las localizaciones del barco de origen, p.e A5tableA
            for (let i = 0; i < getShipType.length; i++) {
                boatLoc.push(getShipType[i].id)
            }

            //check if vertical
            //miramos si la letra de la primera y segunda posicion del arrayboatLoc es igual o no
            //si no lo es, quiere decir que es vertial
            if (boatLoc[0][0] !== boatLoc[1][0]) {
                app.isVertical = true;
            } else {
                //si es igual quiere decir que es horizontal
                app.isVertical = false;
            }

            //Con el condicional, guardamos posision origen en variable origin_allIDs, los IDs dependiendo de si es barco horizontal o vertical
            if (app.isVertical == false) {
                for (let i = 0; i < app.shipLength; i++) {

                    let newID = letter + (Number(numberquis) + i);

                    app.origin_allIDs.push(newID);

                }

            } else {
                for (let i = 0; i < app.shipLength; i++) {
                    const letters = "ABCDEFGHIJ";
                    const newLetters = letters.split("");

                    for (let y = 0; y < newLetters.length; y++) {
                        if (e.target.id[0] == newLetters[y]) {
                            let newID = newLetters[y + i] + (Number(numberquis));
                            app.origin_allIDs.push(newID);
                        }
                    }
                }
            }

            console.log(app.origin_allIDs);

            //disabled all this attributes when drag finish 

            for (let i = 0; i < app.origin_allIDs.length; i++) {

                document.getElementById(app.origin_allIDs[i] + "tableA").classList.remove('ship-color');
                document.getElementById(app.origin_allIDs[0] + "tableA").removeAttribute('draggable');
                document.getElementById(app.origin_allIDs[i] + "tableA").removeAttribute('data-shiplength');
                document.getElementById(app.origin_allIDs[i] + "tableA").removeAttribute('data-shiptype');
                document.getElementById(app.origin_allIDs[i] + "tableA").removeAttribute('data-shipLocs');
                document.getElementById(app.origin_allIDs[i] + "tableA").classList.add('empty-cell');

            }

        },


        dragEnter(e) {
            e.preventDefault();
            console.log("ENTER", e.target.id);


            //capture the horizontal letter and number 
            let letter = e.target.id.split("")[0];
            let number = Number(e.target.id.split("")[1]);

            let newIDs = [];

            //check if vertical

            if (app.isVertical == false) {
                for (let i = 0; i < this.shipLength; i++) {

                    let newID = letter + (Number(number) + i);

                    newIDs.push(newID);


                }
            } else {
                for (let i = 0; i < this.shipLength; i++) {
                    const letters = "ABCDEFGHIJ";
                    const newLetters = letters.split("");

                    for (let y = 0; y < newLetters.length; y++) {
                        if (e.target.id[0] == newLetters[y]) {
                            let newID = newLetters[y + i] + (Number(number));
                            newIDs.push(newID);
                        }
                    }
                }

            }

            console.log(newIDs);
            //conditional to check if you are out of the grid


        },

        dragOver(e) {
            //dragOver is necessary otherwise the ship goes back to its original place
            e.preventDefault();
            console.log("OVER", e.target.id);

            let shipCellID = e.target.id;
            let letter = shipCellID.split("")[0]
            let number = Number(shipCellID.split("")[1])

            let newIDs = []

            if (app.isVertical == false) {
                for (let i = 0; i < this.shipLength; i++) {

                    let newID = letter + (Number(number) + i);

                    newIDs.push(newID);


                }
            } else {
                for (let i = 0; i < this.shipLength; i++) {
                    const letters = "ABCDEFGHIJ";
                    const newLetters = letters.split("");

                    for (let y = 0; y < newLetters.length; y++) {
                        if (e.target.id[0] == newLetters[y]) {
                            let newID = newLetters[y + i] + (Number(number));
                            newIDs.push(newID);
                        }
                    }
                }

            }


        },

        dragLeave(e) {
            console.log("LEAVE", e.target.id);
            let letter = e.target.id.split("")[0]
            let number = Number(e.target.id.split("")[1])

            let newIDs = []

            for (let i = 0; i < this.shipLength; i++) {
                let newID = letter + (Number(number) + i);
                newIDs.push(newID)
            }

            if (app.fullCell == false) {
                for (let i = 0; i < newIDs.length; i++) {
                    if (document.getElementById(newIDs[i]) == null) {
                        app.outOfGrid = true;



                    } else if (!document.getElementById(newIDs[i]).classList.contains("ship-color")) {
                        document.getElementById(newIDs[i] + "tableA").classList.remove("ship-color");
                        document.getElementById(newIDs[i] + "tableA").classList.remove(app.shipType);
                        document.getElementById(newIDs[i] + "tableA").removeAttribute("draggable");
                        document.getElementById(newIDs[i] + "tableA").removeAttribute("data-shipLength");
                        document.getElementById(newIDs[i] + "tableA").removeAttribute("data-shipType");
                        document.getElementById(newIDs[i] + "tableA").removeAttribute("data-shipLocs");
                        document.getElementById(newIDs[i] + "tableA").classList.add("empty-cell");
                    }
                }
            }


        },

        dragDrop(e) {

            console.log("DROP", e.target.id);

            //variable to capture the cell id
            let shipCellID = e.target.id;


            let letter = shipCellID.split("")[0]
            //            let number = Number(shipCellID.split("")[1])


            //this allow to use 10 as a number :
            let numberbis = shipCellID.split("");
            let numbertris = (letter + "tableA").split("");
            //
            for (let x = 0; x < numberbis.length; x++) {
                for (let c = 0; c < numbertris.length; c++) {
                    if (numberbis[x] == numbertris[c]) {
                        numberbis.splice(x, 1);
                    }
                }
            }
            let numberquis = numberbis.join("");

            let newAllIDs = [];

            let types = app.ships;


            if (app.isVertical == false) {
                for (let i = 0; i < app.shipLength; i++) {

                    let newID = letter + (Number(numberquis) + i)
                    newAllIDs.push(newID)
                }
            } else {
                for (let i = 0; i < app.shipLength; i++) {
                    const letters = "ABCDEFGHIJ";
                    const newLetters = letters.split("");

                    for (let y = 0; y < newLetters.length; y++) {
                        if (e.target.id[0] == newLetters[y]) {
                            let newID = newLetters[y + i] + (Number(numberquis));
                            newAllIDs.push(newID);
                        }
                    }
                }
            }

            //en esta variable pondremos los IDs de destino donde dejaremos el barco

            //here we prevent the ship to collide inside the grid
//            let locsOutGrid = [];
//            let allCellsClear = [];
//
//            for (let a = 0; a < newAllIDs.length; a++) {
//
//                locsOutGrid.push(document.getElementById(newAllIDs[a] + "tableA"));
//            
//                      }
//            
//            console.log(locsOutGrid)
            
            //           if(!locsOutGrid.includes(null)) {
            //           for (let y = 0; y < locsOutGrid.length; y++){
            //
            //                   if(locsOutGrid[y].classList.contains("empty") == true)
            //                   {  allCellsClear.push(true)}
            //                   else
            //                   { allCellsClear.push(false)}
            //           }
            //       }
            //
            //
            //       if (locsOutGrid.includes(null) || allCellsClear.includes(false)) {
            //
            //          console.log("1")
            //           salvo.refillGrid(startingPoint)
            //          console.log(startingPoint)
            //
            //       } else {
            //          console.log("2")
            //           salvo.refillGrid(salvo.newAllIDs);
            //       }


            for (let j = 0; j < app.origin_allIDs.length; j++) {



                document.getElementById(app.origin_allIDs[j] + "tableA").classList.remove('ship-color');
                document.getElementById(app.origin_allIDs[j] + "tableA").classList.remove(app.shipType);
                document.getElementById(app.origin_allIDs[j] + "tableA").classList.add('empty-cell');
                document.getElementById(app.origin_allIDs[0] + "tableA").removeAttribute("draggable", "true");
                document.getElementById(app.origin_allIDs[j] + "tableA").removeAttribute("data-shiptype", app.shipType);
                document.getElementById(app.origin_allIDs[j] + "tableA").removeAttribute("data-shiplength", app.origin_allIDs.length);
                document.getElementById(app.origin_allIDs[j] + "tableA").removeAttribute('data-shipLocs', app.shipCurrentLoc);

                /* Listener to call dragstat and star the D & D */
                document.getElementById(app.origin_allIDs[0] + "tableA").addEventListener("dragstart", this.dragStart);
            }


            /* ponemos Ids del barco original a 0 */
            app.origin_allIDs = [];


            for (let i = 0; i < newAllIDs.length; i++) {

                document.getElementById(newAllIDs[i] + "tableA").classList.add('ship-color');
                document.getElementById(newAllIDs[i] + "tableA").classList.add(app.shipType);
                document.getElementById(newAllIDs[i] + "tableA").classList.remove('empty-cell')
                document.getElementById(newAllIDs[0] + "tableA").setAttribute("draggable", "true");
                //document.getElementById(newAllIDs[i] + "tableA").setAttribute("data-shiptype");
                document.getElementById(newAllIDs[i] + "tableA").setAttribute("data-shiptype", app.shipType);
                document.getElementById(newAllIDs[i] + "tableA").setAttribute("data-shipLocs", newAllIDs);
                document.getElementById(newAllIDs[i] + "tableA").addEventListener("dragstart", this.dragStart);
                document.getElementById(newAllIDs[i] + "tableA").setAttribute("data-shiplength", newAllIDs.length);

            }


            //ponemos Ids del barco original a 0
            this.origin_allIDs = [];

            // Alertamos con libreria alertify de que esta accion no esta permitida

            //                    alertify.alert('Alert!', 'You can not overlap your ships!', function () {
            //
            //                    });

            //                }


            //            }

        },

        dragEnd(e) {

            console.log("END", e.target.id);

        },

    }


})
