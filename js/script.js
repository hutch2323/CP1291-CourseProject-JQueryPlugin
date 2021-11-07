$(document).ready( () => {
    // code that will get team abbreviations
	$.getJSON('https://statsapi.web.nhl.com/api/v1/teams?', function(data){
		console.log(data.teams[5].abbreviation);
	});

    // code that will grab all teams and their id
	let teams = []
	$.getJSON('https://statsapi.web.nhl.com/api/v1/teams', function(data){
		console.log(data.teams);
		teams = data.teams;
		for(let i = 0; i < teams.length; i++){
			$("#response").append("<p>" + teams[i].name + " - " + teams[i].id + "</p>");
		}
	});

    // code that will display the roster of a team with ID of 5
	let teamID = 5
	$.getJSON('https://statsapi.web.nhl.com/api/v1/teams/' + teamID + '/roster', function(data){
		console.log(data.roster[0].person.fullName);
        console.log(data.roster);
	});


    // code that gets the current nhl standings, sorts it by points in descending order (team with most points would be at index 0)
	let writingTeams = setTimeout(() => {
		console.log("outside json");
		console.log(teams);
		let ids = [];
		for(let i = 0; i < teams.length; i++){
			ids[ids.length] = teams[i].id;
		}

		let standingsArray = [];
		for(let id of ids){
			$.getJSON('https://statsapi.web.nhl.com/api/v1/teams/' + id + '/stats', function(data){
				standingsArray[standingsArray.length] = [parseInt(data.stats[0].splits[0].stat.pts), data.stats[0].splits[0].team.name];
			});
		}

        let arrangeStandings = setTimeout(() => {
            standingsArray.sort(function(a, b) {
                return b[0]- a[0];
            });
    
            console.log(standingsArray);

        }, 1000);
		
		// let sortedStandings = [];

		// for(let team of standingsArray){
			
		// }
	}, 500);
});