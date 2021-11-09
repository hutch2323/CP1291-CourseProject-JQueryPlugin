$(document).ready( () => {
    // build URL for API request
    const api = `https://statsapi.web.nhl.com/api/v1`;
    let configuration = `/teams/`;
    const url2 = api + configuration;

    // code that will grab all teams info from NHL API
    fetch(url2)
        .then( response => response.json() )
        .then( json => populateOptions(json))
        .catch( e => displayError(e) );

    
	let teams = null; // global object to hold all team info
    const populateOptions = json => {
        teams = json.teams;
        // order the array to sort teams alphabetically for select options
        teams.sort(function (a, b) {
            //return a["name"] > b["name"] ? 1 : -1;
            if (a["name"] > b["name"]) {
                return 1;
            } else {
                return -1;
            }
        });
        for (let i = 0; i < json.teams.length; i++) {
            $("#teamSelector").append("<option value='" + json.teams[i].id + "'>" + json.teams[i].name + "</option>")
        }
    }

    const displayTeamData = data => {
        console.log(data);
    }
    
    $("#proceed").click( () => {
        $("#response").html("");
        console.log($("#teamSelector").val());
        let id = $("#teamSelector").val();
        //console.log($("#teamSelector option:selected").text());
        $("#response").append("Team: " + $("#teamSelector option:selected").text());

        console.log("ID - " + id);

        // build URL for API request
        const domain = `https://statsapi.web.nhl.com/api/v1`;
        configuration = `/teams/`;
        const teamID = `2`;
        const request = `?expand=team.roster`;
        //const request = `?api_key=DEMO_KEY&date=${dateStr}`;
        const url = domain + configuration + id + request;

        fetch(url)
            .then( response => response.json() )
            .then( json => displayTeamData(json) )
            .catch( e => displayError(e) );
    });
});