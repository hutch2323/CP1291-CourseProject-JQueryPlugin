$(document).ready( () => {
    // code that will get team abbreviations
	$.getJSON('https://statsapi.web.nhl.com/api/v1/teams?', function(data){
		console.log(data.teams[5].abbreviation);
	});

    // code that will grab all teams and their ids
	let teams = []
	$.getJSON('https://statsapi.web.nhl.com/api/v1/teams', function(data){
		console.log(data.teams);
		teams = data.teams;
        // order the array alphabetically
        teams.sort(function(a, b) {
            //return a["name"] > b["name"] ? 1 : -1;
            if (a["name"] > b["name"]){
                return 1;
            } else {
                return -1;
            }
        });
		for(let i = 0; i < teams.length; i++){
			// $("#response").append("<p>" + teams[i].name + " - " + teams[i].id + "</p>");
            $("#teamSelector").append("<option value='" + teams[i].id + "'>" + teams[i].name + "</option>")
		}
	});

    $.getJSON('https://statsapi.web.nhl.com/api/v1/teams/2', function(data){
        console.log(data);
    });

    // // code that will display the roster of a team with ID of 5
	// let teamID = 5
	// $.getJSON('https://statsapi.web.nhl.com/api/v1/teams/' + teamID + '/roster', function(data){
	// 	console.log(data.roster[0].person.fullName);
    //     console.log(data.roster);
	// });


    // // code that gets the current nhl standings, sorts it by points in descending order (team with most points would be at index 0)
	// let writingTeams = setTimeout(() => {
	// 	console.log("outside json");
	// 	console.log(teams);
	// 	let ids = [];
	// 	for(let i = 0; i < teams.length; i++){
	// 		ids[ids.length] = teams[i].id;
	// 	}

	// 	let standingsArray = [];
    //     let teamArray = []
		// for(let id of ids){
			// $.getJSON('https://statsapi.web.nhl.com/api/v1/teams/' + id + '/stats', function(data){
			// 	standingsArray[standingsArray.length] = [parseInt(data.stats[0].splits[0].stat.pts), data.stats[0].splits[0].team.name];
            //     teamArray[teamArray.length] = [data.stats[0].splits[0].team.name, parseInt(data.stats[0].splits[0].stat.pts)];
			// });
		// }

    //     let arrangeStandings = setTimeout(() => {
    //         standingsArray.sort(function(a, b) {
    //             return b[0]- a[0];
    //         });
    
    //         console.log(standingsArray);

    //         teamArray.sort(function(a, b) {
    //             // return a[0] > b[0] ? 1 : -1;
    //             if (a[0] > b[0]){
    //                 return 1;
    //             } else {
    //                 return -1;
    //             }
    //         });

    //         console.log(teamArray);

    //     }, 1000);
		
	// 	// let sortedStandings = [];

	// 	// for(let team of standingsArray){
			
	// 	// }
	// }, 500);

    $("#proceed").click( () => {
        $("#response").html("");
        console.log($("#teamSelector").val());
        let id = $("#teamSelector").val();
        //console.log($("#teamSelector option:selected").text());
        $("#response").append("Team: " + $("#teamSelector option:selected").text());

        console.log("ID - " + id);
        $.getJSON('https://statsapi.web.nhl.com/api/v1/teams/' + id + '/stats', function(data){
            //console.log(data.stats[0].splits[0].stat.pts);
            console.log(data)
            // console.log(data.stats[0].splits[0].stat.gamesPlayed); // 10
            // console.log(data.stats[0].splits[0].stat.wins); // 9
            // console.log(data.stats[0].splits[0].stat.losses); // 1
            // console.log(data.stats[0].splits[0].stat.ot); // 0
            // console.log(data.stats[0].splits[0].stat.pts); // 18
            $("#response").append("</br>Games Played: " + data.stats[0].splits[0].stat.gamesPlayed);
            $("#response").append(". Record: " + data.stats[0].splits[0].stat.wins + "-" + data.stats[0].splits[0].stat.losses + "-" + data.stats[0].splits[0].stat.ot);
            //$("#response").append("</br>Points: " + data.stats[0].splits[0].stat.pts);
        });

        let conferenceStanding = null;
        let divisionalStanding = null;
        let leagueStanding = null;
        let standingsData = [];
        let divisionID = null;

        for(let team of teams){
            if (team.id == id){
                divisionID = team.division.id;
            }
        }

        $.getJSON('https://statsapi.web.nhl.com/api/v1/standings', function(data){
            let delay = setTimeout(() => {
                console.log(data);
                standingsData = data.records;
                console.log(standingsData);
                console.log("Division ID: " + divisionID);
                for(let record of standingsData){
                    if (record.division.id == divisionID){
                        console.log("Matching division!");
                        for(let teamRecord of record.teamRecords){
                            if (teamRecord.team.id == id){
                                conferenceStanding = teamRecord.conferenceRank;
                                divisionalStanding = teamRecord.divisionRank;
                                leagueStanding = teamRecord.leagueRank;
                                break;
                            }
                        }
                        break;
                    }
                }
                console.log("League Rank: " + leagueStanding + ". Conference Rank: " + conferenceStanding + ". Divisional Rank: " + divisionalStanding);
                $("#response").append("</br>" + "League Rank: " + leagueStanding + ". Conference Rank: " + conferenceStanding + ". Divisional Rank: " + divisionalStanding);
            }, 100);
        });


        let today = new Date();
        let currentDay = today.getDate();
	    let currentMonth = today.getMonth() + 1;
	    let currentYear = today.getFullYear();
        let dateString = currentYear + "-" + currentMonth + "-" + currentDay;
        console.log(today);
        console.log(currentYear + "-" + currentMonth + "-" + currentDay);
        // $.getJSON('https://statsapi.web.nhl.com/api/v1/schedule?teamId=' + id + "&date=" + dateString, function(data){
        //     //console.log(data.dates[0].games[0].teams.away.team.name + " vs " + data.dates[0].games[0].teams.home.team.name);
        //     //if (data.dates[0].games[0].status.abstractGameState == "Final"){
        //         console.log(data);
        //     // } else {
        //     //     console.log("Game not yet played or finished")
        //     // }
        // });

        // $.getJSON('https://statsapi.web.nhl.com/api/v1/schedule?teamId=' + id + "&date=2021-11-06", function(data){
        //     //console.log(data.dates[0].games[0].teams.away.team.name + " vs " + data.dates[0].games[0].teams.home.team.name);
        //     console.log(data);
        // });

        // $.getJSON('https://statsapi.web.nhl.com/api/v1/schedule?teamId=' + id + "&startDate=2018-01-02&endDate=2018-01-02", function(data){
        //     //console.log(data.dates[0].games[0].teams.away.team.name + " vs " + data.dates[0].games[0].teams.home.team.name);
        //     console.log(data);
        // });

        // // full season of games for particular team with gameType=R representing regualr season. Season currently hardcoded
        // $.getJSON('https://statsapi.web.nhl.com/api/v1/schedule?teamId=' + id + "&season=20212022&gameType=R", function(data){
        //     console.log(data);
        // });

        $.getJSON('https://statsapi.web.nhl.com/api/v1/schedule?teamId=' + id + "&season=20212022&gameType=R", function(data){
            let delay2 = setTimeout(() => {
                console.log(data.dates);
                let schedule = data.dates;
                let today = new Date();
                let counter = 0;
                for(let day of schedule){
                    let dateOfGame = new Date(day["date"]);
                    dateOfGame.setDate(dateOfGame.getDate() + 1); // date conversion is off by one day. Therefore, we need to add an extra day
                    if (dateOfGame >= today){
                        console.log(dateOfGame + " >= " + today);
                        break;
                    }
                    else {
                        counter++;
                    }
                }
                console.log("Counter before games loop: " + counter);

                const record = {
                    startingRecord:{
                        wins:0,
                        losses:0,
                        otl:0,
                    },
                    endingRecord: {
                        wins:0,
                        losses:0,
                        otl:0
                    }
                }
                let gameInProgress = false;
                let numberOfGames = 5;
                let gamesToCheck = numberOfGames;
                let gameIDs = [];
                //for(let i = counter; i > (counter - gamesToCheck); i--){
                let i = counter;
                $("#response").append("</br></br>" + "Last " + numberOfGames + " Games:");
                while(gamesToCheck > 0){
                    console.log("i - " + i);
                    console.log("Games to check: " + gamesToCheck);
                    console.log("Game " + i + ":" + schedule[i].games[0].status.abstractGameState);
                    if (schedule[i].games[0].status.abstractGameState == "Final"){
                        if (gamesToCheck == numberOfGames){
                            console.log("Last of 5: " + schedule[i]["date"] + ": " + schedule[i].games[0].teams.away.team.name + " " + schedule[i].games[0].teams.away.score + " vs " + schedule[i].games[0].teams.home.team.name + " " + schedule[i].games[0].teams.home.score);
                            console.log("Team id: " + id + ". Away id: " + schedule[i].games[0].teams.away.team.id + ". Home id: " + schedule[i].games[0].teams.home.team.id);
                            if(schedule[i].games[0].teams.away.team.id == id){
                                console.log("Your team is the away team");
                                record.endingRecord.wins = schedule[i].games[0].teams.away.leagueRecord.wins;
                                record.endingRecord.losses = schedule[i].games[0].teams.away.leagueRecord.losses;
                                record.endingRecord.otl = schedule[i].games[0].teams.away.leagueRecord.ot;
                            } else {
                                console.log("Your team is the home team");
                                record.endingRecord.wins = schedule[i].games[0].teams.home.leagueRecord.wins;
                                record.endingRecord.losses = schedule[i].games[0].teams.home.leagueRecord.losses;
                                record.endingRecord.otl = schedule[i].games[0].teams.home.leagueRecord.ot;
                            }
                            console.log("Record after 5 Games: " + record.endingRecord.wins + "-" + record.endingRecord.losses + "-" + record.endingRecord.otl);
                        } else if (gamesToCheck == 1){
                            console.log("First of 5: " + schedule[i]["date"] + ": " + schedule[i].games[0].teams.away.team.name + " " + schedule[i].games[0].teams.away.score + " vs " + schedule[i].games[0].teams.home.team.name + " " + schedule[i].games[0].teams.home.score);
                            console.log("Team id: " + id + ". Away id: " + schedule[i].games[0].teams.away.team.id + ". Home id: " + schedule[i].games[0].teams.home.team.id);
                            if(schedule[i-1].games[0].teams.away.team.id == id){
                                console.log("Your team is the away team");
                                record.startingRecord.wins = schedule[i-1].games[0].teams.away.leagueRecord.wins;
                                record.startingRecord.losses = schedule[i-1].games[0].teams.away.leagueRecord.losses;
                                record.startingRecord.otl = schedule[i-1].games[0].teams.away.leagueRecord.ot;
                            } else {
                                console.log("Your team is the home team");
                                // need to grab record from the game before (the 6th previous game), as without, it will only show record at the end of the game
                                record.startingRecord.wins = schedule[i-1].games[0].teams.home.leagueRecord.wins;
                                record.startingRecord.losses = schedule[i-1].games[0].teams.home.leagueRecord.losses;
                                record.startingRecord.otl = schedule[i-1].games[0].teams.home.leagueRecord.ot;
                            }
                            console.log("Record at beginning: " + record.startingRecord.wins + "-" + record.startingRecord.losses + "-" + record.startingRecord.otl);
                        }
                        console.log(schedule[i]["date"] + ": " + schedule[i].games[0].teams.away.team.name + " " + schedule[i].games[0].teams.away.score + " vs " + schedule[i].games[0].teams.home.team.name + " " + schedule[i].games[0].teams.home.score);
                        $("#response").append("</br>" + schedule[i]["date"] + ": " + schedule[i].games[0].teams.away.team.name + " " + schedule[i].games[0].teams.away.score + " vs " + schedule[i].games[0].teams.home.team.name + " " + schedule[i].games[0].teams.home.score);
                        // gameIDs[gameIDs.length] = schedule[i].games[0]["gamePk"];
                        gamesToCheck--;
                        i--;
                    } else {
                        // if a game is in progress on the current date, we would need to go back one game further to get the final game of the requested amount
                        gameInProgress = true; 
                        console.log("infinite loop");
                        console.log(schedule[i]["date"] + ": " + schedule[i].games[0].teams.away.team.name + " " + schedule[i].games[0].teams.away.score + " vs " + schedule[i].games[0].teams.home.team.name + " " + schedule[i].games[0].teams.home.score + " (Game in progress)");
                        i--;
                        //gamesToCheck++;
                    }
                }
                //console.log(record.startingRecord.wins);

                // console.log(gameIDs);
                // for(let gameID of gameIDs){
                //     $.getJSON("https://statsapi.web.nhl.com/api/v1/game/" + gameID + "/boxscore", function(data){
                //         console.log(data);
                //     });
                //     $.getJSON("https://statsapi.web.nhl.com/api/v1/game/" + gameID + "/linescore", function(data){
                //         console.log(data);
                //     });
                // }


                let wins = record.endingRecord.wins - record.startingRecord.wins;
                let losses = record.endingRecord.losses - record.startingRecord.losses;
                let otl = record.endingRecord.otl - record.startingRecord.otl;
                console.log("Record over past " + numberOfGames + " games: " + wins + "-" + losses + "-" + otl);
                $("#response").append("</br>" + "Record over past " + numberOfGames + " games: " + wins + "-" + losses + "-" + otl);
            }, 200);
        });

        // $.getJSON('https://statsapi.web.nhl.com/api/v1/schedule?teamId=' + id + "&expand=schedule.linescore", function(data){
        //     //console.log(data.dates[0].games[0].teams.away.team.name + " vs " + data.dates[0].games[0].teams.home.team.name);
        //     console.log(data);
        // });

        // $.getJSON('https://statsapi.web.nhl.com/api/v1/schedule', function(data){
        //     console.log(data);
        // });


        
    });
});