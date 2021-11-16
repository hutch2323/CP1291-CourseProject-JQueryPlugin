$(document).ready( () => {
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
});