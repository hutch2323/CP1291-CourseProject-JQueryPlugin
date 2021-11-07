$(document).ready( () => {
	// get team info
	$.getJSON('https://statsapi.web.nhl.com/api/v1/teams', function(data){
		console.log(data);
	});

	// get team roster
	$.getJSON('https://statsapi.web.nhl.com/api/v1/teams/3/roster', function(data){
		console.log(data);
	});

	// get player info using specific player id variable
	let id = 8477474;
	$.getJSON('https://statsapi.web.nhl.com/api/v1/people/' + id, function(data){
		console.log(data);
	});

	// get stats of particular player id and particular season (hard coded)
	$.getJSON('https://statsapi.web.nhl.com/api/v1/people/8471698/stats?stats=statsSingleSeason&season=20212022', function(data){
		console.log(data);
	});
	
	// get goalie stats using particular player id and season (hard coded)
	$.getJSON('https://statsapi.web.nhl.com/api/v1/people/8478048/stats?stats=statsSingleSeason&season=20212022', function(data){
		console.log(data);
	});

	// get goalie stats - not currently working
	$.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent('https://api.nhle.com/stats/rest/en/goalie/summary?isAggregate=false&isGame=false&cayenneExp=seasonId=20212022') + '&callback=?', function(data){
		console.log(data.contents[0]["data"]);
	});
});