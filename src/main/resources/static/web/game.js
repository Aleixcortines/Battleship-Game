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
        mySalvoes:[],
    },

    methods: {
        getData() {

            let url = "http://localhost:8080/api/game_view/" + this.gamePlayers;

            fetch(url, {
                    mode: "cors"
                })
                .then(function (response) {
                    return response.json()
                })
                .then(function (gameJson) {

                    app.gameDat = gameJson;

                    app.games = gameJson.game.GamePlayer;

                    app.ships = gameJson.game.Ships;

                    app.salvoOpponent = gameJson.game.opponentSalvoes;
                
                    app.mySalvoes =  gameJson.game.mySalvoes;

                    app.gameVs();

                    app.printSalvoesOpponent();


                })
                .catch(error => console.log(error))
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

                    if (i == 0 && j > 0) {
                        td.textContent = j;
                    } //this will add the content of the first column(the letter)

                    if (i > 0 && j == 0) {
                        td.textContent = column[i];
                    } //this will add the content of the first row(the numbers)

                    td.setAttribute("id", column[i] + j+tablesHTML);
                    //this will add an ID to match each cell (eg: cell A1 will have the ID="A1" )

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
           
  
            for (var s=0 ; s<this.mySalvoes.length; s++){
                
                var mySalvoLocation = this.mySalvoes[s].Location;
                
                var mySalvoTurn = this.mySalvoes[s].Turn;
                
                
                for ( var l = 0 ; l<mySalvoLocation.length;l++){
                    
                    document.getElementById(mySalvoLocation[l]+"table2").style.backgroundColor= 'yellow'
                    
                     document.getElementById(mySalvoLocation[l]+"table2").innerHTML= mySalvoTurn;
                }
                
            }
            
            
            for (var i = 0; i < this.ships.length; i++) {

                var locations = this.ships[i].Location;

                for (var j = 0; j < locations.length; j++) {

                    document.getElementById(locations[j]+"table1").style.backgroundColor = '#424245'

                    shipLocationArray.push(locations[j]);
                    

                }
            }

            for (var i = 0; i < this.salvoOpponent.length; i++) {
                

                var salvoLocations = this.salvoOpponent[i].Location;
                
                var salvoTurnOpp = this.salvoOpponent[i].Turn;

                for (var j = 0; j < salvoLocations.length; j++) {

                    document.getElementById(salvoLocations[j]+"table1").style.backgroundColor = 'yellow'
                    document.getElementById(salvoLocations[j]+"table1").innerHTML= salvoTurnOpp;
                    

                    for (var x=0; x<shipLocationArray.length;x++) {
                        
                        if (salvoLocations[j].includes(shipLocationArray[x])) {
                            
                            document.getElementById(salvoLocations[j]+"table1").style.backgroundColor='red'
                            
                        }

                    }

                }
            }
            
            
            
            

        }
    }

})
