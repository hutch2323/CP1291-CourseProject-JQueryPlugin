const pluginInitiation = () => {
    // build URL for API request
    const api = `https://statsapi.web.nhl.com/api/v1`;
    let configuration = `/teams/`;
    let url = api + configuration;

    // code that will grab all teams info from NHL API
    fetch(url)
        .then( response => response.json() )
        .then( json => populateOptions(json))
        .catch( e => displayError(e) );

    
	let teams = null; // global object to hold all team info
    const populateOptions = json => {
        teams = json.teams;
        // order the array to sort teams alphabetically for select options
        teams.sort(function (a, b) {
            if (a["name"] > b["name"]) {
                return 1;
            } else {
                return -1;
            }
        });

        for (let i = 0; i < json.teams.length; i++) {
            $("#teamSelector").append("<option value='" + json.teams[i].id + "'>" + json.teams[i].name + "</option>")
            console.log(json.teams[i].id + " - " + json.teams[i].name);
            // preload team images for plugin
            let teamName = json.teams[i].name
            let length = teamName.length
            for (let i=0; i < length; i++) {
                teamName = teamName.replace(" ", "_");
            }
            const image = new Image();
            image.src = `images/${teamName}.png`;
        }
    }
}

// $("#imageGallery").imagePopup({
//     overlay: "rgba(0, 100, 0, 0.5)",
//     closeButton: {
//         src: "images/close.png",
//         witdh: "40px",
//         height: "40px"
//     },   
//     imageBorder: "15px solid #ffffff",
//     borderRadius: "10px",
//     imageWidth: "500px",
//     imageHeight: "400px",
//     imageCaption: {
//         exist: true,
//         color: "#ffffff",
//         fontSize: "40px"
//     },
//     open: function() {
//         console.log("opened");
//     },
//     close: function() {
//         console.log("closed");
//     }
// });

$("#proceed").click( () =>  {
    //$("#proceed").off("click");
    $("#proceed").attr("disabled", true);
    $(this).teamInfoPopup({
        margin: "0px",
        width: "50%",
        borderRadius: "10px",
        padding: "5%",
        margin: "auto",
    // score:{
    //     fontSize: "5em",
    //     fontColor: "#000000"
    // },
    // date: {
    //     fontSize: "10px",
    //     fontColor: "#ffffff"
    // },
    // status:{
    //     fontSize: "20px",
    //     fontColor: "#234513"
    // },
    // gameResults: {
    //     primaryColor: "#8C2633",
    //     secondaryColor: "#5F259F"
    // },
    // teamName:{
    //     fontSize: "25px",
    //     fontColor: "#ffffff"
    // },
    // record:{
    //     fontSize: "15px",
    //     fontColor: "#000000"
    // },
    // rank:{
    //     fontSize: "12px",
    //     fontColor: "#ffffff"
    // },
    // recordLast5:{
    //     fontSize: "16px",
    //     fontColor: "#FFFFFF"
    // },
    }) 
});
