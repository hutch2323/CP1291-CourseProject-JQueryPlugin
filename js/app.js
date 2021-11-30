const initializeDropDown = async () => {
    // build URL for API request
    const api = `https://statsapi.web.nhl.com/api/v1`;
    let configuration = `/teams/`;
    let url = api + configuration;

    // function to grab the API request
    const getJSON = async () => {
        try{
            const response = await fetch(url);
            const json = await response.json();
            return json
        } catch(e){
            alert(e)
        }
    }

    // store API JSON response
    const json = await getJSON();
    // create an array of teams
    let teams = json.teams;
    // order the array to sort teams alphabetically for select options
    teams.sort(function (a, b) {
        if (a["name"] > b["name"]) {
            return 1;
        } else {
            return -1;
        }
    });

    // append each team in the list to the select/options drop down, using the team id and the team name
    for (let i = 0; i < json.teams.length; i++) {
        $("#teamSelector").append("<option value='" + json.teams[i].id + "'>" + json.teams[i].name + "</option>")
        
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

$("#proceed").click( () =>  {
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
