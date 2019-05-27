let app = new Vue({
    el: "#app",
    mounted() {
        this.populateTable("tableA");
        this.populateTable("tableB");
        this.getID();
        this.getData();

    },

    data: {
        //variable to take the link
        url: new URL(window.location.href),
        gamePlayers: [],
        games: [],
        gameDat: [],
        salvoOpponent: [],
        mySalvoes: [],
        salvoLocations:[],
        shipLength: null,
        isVertical: false,
        shipLocs: [],
        types: "",
        origin_allIDs: [],
        newAllIDs: [],
        shipCurrentLoc: [],
        shipType: "",
        occurence: 0,
        allowDragging: true,
        hasBeenDone: false,
        ships: [{
                "type": "Carrier",
                "locations": ["A5", "B5", "C5", "D5", "E5"]
            },
            {
                "type": "Submarine",
                "locations": ["D1", "E1", "F1"]
            },
            {
                "type": "Battleship",
                "locations": ["G3", "G4", "G5", "G6"]
            },
            {
                "type": "Destroyer",
                "locations": ["C8", "C9", "C10"]
            },
            {
                "type": "PatrolBoat",
                "locations": ["I5", "I6"]
            }],

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


                        if (gameJson.game.Ships.length != 0) {
                            app.allowDragging = false;
                            app.ships = gameJson.game.Ships;
                        }

                        app.showShips();

                        app.salvoOpponent = gameJson.game.opponentSalvos;

                        console.log(gameJson.game)

                        app.mySalvoes = gameJson.game.mySalvos;

                        app.gameVs();

                        app.printSalvoesOpponent();


                    }

                })
                .catch(error => console.log(error))
        },

        //method to send the ships on the back end to save
        sendShips() {

            let newLocations = app.ships;

            // " + this.gamePlayers + "  to obtain the id of the game player
            fetch("/api/games/players/" + this.gamePlayers + "/ships", {

                method: "POST",
                cache: 'default',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(newLocations)

            }).then(function (response) {

                return response.json();
            }).then(function (gameJson) {

                if (gameJson.hasOwnProperty('error')) {
                    alert(gameJson.error)
                } else {
                    
                    window.location.reload(true)

                }

            }).catch(function (error) {


                console.log('Request failure:', error)
            });



        },
        //method to send the ships on the back end to save
        sendSalvoes(){

            let salvoes = document.getElementsByClassName("mysalvo");

            //first, we will put only the salvos locations in array

        for (let i = 0; i<salvoes.length;i++ ){
            
            this.salvoLocations.push(salvoes[i].getAttribute("id").slice(0,2))
            }
            console.log(this.salvoLocations);

            //then, make the fetch to send the salvolocations on the back end

            fetch("/api/games/players/" + this.gamePlayers + "/salvos", {

                method: "POST",
                cache: 'default',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(this.salvoLocations)

            }).then(function (response) {

                return response.json();
            }).then(function (gameJson) {

                if (gameJson.hasOwnProperty('error')) {
                    alert(gameJson.error)
                } else {
                    
                    window.location.reload(true)

                }

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


        //funtion to crate the grids
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

                    //add the event click on table B to goes on markerSalvoes function (to mark my salvoes)
                    if (tablesHTML == "tableB") {

                        td.addEventListener('click', this.markerSalvoes);
                       /*  td.setAttribute("onmouseover", this.checkMouseover);
                        td.setAttribute("onmouseout",this.checkMouseout);  */   
                    }

                    if (i == 0 && j > 0) {
                        td.textContent = j;
                    } //this will add the content of the first column(the letter)

                    if (i > 0 && j == 0) {
                        td.textContent = column[i];
                    }
                    //Create the cells outside the grid, letters and numbers
                    if (i == 0 || j == 0) {
                        //add the class  outbound to check if the ship is placed out of the grid
                        td.setAttribute("class", "outbound")
                    }
                    //this will add the content of the first row(the numbers)
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

                let mysalvos = app.mySalvoes;

                let salvosOp = app.salvoOpponent;

                for (let s = 0; s < mysalvos.length; s++) {

                    let mySalvoLocation = mysalvos[s].locations;

                    let mySalvoTurn = mysalvos[s].turn;


                    for (let l = 0; l < mySalvoLocation.length; l++) {

                        //S'ha de fer ---> remove empty cell

                        document.getElementById(mySalvoLocation[l] + "tableB").classList.add('shot');

                        document.getElementById(mySalvoLocation[l] + "tableB").innerHTML = mySalvoTurn;
                    }
                }

                for (let i = 0; i < salvosOp.length; i++) {


                    let salvoLocations = salvosOp[i].Location;

                    let salvoTurnOpp = salvosOp[i].Turn;

                    for (var j = 0; j < salvoLocations.length; j++) {

                        document.getElementById(salvoLocations[j] + "tableA").classList.add('shot');
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

                let shipsArray = app.ships;



                for (var i = 0; i < shipsArray.length; i++) {

                    let locs = shipsArray[i].locations;
                    let types = shipsArray[i].type;


                    for (var j = 0; j < locs.length; j++) {


                        document.getElementById(locs[j] + "tableA").classList.add('ship-color');
                        document.getElementById(locs[j] + "tableA").setAttribute('data-shiptype', types);
                        document.getElementById(locs[j] + "tableA").classList.add(types);
                        document.getElementById(locs[j] + "tableA").setAttribute('data-shiplength', locs.length);
                        document.getElementById(locs[j] + "tableA").setAttribute('data-shipLocs', locs);


                        //put draggable attribute to all the grid

                        if (j == 0 && app.allowDragging) {
                            document.getElementById(locs[j] + "tableA").setAttribute('draggable', 'true');
                        }

                        if (document.getElementById(locs[j] + "tableA").classList.contains('ship-color')) {

                            document.getElementById(locs[j] + "tableA").classList.remove('empty-cell');
                        }

                        let empties = document.getElementsByClassName('empty-cell');
                        let filled = document.getElementsByClassName('ship-color');
                        let outbound = document.getElementsByClassName('outbound');

                        if (app.allowDragging) {
                            document.getElementById(locs[0] + "tableA").classList.add('switchOrientation');
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

                            for (let outbounds of outbound) {
                                outbounds.addEventListener("dragover", this.dragOver);
                                outbounds.addEventListener("dragenter", this.dragEnter);
                            }

                        }
                        shipLocationArray.push(locs[j]);

                    }

                }

                app.addSwitchOrientation();

            },

            dragStart(e) {

                app.occurence = 0;
                app.hasBeenDone = false;

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


                //disabled all this attributes when drag finish 

                for (let i = 0; i < app.origin_allIDs.length; i++) {

                    document.getElementById(app.origin_allIDs[i] + "tableA").classList.remove('ship-color');
                    document.getElementById(app.origin_allIDs[0] + "tableA").classList.remove('switchOrientation');
                    document.getElementById(app.origin_allIDs[0] + "tableA").removeEventListener('click', this.switchOrientation);
                    document.getElementById(app.origin_allIDs[0] + "tableA").innerHTML = "";
                    document.getElementById(app.origin_allIDs[0] + "tableA").removeAttribute('draggable');
                    document.getElementById(app.origin_allIDs[i] + "tableA").removeAttribute('data-shiplength');
                    document.getElementById(app.origin_allIDs[i] + "tableA").removeAttribute('data-shiptype');
                    document.getElementById(app.origin_allIDs[i] + "tableA").removeAttribute('data-shipLocs');
                    document.getElementById(app.origin_allIDs[i] + "tableA").classList.add('empty-cell');

                }

            },


            dragEnter(e) {

                // capture the horizontal letter and number 
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

                e.preventDefault();
                console.log("ENTER", e.target.id);

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

            let outbound = e.target.getAttribute("class");

            console.log(outbound)

            if (outbound == "outbound" || outbound == "container") {

                console.log("1")
                console.log(app.hasBeenDone)

                if (app.hasBeenDone == false && app.occurence < 1) {

                    console.log("2")
                    console.log(outbound)
                    app.makeShips(app.origin_allIDs);


                    // Alert with alertify action that this action is not allowed

                    alertify.alert("ALERT", "Don't go outside the grid!");

                    app.occurence++;
                    app.hasBeenDone = true
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
                        document.getElementById(newIDs[i] + "tableA").classList.remove('switchOrientation');
                        document.getElementById(newIDs[0] + "tableA").removeEventListener('click', this.switchOrientation);
                        document.getElementById(newIDs[0] + "tableA").innerHTML = "";
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
            //let newAllIDs = [];
            let types = app.ships;


            if (app.isVertical == false) {
                for (let i = 0; i < app.shipLength; i++) {

                    let newID = letter + (Number(numberquis) + i)
                    app.newAllIDs.push(newID)
                }
            } else {
                for (let i = 0; i < app.shipLength; i++) {
                    const letters = "ABCDEFGHIJ";
                    const newLetters = letters.split("");

                    for (let y = 0; y < newLetters.length; y++) {
                        if (e.target.id[0] == newLetters[y]) {
                            let newID = newLetters[y + i] + (Number(numberquis));
                            app.newAllIDs.push(newID);
                        }
                    }
                }
            }

            let locsOutGrid = [];
            let allCellsClear = [];

            for (let a = 0; a < app.newAllIDs.length; a++) {

                locsOutGrid.push(document.getElementById(app.newAllIDs[a] + "tableA"));
            }


            if (!locsOutGrid.includes(null)) {
                for (let y = 0; y < locsOutGrid.length; y++) {

                    if (locsOutGrid[y].classList.contains("empty-cell") == true) {
                        allCellsClear.push(true)
                    } else {
                        allCellsClear.push(false)
                    }
                }
            }


            if (allCellsClear.includes(false)) {

                console.log("1")

                app.makeShips(app.origin_allIDs);


            } else {
                console.log("2")

                app.makeShips(app.newAllIDs);
                //app.fillNewGrid();
            }

        },

        dragEnd(e) {

            console.log("END", e.target.id);

        },

        makeShips(shipsIds) {

            let types = app.ships;

            console.log("hola");

            for (let j = 0; j < shipsIds.length; j++) {


                document.getElementById(shipsIds[j] + "tableA").classList.add('ship-color');
                document.getElementById(shipsIds[j] + "tableA").classList.remove('empty-cell');
                document.getElementById(shipsIds[0] + "tableA").classList.add('switchOrientation');
                document.getElementById(shipsIds[j] + "tableA").classList.add(app.shipType);
                document.getElementById(shipsIds[0] + "tableA").setAttribute("draggable", "true");
                document.getElementById(shipsIds[j] + "tableA").setAttribute("data-shiptype", app.shipType);
                document.getElementById(shipsIds[j] + "tableA").setAttribute('data-shipLocs', app.shipCurrentLoc);
                document.getElementById(shipsIds[j] + "tableA").setAttribute("data-shiplength", shipsIds.length);
                /* Listener to call dragstat and star the D & D */
                document.getElementById(shipsIds[0] + "tableA").addEventListener("dragstart", this.dragStart);


                for (let x = 0; x < types.length; x++) {


                    if (app.shipType == types[x].type) {
                        types[x].locations = shipsIds;
                        app.ships = types;
                    }


                }
            }

            app.addSwitchOrientation();
            app.origin_allIDs = [];
            app.newAllIDs = [];

            console.log(app.ships)

        },

        addSwitchOrientation() {

            let domForButton = document.getElementsByClassName("switchOrientation");

            // console.log(domForButton.getAttribute("id"))

            for (let i = 0; i < domForButton.length; i++) {

                let data_shipTypeValue = domForButton[i].getAttribute("data-shiptype");
                let idValue = domForButton[i].getAttribute("id")

                // console.log(domForButton[i].getAttribute("id"))

                domForButton[i].innerHTML = "<img src=./images/round_loop_white_18dp.png width=\'15px\' height=\'15px\' draggable=false data-shiptype=" + data_shipTypeValue + " id=" + idValue + ">";
                domForButton[i].addEventListener('click', app.switchOrientation);

            }
        },

        markerSalvoes(e) {
 
            let shipCellID = e.target.id;
            console.log(shipCellID)
            if (!document.getElementById(shipCellID).classList.contains("mysalvo") ) {

                if (document.getElementsByClassName("mysalvo").length <= 4) {
                   
                    document.getElementById(shipCellID).classList.add("mysalvo");

                    //S'ha de fer ---> remove empty cell

                }

            } else {

                document.getElementById(shipCellID).classList.remove("mysalvo");
            }

        },

    }

})
