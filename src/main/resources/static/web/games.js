//var dataVue = new Vue({
//    el: '#app',
//    //on mounted We put this function is to call my json (on myjason.com url)
//    mounted() {
//        this.cargarPage();
//    },
//    // This is the model.
//    data: {
//
//        games:[],
//    },
//    // Functions we will be using.
//    methods: {
//        //function to call the json on myjason.com
//        cargarPage() {
//
//            this.$http.get('/api/games')
//                .then((response) => {
//                    //on this variables I put the values of my jsn
//                    this.games=response.body;
//
//                });
//        },
//    },
//});

let app = new Vue({
    el: "#app",
    mounted() {
        this.getDataFunction();
    },
    data: {
        gameData: []
    },
    methods: {
    getDataFunction() {
        let url = "http://localhost:8080/api/games";

        fetch(url, {
            mode: "cors"
        })
        .then(function(response){
            return response.json()
        })
        .then(function(gameJson){
            app.gameData = gameJson
        })
        .catch(error => console.log(error))
    }
    }
})
