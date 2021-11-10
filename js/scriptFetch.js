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

    const displayTeamData = data => {
        console.log(data);
        let stats = data.stats[0].splits[0].stat;
        $("#response").append("</br>Games Played: " + stats.gamesPlayed);
        $("#response").append(". Record: " + stats.wins + "-" + stats.losses + "-" + stats.ot);
    }

    const displayStandingsInfo = (data, id) => {
        // let conferenceStanding = null;
        // let divisionalStanding = null;
        // let leagueStanding = null;
        //let standingsData = null;
        let divisionID = null;

        for(let team of teams){
            if (team.id == id){
                divisionID = team.division.id;
            }
        }

        console.log(data);
        let standingsData = data.records;
        console.log(standingsData);
        console.log("Division ID: " + divisionID);
        for (let record of standingsData) {
            if (record.division.id == divisionID) {
                console.log("Matching division!");
                for (let teamRecord of record.teamRecords) {
                    if (teamRecord.team.id == id) {
                        $("#response").append("</br>" + "League Rank: " + teamRecord.leagueRank + ". Conference Rank: " + teamRecord.conferenceRank + ". Divisional Rank: " + teamRecord.divisionRank);
                        break;
                    }
                }
                break;
            }
        }
    }

    const displayScheduleInfo = (data, id) => {
        console.log(data);
        console.log(data.dates);
        let schedule = data.dates;
        let today = new Date();
        let counter = 0;
        for (let day of schedule) {
            let dateOfGame = new Date(day["date"]);
            dateOfGame.setDate(dateOfGame.getDate() + 1); // date conversion is off by one day. Therefore, we need to add an extra day
            if (dateOfGame >= today) {
                console.log(dateOfGame + " >= " + today);
                break;
            }
            else {
                counter++;
            }
        }
        console.log("Counter before games loop: " + counter);

        const record = {
            startingRecord: {
                wins: 0,
                losses: 0,
                otl: 0,
            },
            endingRecord: {
                wins: 0,
                losses: 0,
                otl: 0
            }
        }
        let numberOfGames = 5;
        let gamesToCheck = numberOfGames;
        let gameIDs = [];
        let i = counter;
        $("#response").append("</br></br>" + "Last " + numberOfGames + " Games:");
        while (gamesToCheck > 0) {
            console.log("i - " + i);
            console.log("Games to check: " + gamesToCheck);
            console.log("Game " + i + ":" + schedule[i].games[0].status.abstractGameState);
            if (schedule[i].games[0].status.abstractGameState == "Final") {
                if (gamesToCheck == numberOfGames) {
                    console.log("Last of 5: " + schedule[i]["date"] + ": " + schedule[i].games[0].teams.away.team.name + " " + schedule[i].games[0].teams.away.score + " vs " + schedule[i].games[0].teams.home.team.name + " " + schedule[i].games[0].teams.home.score);
                    console.log("Team id: " + id + ". Away id: " + schedule[i].games[0].teams.away.team.id + ". Home id: " + schedule[i].games[0].teams.home.team.id);
                    if (schedule[i].games[0].teams.away.team.id == id) {
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
                } else if (gamesToCheck == 1) {
                    console.log("First of 5: " + schedule[i]["date"] + ": " + schedule[i].games[0].teams.away.team.name + " " + schedule[i].games[0].teams.away.score + " vs " + schedule[i].games[0].teams.home.team.name + " " + schedule[i].games[0].teams.home.score);
                    console.log("Team id: " + id + ". Away id: " + schedule[i].games[0].teams.away.team.id + ". Home id: " + schedule[i].games[0].teams.home.team.id);
                    if (schedule[i - 1].games[0].teams.away.team.id == id) {
                        console.log("Your team is the away team");
                        record.startingRecord.wins = schedule[i - 1].games[0].teams.away.leagueRecord.wins;
                        record.startingRecord.losses = schedule[i - 1].games[0].teams.away.leagueRecord.losses;
                        record.startingRecord.otl = schedule[i - 1].games[0].teams.away.leagueRecord.ot;
                    } else {
                        console.log("Your team is the home team");
                        // need to grab record from the game before (the 6th previous game), as without, it will only show record at the end of the game
                        record.startingRecord.wins = schedule[i - 1].games[0].teams.home.leagueRecord.wins;
                        record.startingRecord.losses = schedule[i - 1].games[0].teams.home.leagueRecord.losses;
                        record.startingRecord.otl = schedule[i - 1].games[0].teams.home.leagueRecord.ot;
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
        let wins = record.endingRecord.wins - record.startingRecord.wins;
        let losses = record.endingRecord.losses - record.startingRecord.losses;
        let otl = record.endingRecord.otl - record.startingRecord.otl;
        console.log("Record over past " + numberOfGames + " games: " + wins + "-" + losses + "-" + otl);
        $("#response").append("</br>" + "Record over past " + numberOfGames + " games: " + wins + "-" + losses + "-" + otl);
    }

    const displayError = error => {
        // let html = `<span class="error">${error.message}</span>`;
        // $("#response").append(html);
        alert(error.message);
    };
    
    $("#proceed").click( () => {
        $("#response").html("");
        console.log($("#teamSelector").val());
        let id = $("#teamSelector").val();
        //console.log($("#teamSelector option:selected").text());
        $("#response").append("Team: " + $("#teamSelector option:selected").text());

        console.log("ID - " + id);

        // build URL for API request
        configuration = `/teams/`;
        let modifier = `/stats`;
        //const request = `?api_key=DEMO_KEY&date=${dateStr}`;
        url = api + configuration + id + modifier;
        fetch(url)
            .then( response => response.json() )
            .then( json => displayTeamData(json) )
            .catch( e => displayError(e) );

        configuration = '/standings/'
        url = api + configuration;
        fetch(url)
            .then( response => response.json() )
            .then( json => displayStandingsInfo(json, id) )
            .catch( e => displayError(e) );

        let season = `20212022`
        let gameType = `R`
        configuration = `/schedule?teamId=`
        extension = `&season=${season}&gameType=${gameType}`;
        url = api + configuration + id + extension;
        fetch(url)
            .then( response => response.json() )
            .then( json => displayScheduleInfo(json, id) )
            .catch( e => displayError(e) );

    });
});