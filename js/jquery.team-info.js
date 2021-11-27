(function ($) {
    $.fn.teamInfoPopup = function(options){
        let settings = $.extend({
            overlay: 'rgba(0.5, 0.5, 0.5, 0.5)',
            width: "50%",
            borderRadius: "10px",
            padding: "5%",
            margin: "auto",
            closeButton: {
                src: null,
                witdh: "30px",
                height: "30px"
            },
            teamName: {
                fontSize: "25px",
                fontColor: "#FFFFFF"
            },
            record: {
                fontSize: "16px",
                fontColor: "#FFFFFF"
            },
            rank: {
                fontSize: "16px",
                fontColor: "#FFFFFF"
            },
            gameResults: {
                primaryColor: getPrimaryColor(),
                secondaryColor: getSecondaryColor(),
            },
            score: {
                fontSize: "4em",
                fontColor: "#FFFFFF"
            },
            status: {
                fontSize: "16px",
                fontColor: "#FFFFFF"
            },
            date: {
                fontSize: "16px",
                fontColor: "#FFFFFF"
            },
            recordLast5:{
                fontSize: "16px",
                fontColor: "#FFFFFF"
            },
            open: null,
            close: null,
        }, options);

        function getPrimaryColor() {
            let primaryColor = null;
            let id = $("#teamSelector").val()
            let teamColors = getColors();
            for (let team of teamColors) {
                if (team[0] == id) {
                    primaryColor = team[1];

                }
            }
            console.log("Primary Color: " + primaryColor);

            return primaryColor
        }

        function getSecondaryColor() {
            let secondaryColor = null;
            let id = $("#teamSelector").val();
            let teamColors = getColors();
            for (let team of teamColors) {
                if (team[0] == id) {
                    secondaryColor = team[2];
                }
            }
            console.log("Secondary Color: " + secondaryColor);
            return secondaryColor
        }

        function getColors(){
            return [[24,"#F47A38","#000000"], // Anaheim Ducks
            [53,"#8C2633", "#5F259F"], // Arizona Coyotes
            [6, "#000000", "#FFB81C"], // Boston Bruins
            [7, "#002654", "#FCB514"], // Buffalo Sabres
            [20, "#C8102E", "#F1BE48"], // Calgary Flames
            [12, "#CC0000", "#000000"], // Carolina Hurrincanes
            [16, "#CF0A2C", "#000000"], // Chicago Blackhawks
            [21, "#6F263D", "#236192"], // Colorado Avalanche
            [29, "#002654", "#CE1126"], // Columbus Blue Jackets
            [25, "#006847", "#8F8F8C"], // Dallas Stars
            [17, "#CE1126", "#FFFFFF"], // Detroit Red Wings
            [22, "#041E42", "#FF4C00"], // Edmonton Oilers
            [13, "#041E42", "#C8102E"], // Florida Panthers
            [26, "#111111", "#A2AAAD"], // LA Kings
            [30, "#A6192E", "#154734"], // Minnesota Wild
            [8, "#AF1E2D", "#192168"], // Montreal Canadiens
            [18, "#041E42", "#FFB81C"], // Nashville Predators
            [1, "#CE1126", "#000000"], // New Jersey Devils
            [2, "#00539B", "#F47D30"], // New York Islanders
            [3, "#0038A8", "#CE1126"], // New York Rangers
            [9, "#C52032", "#000000"], // Ottawa Senators
            [4, "#F74902", "#000000"], // Philadelphia Flyers
            [5, "#000000", "#FCB514"], // Pittsburgh Penguins
            [28, "#006D75", "#EA7200"], // San Jose Sharks
            [55, "#001628", "#99D9D9"], // Seattle Kraken
            [19, "#002F87", "#FCB514"], // St. Louis Blues
            [14, "#002868", "#000000"], // Tampa Bay Lightning
            [10, "#00205B", "#FFFFFF"], // Toronto Maple Leafs
            [23, "#00205B", "#041C2C"], // Vancouver Canucks
            [54, "#B4975A", "#000000"], // Vegas Golden Knights
            [15, "#041E42", "#C8102E"], // Washington Capitals
            [52, "#041E42", "#AC162C"]]; // Winnipeg Jets
        }

        return this.each(function(){
            /**
             * Declaring new element(s) variables
             */
            const api = `https://statsapi.web.nhl.com/api/v1`;
            let $overlay, $closeButton
            setOverlayProperties();
            setCloseButtonProperties();
            getTeamData();
            getScheduleInfo();

            $overlay.css({opacity: 0.1}).show().animate({opacity:1});
            $overlay.css("color", "white");
            $overlay.append(`<ul id="scoresList"></ul>`)
            $("#scoresList").append(`<div style="margin:5px 5px 20px 5px"><table id="overlayTable" style="text-align:center; margin:auto; table-layout:fixed; border-width: 3px 3px 10px 3px; border-style: solid; width:100%"></table></div>`)
            $("#overlayTable").append(`<tr style="width:100%"><th id="teamName" colspan="4" style="color:${settings.teamName.fontColor}; font-size:${settings.teamName.fontSize}"></th></tr>`);


            $(this).find("#proceed").on("click", function(event) {
                event.preventDefault();

                if($.isFunction(settings.open)){
                    settings.open.call(this);
                }

                $overlay.css({opacity: 0.1}).show().animate({opacity:1});
            });


            function getTeamData() {
                // build URL for API request
                let configuration = `/teams/`;
                let modifier = `/stats`;
                let teamID = $("#teamSelector").val();
                url = api + configuration + teamID + modifier;
                fetch(url)
                    .then(response => response.json())
                    .then(json => displayTeamData(json))
                    .catch(e => displayError(e));
            }

            function displayTeamData(data){     
                $("#response").html("");
                console.log(data);
                console.log("Team ID from plugin - " + settings.teamID);
                let stats = data.stats[0].splits[0].stat;
                let selectedTeam = $("#teamSelector option:selected").text();
                $("#teamName").text(selectedTeam);
                $("#overlayTable").append(`<tr><td colspan=4 style="color:${settings.record.fontColor}; font-size:${settings.record.fontSize}">Record: ${stats.wins}-${stats.losses}-${stats.ot}</td></tr>`)
                getStandingsInfo();
            }

            function getScheduleInfo(){
                let id = $("#teamSelector").val();
                let season = `20212022`
                let gameType = `R`
                configuration = `/schedule?teamId=`
                extension = `&season=${season}&gameType=${gameType}`;
                url = api + configuration + id + extension;
                fetch(url)
                    .then(response => response.json())
                    .then(json => displayScheduleInfo(json, id))
                    .catch(e => displayError(e));
            }

            function getEndOfGamePeriod(date, currentGame){
                let id = $("#teamSelector").val();
                configuration = `/schedule?teamId=`
                extension = `&startDate=${date}&endDate=${date}&hydrate=team,linescore`;
                url = api + configuration + id + extension;
                fetch(url)
                    .then(response => response.json())
                    .then(json => displayEndOfGamePeriod(json.dates[0].games[0].linescore.currentPeriodOrdinal, currentGame))
                    .catch(e => displayError(e));
            }

            function getStandingsInfo(){
                let id = $("#teamSelector").val();
                configuration = '/standings/'
                url = api + configuration;
                fetch(url)
                .then( response => response.json() )
                .then( json => displayStandingsInfo(json.records, id) )
                .catch( e => displayError(e) );
            }

            function displayStandingsInfo(json, id){
                let conferenceStanding = null;
                let divisionalStanding = null;
                let leagueStanding = null;

                for(let i=0; i < json.length; i++){
                    for(let j=0; j < json[i].teamRecords.length; j++){
                        if (id == json[i].teamRecords[j].team.id){
                            leagueStanding = json[i].teamRecords[j].leagueRank;
                            conferenceStanding = json[i].teamRecords[j].conferenceRank;
                            divisionalStanding = json[i].teamRecords[j].divisionRank;
                            i = json.length;
                            break;
                        }
                    }
                }
                
                $("#overlayTable").append(`<tr><td colspan=4 style="color:${settings.rank.fontColor}; font-size:${settings.rank.fontSize}">League Rank: ${leagueStanding} | Conference Rank: ${conferenceStanding} | Division Rank: ${divisionalStanding}</td></tr>`)
            }    

            function displayEndOfGamePeriod(endPeriodOfGame, currentGame){
                console.log("current game: " + currentGame);
                console.log("endofGamePeriod: " + endPeriodOfGame);

                if(currentGame == 1){
                    if (endPeriodOfGame != "3rd"){
                        $("#endPeriodGame1").css("display", "block");
                        $("#endPeriodGame1").text(endPeriodOfGame);
                    }
                } else if (currentGame == 2){
                    if (endPeriodOfGame != "3rd"){
                        $("#endPeriodGame2").css("display", "block");
                        $("#endPeriodGame2").text(endPeriodOfGame);
                    }
                } else if (currentGame == 3){
                    if (endPeriodOfGame != "3rd"){
                        $("#endPeriodGame3").css("display", "block");
                        $("#endPeriodGame3").text(endPeriodOfGame);
                    }
                } else if (currentGame == 4){
                    if (endPeriodOfGame != "3rd")
                        {$("#endPeriodGame4").css("display", "block");
                        $("#endPeriodGame4").text(endPeriodOfGame);
                    }
                } else if (currentGame == 5){
                    if (endPeriodOfGame != "3rd"){
                        $("#endPeriodGame5").css("display", "block");
                        $("#endPeriodGame5").text(endPeriodOfGame);
                    }
                }
            }

            function displayScheduleInfo(data, id){
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
                let currentGame = 1;
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
                        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
                        let gameDate = new Date(schedule[i]["date"]);
                        gameDate.setDate(gameDate.getDate() + 1);
                        let month = months[gameDate.getMonth()];


                        let homeImage = schedule[i].games[0].teams.home.team.name;
                        let awayImage = schedule[i].games[0].teams.away.team.name;
                        
                        let length = homeImage.length
                        for (let i=0; i < length; i++) {
                            homeImage = homeImage.replace(" ", "_");
                        }
                        length = awayImage.length
                        for (let i=0; i < length; i++) {
                            awayImage = awayImage.replace(" ", "_");
                        }

                        $("#scoresList").append(
                        `<div class="scoreContainer">
                            <div class="scores" id="score${currentGame}">
                                <div class="date" style="color:${settings.date.fontColor}; font-size:${settings.date.fontSize}">
                                    ${month}. ${gameDate.getDate()}
                                </div>
                                <div class="teams">
                                    <table class="scoreTable">
                                        <tr>
                                            <td><img class="awayImage" src="images/${awayImage}.png"></td>
                                            <td>
                                                <div class="score" style="color:${settings.score.fontColor}; font-size:${settings.score.fontSize}">${schedule[i].games[0].teams.away.score}</div>
                                            </td>
                                            <td style="color:${settings.status.fontColor}; font-size:${settings.status.fontSize}">
                                                Final
                                                <div class="gameStatus">
                                                    <div id="endPeriodGame${currentGame}"class="endPeriod" style="color:${settings.status.fontColor}; font-size:${settings.status.fontSize}"></div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="score" style="color:${settings.score.fontColor}; font-size:${settings.score.fontSize}">${schedule[i].games[0].teams.home.score}</div>
                                            </td>
                                            <td><img class="homeImage" src="images/${homeImage}.png"></td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>`)

                        $(".scoreContainer").css("background", settings.gameResults.primaryColor);
                        $(".scoreContainer").css("border-color", settings.gameResults.secondaryColor);
                        $("#overlayTable").css("background", settings.gameResults.primaryColor);
                        $("#overlayTable").css("border-color", settings.gameResults.secondaryColor);
                        getEndOfGamePeriod(schedule[i]["date"], currentGame);
                        currentGame++;
                        gamesToCheck--;
                        i--;
                    } else {
                        // if a game is in progress on the current date, we would need to go back one game further to get the final game of the requested amount
                        gameInProgress = true;
                        console.log(schedule[i]["date"] + ": " + schedule[i].games[0].teams.away.team.name + " " + schedule[i].games[0].teams.away.score + " vs " + schedule[i].games[0].teams.home.team.name + " " + schedule[i].games[0].teams.home.score + " (Game in progress)");
                        i--;
                    }
                }
                let wins = record.endingRecord.wins - record.startingRecord.wins;
                let losses = record.endingRecord.losses - record.startingRecord.losses;
                let otl = record.endingRecord.otl - record.startingRecord.otl;
                console.log("Record over past " + numberOfGames + " games: " + wins + "-" + losses + "-" + otl);
                $overlay.append(`<div style="color:${settings.recordLast5.fontColor}; font-size:${settings.recordLast5.fontSize}; padding-top:10px">Record over past ${numberOfGames} games: ${wins}-${losses}-${otl}</div>`);
            }

            function displayError (error){
                alert(error.message);
            }

            function setOverlayProperties(){
                $overlay = $("<div><div>");
                $overlay.css({
                    "background": settings.overlay,
                    "opacity": "0.1",
                    "position": "relative",
                    "margin": settings.margin,
                    "top": "0px",
                    "left": "0px",
                    "display": "none",
                    "text-align": "center",
                    "width": settings.width,
                    "height": "50%",
                    "padding": settings.padding,
                    "border-radius": settings.borderRadius
                });
                $("body").append($overlay);
            }

            function setCloseButtonProperties(){
                let prop = {
                    "color": "white",
                    "cursor": "pointer",
                    "font-size": "20px",
                    "width": settings.closeButton.width,
                    "height": settings.closeButton.height,
                    "position": "absolute",
                    "top": "5px",
                    "right": "5px",
                    "border": "0px",
                    "z-index": "1",
                    "padding": "10px"
                }
                
                if(settings.closeButton.src){
                    $closeButton = $('<img>');
                    $closeButton.attr("src", settings.closeButton.src);
                } else {
                    $closeButton = $('<span>X</span>');
                }

                $closeButton.css(prop);
                $overlay.append($closeButton);
            }

            $closeButton.click(function() {
                $("#proceed").attr("disabled", false);
                if($.isFunction(settings.close)){
                    settings.close.call(this);
                }
                $overlay.animate({opacity:0.1}, function() {
                    $overlay.remove();      
                })
            });
        });
    }
}(jQuery));