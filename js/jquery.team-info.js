(function ($) {
    $.fn.teamInfoPopup = function(options){
        let settings = $.extend({
            // custom options available for the plugin
            overlay: 'rgba(0.5, 0.5, 0.5, 0.5)',
            width: "50%",
            borderRadius: "10px",
            padding: "5%",
            margin: "auto",
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
        }, options);

        // function that determines the primary color to be used based on the id of the team selected
        function getPrimaryColor() {
            let primaryColor = null;
            let id = $("#teamSelector").val()
            let teamColors = getColors();
            for (let team of teamColors) {
                if (team[0] == id) {
                    primaryColor = team[1];

                }
            }
            return primaryColor
        }

        // function that determines the secondary color to be used based on the id of the team selected
        function getSecondaryColor() {
            let secondaryColor = null;
            let id = $("#teamSelector").val();
            let teamColors = getColors();
            for (let team of teamColors) {
                if (team[0] == id) {
                    secondaryColor = team[2];
                }
            }
            return secondaryColor
        }

        // function that will retrieve all primary and secondary colors of the NHL teams
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
            displayTeamData();
            displayGameResults();

            $overlay.css({opacity: 0.1}).show().animate({opacity:1});
            $overlay.css("color", "white");
            initializeHeading();

            // click event handler for button
            $(this).find("#proceed").on("click", function(event) {
                event.preventDefault();

                if($.isFunction(settings.open)){
                    settings.open.call(this);
                }

                $overlay.css({opacity: 0.1}).show().animate({opacity:1});
            });

            // reset default css for ul
            $("ul").css({
                "margin": "0",
                "padding": "0"
            });

            // function used to initialze the heading. This section will display the team name, record and ranks
            function initializeHeading() {
                $overlay.append(`<ul id="scoresList"></ul>`)
                $("#scoresList").append(`<div style="margin:5px 5px 20px 5px"><table id="overlayTable"></table></div>`);
                $("#overlayTable").css({
                    "border-radius": "50px 50px 10px 10px",
                    "border-width": "3px 3px 10px 3px",
                    "text-align": "center",
                    "margin": "auto",
                    "table-layout": "fixed",
                    "border-style": "solid",
                    "width": "100%"
                })
                $("#overlayTable").append(`<tr style="width:100%"><th id="teamName" colspan="4"></th></tr>`);
                $("#teamName").css({
                    "color" : settings.teamName.fontColor,
                    "font-size": settings.teamName.fontSize
                });
            }

            // function that makes a json call to retrieve team stats from the NHL API
            async function getTeamData() {
                // build URL for API request
                let configuration = `/teams/`;
                let modifier = `/stats`;
                let teamID = $("#teamSelector").val();
                url = api + configuration + teamID + modifier;

                try{
                    const response = await fetch(url);
                    const json = await response.json();
                    return json
                } catch(e){
                    displayError(e)
                }
            }

            // function that retrieves and displays the team name and team record
            async function displayTeamData(){  
                const data = await getTeamData();
                let stats = data.stats[0].splits[0].stat;
                let selectedTeam = $("#teamSelector option:selected").text();
                $("#teamName").text(selectedTeam);
                $("#overlayTable").append(`<tr><td colspan=4 style="color:${settings.record.fontColor}; font-size:${settings.record.fontSize}">Record: ${stats.wins}-${stats.losses}-${stats.ot}</td></tr>`)
                getStandingsInfo();
            }

            // function used to grab and return the schedule info from the NHL API
            async function getScheduleInfo(){
                let id = $("#teamSelector").val();
                let season = `20212022`;
                let gameType = `R`;
                configuration = `/schedule?teamId=`;
                extension = `&season=${season}&gameType=${gameType}`;
                url = api + configuration + id + extension;

                try{
                    const response = await fetch(url);
                    const json = await response.json();
                    return json
                } catch(e){
                    displayError(e)
                }
            }

            // function used to get the end of game status (i.e. 3rd, OT, SO)
            async function getEndOfGamePeriod(date){
                let id = $("#teamSelector").val();
                configuration = `/schedule?teamId=`;
                extension = `&startDate=${date}&endDate=${date}&hydrate=team,linescore`;
                url = api + configuration + id + extension;
                try{
                    const response = await fetch(url);
                    const json = await response.json();
                    return json.dates[0].games[0].linescore.currentPeriodOrdinal;
                } catch(e){
                    displayError(e)
                }
            }

            // function that will grab the standings information for the selected team
            async function getStandingsInfo(){
                let id = $("#teamSelector").val();
                configuration = '/standings/'
                url = api + configuration;

                try{
                    const response = await fetch(url);
                    const json = await response.json();
                    displayStandingsInfo(json.records, id)
                } catch(e){
                    displayError(e)
                }
            }

            // function that will take the json information and display the selected team's divisional, conference and league rankings
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
                            // if team is found, break both loops
                            i = json.length;
                            break;
                        }
                    }
                }
                // display team rank info
                $("#overlayTable").append(`<tr><td colspan=4 style="color:${settings.rank.fontColor}; font-size:${settings.rank.fontSize}">League Rank: ${leagueStanding} | Conference Rank: ${conferenceStanding} | Division Rank: ${divisionalStanding}</td></tr>`)
            }  
            
            // function that will display the end of game status (i.e. OT or SO. Note, it will not display 3rd)
            async function displayEndOfGamePeriod(date, currentGame){
                const endPeriodOfGame = await getEndOfGamePeriod(date);

                // check to see which of the 5 games is being analyzed
                if(currentGame == 1){
                    // if the end period is not "3rd", display the SO or OT. Also changes display property to block (set to display none otherwise)
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

            // function that will determine the team's record over the past 5 games
            function getRecordOverLastFive(endRecord, startRecord){
                // object literal to hold the team record over the past 5 games
                const recordOverLast5 = {
                    wins: 0,
                    losses: 0,
                    otl: 0,
                }

                // assign values to object literal using values from API
                recordOverLast5.wins = endRecord.wins - startRecord.wins;
                recordOverLast5.losses = endRecord.losses - startRecord.losses;
                recordOverLast5.otl = endRecord.ot - startRecord.ot;

                // return object literal
                return recordOverLast5;
            }

            function displayRecordOverLastFive(recordOverLast5, numberOfGames){
                // display the selected team's win - loss - OT loss record
                $overlay.append(`<div id="lastFive">Record over past ${numberOfGames} games: ${recordOverLast5.wins}-${recordOverLast5.losses}-${recordOverLast5.otl}</div>`);
            }

            // function used to display the game results for the past 5 games of the selected team
            async function displayGameResults(){
                let id = $("#teamSelector").val()
                const data = await getScheduleInfo();
                let schedule = data.dates; // store array of dates to schedule
                let today = new Date(); // assign current date to today
                let counter = 0;
                
                // loop through each date in the schedule array to determine how many days back you need to go to get last 5 game results
                for (let day of schedule) {
                    // create date object using current date in loop
                    let dateOfGame = new Date(day["date"]);
                    dateOfGame.setDate(dateOfGame.getDate() + 1); // date conversion is off by one day. Therefore, we need to add an extra day
                    // if the date of the game is greater than or equal to the current date, stop the loop
                    if (dateOfGame >= today) {
                        break;
                    }
                    else {
                        // if less than, increment the counter
                        counter++;
                    }
                }

                let endRecord; // will hold json values for the end record (current)
                let startRecord; // will hold json values for the record at the beginning of the last 5 games (5 games ago)
                let numberOfGames = 5; // since the plugin only goes back 5 games, we set this value to 5 (potential to extend later)
                let gamesToCheck = numberOfGames; // assign the number of games to a loop control variable
                let i = counter; // create another "counter" that will use the same value of the counter retrieved earlier
                let currentGame = 1; // start the search at the most recent game (aka game 1)
                // loop through the schedule while there are still games that need to be checked. This will grab the results of the past 5
                // and will get the results of each one of those games
                while (gamesToCheck > 0) {
                    // if the game has been completed
                    if (schedule[i].games[0].status.abstractGameState == "Final") {
                        // if it is the first game to check (5 = 5), grab the end records for the team
                        if (gamesToCheck == numberOfGames) {
                            // if the away team's id in the game is equal to the id of the team selected by the user, grab the info for the away team
                            if (schedule[i].games[0].teams.away.team.id == id) {
                                endRecord = schedule[i].games[0].teams.away.leagueRecord;
                            } else { // if the home team's id in the game is equal to the id of the team selected by the user, grab the info for the home team
                                endRecord = schedule[i].games[0].teams.home.leagueRecord;
                            }
                        // if it is the last game to check (the 5th last game played)
                        } else if (gamesToCheck == 1) {
                            // if the team selected has the same id as the away team, grab the info for the away team
                            // need to grab record from the game before (the 6th previous game), as without, it will only show record at the end of the game
                            if (schedule[i - 1].games[0].teams.away.team.id == id) {
                                startRecord = schedule[i - 1].games[0].teams.away.leagueRecord;
                            } else { // if team id matches id of home team, grab home team info
                                startRecord = schedule[i - 1].games[0].teams.home.leagueRecord;
                            }
                        }
                        // array to hold month abbreviations
                        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
                        let gameDate = new Date(schedule[i]["date"]); // create date object using the date of the current game
                        gameDate.setDate(gameDate.getDate() + 1); // add one day to the game date to get correct date
                        let month = months[gameDate.getMonth()]; // find the corresponding month abbreviation to the game date

                        // grab information to load the team logos for the away team and home team for the current game
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

                        // append the information for the current game to the #scoreList container. This will include the team logos, the score, 
                        // the date and the end of game status.
                        $("#scoresList").append(
                        `<div class="scoreContainer">
                            <div class="scores" id="score${currentGame}">
                                <div class="date">
                                    ${month}. ${gameDate.getDate()}
                                </div>
                                <div class="teams">
                                    <table class="scoreTable">
                                        <tr>
                                            <td><img class="awayImage" src="images/${awayImage}.png"></td>
                                            <td>
                                                <div class="score"">${schedule[i].games[0].teams.away.score}</div>
                                            </td>
                                            <td style="color:${settings.status.fontColor}; font-size:${settings.status.fontSize}">
                                                Final
                                                <div class="gameStatus">
                                                    <div id="endPeriodGame${currentGame}"class="endPeriod" style="display: none; margin: auto"></div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="score"">${schedule[i].games[0].teams.home.score}</div>
                                            </td>
                                            <td><img class="homeImage" src="images/${homeImage}.png"></td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>`)

                        displayEndOfGamePeriod(schedule[i]["date"], currentGame);
                        currentGame++; // increment the current game
                        gamesToCheck--; // decrement the number of games left to check
                        i--; // decrement i (as you will be going back one less game)
                    } else {
                        // if a game is in progress on the current date, we would need to go back one game further to get the final game of the requested amount
                        // note, since you still need to check the same number of games, gamesToCheck counter will remain as is and will not decrease here.
                        i--;
                    }
                }
                // display the team record over past 5 games. This method will take the team record (retrieved by getRecordOverLastFive()) and numberOfGames as arguements
                displayRecordOverLastFive(getRecordOverLastFive(endRecord, startRecord), numberOfGames)      
                setStatsDisplayProperties();     
            }

            // function that will alert the user of an error if there is an issue with an API request
            function displayError (error){
                alert(error.message);
            }

            // function that sets up the properties of the overlay on which the team info / game stats are placed
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

            // function used to set up the css properties of all the elements that display team info and game results
            function setStatsDisplayProperties(){
                // set up css attributes to control the background and border-colors using the primary and secondary colors of the selected team
                $("#overlayTable").css({
                    "background": settings.gameResults.primaryColor,
                    "border-color": settings.gameResults.secondaryColor
                });
                
                $("#scoresList").css({
                    "width": "auto",
                    "display": "inline-block",
                    "justify-content": "center",
                    "margin": "0"
                });

                $(".scoreContainer").css({
                    "padding": "5px",
                    "margin": "0px 5px 20px 5px",
                    "width": "auto",
                    "border": "3px solid",
                    "border-radius": "25px",
                    "display": "flex",
                    "justify-content": "center",
                    "height": "175px",
                    "max-height": "150px",
                    "overflow": "hidden",
                    "background": settings.gameResults.primaryColor,
                    "border-color": settings.gameResults.secondaryColor
                });

                $(".scores").css({
                    "vertical-align": "middle",
                    "padding": "10px",
                    "margin": "auto",
                    "display": "flex",
                    "flex-direction": "column",
                    "height": "80%",
                    "overflow": "hidden"
                });

                $(".date").css({
                    "display":"table",
                    "float": "left",
                    "margin": "auto", 
                    "color": settings.date.fontColor,
                    "font-size": settings.date.fontSize
                });

                $(".teams").css({
                    "float": "left",
                    "margin": "auto",
                    "height": "100%",
                    "overflow": "hidden"
                });

                $(".score").css({
                    "float": "left",
                    "padding-right": "20px",
                    "margin": "auto",
                    "vertical-align": "middle",
                    "font-size": settings.score.fontSize,
                    "color": settings.score.fontColor,
                    "display": "table",
                    "table-layout": "fixed",
                    "width": "100%"
                });

                $(".homeImage, .awayImage").css({
                    "max-width": "100%",
                    "max-height": "95px"
                });

                $(".gameStatus").css({
                    "display": "table",
                    "margin": "auto",
                    "width": "100%",
                    "vertical-align": "middle",
                    "justify-content": "center"
                })

                $(".gameStatus div").css({
                    "display": "flex",
                    "width": "100%"
                });

                $(".final").css({
                    "margin": "auto"
                });

                $(".scoreTable").css({
                    "table-layout": "fixed",
                    "height": "100%",
                    "max-height": "112px",
                    "overflow": "hidden"
                });

                $(".scoreTable tr").css({
                    "display": "table",
                    "table-layout": "fixed",
                    "width": "100%",
                    "height": "100%",
                    "max-height":"112px",
                    "overflow": "hidden"
                });

                $(".endPeriod").css({
                    "color": settings.status.fontColor, 
                    "font-size": settings.status.fontSize
                });

                $("#lastFive").css({
                    "color": settings.recordLast5.fontColor,
                    "font-size": settings.recordLast5.fontSize,
                    "padding-top": "10px"
                });
            }

            // function that handles the css properties for the close button ("X")
            function setCloseButtonProperties(){
                $closeButton = $('<span>X</span>');
                let prop = {
                    "color": "white",
                    "cursor": "pointer",
                    "font-size": "20px",
                    "width": "30px",
                    "height": "30px",
                    "position": "absolute",
                    "top": "5px",
                    "right": "5px",
                    "border": "0px",
                    "z-index": "1",
                    "padding": "10px",
                    "font-size": "20px",
                    "text-shadow": "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
                }
                $closeButton.css(prop);
                $overlay.append($closeButton);
            }

            // click handler for the close button. This will re-enable the proceed button to allow user to select a different team.
            $closeButton.click(function() {
                $("#proceed").attr("disabled", false);
                $overlay.animate({opacity:0.1}, function() {
                    // remove the overlay from the screen and return to webpage
                    $overlay.remove();      
                })
            });
        });
    }
}(jQuery));