var app = new Vue({
    el: "#app",
    mounted() {
        this.populateTable()
    },

    data: {
        games: [],
    },

    methods: {
        getData() {
            let url = "http://localhost:8080/api/games";

            fetch(url, {
                    mode: "cors"
                })
                .then(function (response) {
                    return response.json()
                })
                .then(function (gameJson) {
                    salvo.games = gameJson
                })
                .catch(error => console.log(error))
        },

        populateTable() {

            const column = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
            const body = document.getElementById("table");
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

                    td.setAttribute("id", column[i] + j);
                    //this will add an ID to match each cell (eg: cell A1 will have the ID="A1" )

                    tr.appendChild(td);
                    //this bind the builded cells to the rows, whichare themselves built at the first loop
                }
            }
            body.appendChild(table);
            //td bind to  tr
            // tr bind to tbody
            //tbody bind to table
            // and now, we are pushing the table to the body , which is the ID of the div in HTMl page
        }
    }


})


//https://www.youtube.com/watch?v=KsRnddegee0
