(function ($) {
    $.fn.teamInfoPopup = function(options){
        let settings = $.extend({
            overlay: 'rgba(0, 0, 0, 0.5)',
            closeButton: {
                src: null,
                witdh: "30px",
                height: "30px"
            },
            imageBorder: "5px solid #ffffff",
            borderRadius: "5px",
            imageWidth: "500px",
            imageHeight: "400px",
            imageCaption: {
                exist: true,
                color: "#ffffff",
                fontSize: "20px"
            },
            open: null,
            close: null,
            api: `https://statsapi.web.nhl.com/api/v1`,
            //teamID: $("#teamSelector").val(),
        }, options);


        /**
         * Iterating through each image gallery
         */
        return this.each(function(){
            /**
             * Declaring new element(s) variables
             */
            let $overlay, $closeButton//, $image, $imageCaption;
            setOverlayProperties();
            setCloseButtonProperties();
            //setImageProperties();
            getTeamData();
            getScheduleInfo();
            console.log("Image Width: " + settings.imageWidth);

            $overlay.css({opacity: 0.1}).show().animate({opacity:1});
            $overlay.css("color", "white");
            $overlay.append(`<table id="overlayTable" style="text-align:center; margin:auto; table-layout:fixed; width:100%"></table>`)
            $("#overlayTable").append(`<tr style="width:100%"><th id="teamName" colspan="4"></th></tr>`);
            // $overlay.append(`<ul id="scoresList"><div id="score1" class="scores"></div><div id="score2" class="scores"></div>
            // <div id="score3" class="scores"></div><div id="score4", class="scores"></div><div id="score5", class="scores"></div><ul>`)
            $overlay.append(`<ul id="scoresList"></ul`)
            $(this).find("#proceed").on("click", function(event) {
                event.preventDefault();
                //$image.attr("src", imageSource);
                
                // if(settings.imageCaption.exist == true){
                //     let caption = $(this).children("img").attr("alt");
                //     $imageCaption.text(caption);
                // }

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
                //const request = `?api_key=DEMO_KEY&date=${dateStr}`;
                url = settings.api + configuration + teamID + modifier;
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
                // $("#response").append("Team: " + $("#teamSelector option:selected").text());
                // $("#response").append("</br>Games Played: " + stats.gamesPlayed);
                // $("#response").append(". Record: " + stats.wins + "-" + stats.losses + "-" + stats.ot);
                let selectedTeam = $("#teamSelector option:selected").text();
                //$("#overlayTable").append(`<tr style="width:100%"><th id="teamName" colspan="4">${selectedTeam}</th></tr>`);
                $("#teamName").text(selectedTeam);
                //$overlay.append("</br>Games Played: " + stats.gamesPlayed);
                $("#overlayTable").append(`<tr><td colspan=4>Games Played: ${stats.gamesPlayed}</td></tr>`)
                //$overlay.append(". Record: " + stats.wins + "-" + stats.losses + "-" + stats.ot);
                $("#overlayTable").append(`<tr><td colspan=4>Record: ${stats.wins}-${stats.losses}-${stats.ot}</td></tr>`)
            }

            function getScheduleInfo(){
                let id = $("#teamSelector").val();
                let season = `20212022`
                let gameType = `R`
                configuration = `/schedule?teamId=`
                extension = `&season=${season}&gameType=${gameType}`;
                url = settings.api + configuration + id + extension;
                fetch(url)
                    .then(response => response.json())
                    .then(json => displayScheduleInfo(json, id))
                    .catch(e => displayError(e));
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
                $overlay.append("</br></br>" + "Last " + numberOfGames + " Games:");
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
                        //$("#response").append("</br>" + schedule[i]["date"] + ": " + schedule[i].games[0].teams.away.team.name + " " + schedule[i].games[0].teams.away.score + " vs " + schedule[i].games[0].teams.home.team.name + " " + schedule[i].games[0].teams.home.score);
                        //$("#overlayTable").append(`<tr><td colspan="4">${schedule[i]["date"]}</td></tr>`);
                        //$("#overlayTable").append(`<tr><td>${schedule[i].games[0].teams.away.team.name}</td><td>${schedule[i].games[0].teams.away.score}</td><td>${schedule[i].games[0].teams.home.score}</td><td>${schedule[i].games[0].teams.home.team.name}</td></tr>`);
                        //$("#overlayTable").append(`<tr><td colspan="4">--------------------------------------------------</td></tr>`);
                        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
                        let gameDate = new Date(schedule[i]["date"]);
                        gameDate.setDate(gameDate.getDate() + 1);
                        let month = months[gameDate.getMonth()];
                        $("#scoresList").append(
                        `<div class="scoreContainer">
                            <div class="scores" id="score${i+1}">
                                <div class="date">
                                    ${month}<br>
                                    ${gameDate.getDate()}
                                </div>
                                <div class="teams">
                                    <div class="team1">${schedule[i].games[0].teams.away.team.name}</div>
                                    <div class="team2">${schedule[i].games[0].teams.home.team.name}</div>
                                </div>
                                <div class="score">
                                    <div class="score1">${schedule[i].games[0].teams.away.score}</div>
                                    <div class="score2">${schedule[i].games[0].teams.home.score}</div>
                            </div>
                        </div>`)
                        //$overlay.append("</br>" + schedule[i]["date"] + ": " + schedule[i].games[0].teams.away.team.name + " " + schedule[i].games[0].teams.away.score + " vs " + schedule[i].games[0].teams.home.team.name + " " + schedule[i].games[0].teams.home.score);
                        // gameIDs[gameIDs.length] = schedule[i].games[0]["gamePk"];
                        gamesToCheck--;
                        i--;
                    } else {
                        // if a game is in progress on the current date, we would need to go back one game further to get the final game of the requested amount
                        gameInProgress = true;
                        //console.log("infinite loop");
                        console.log(schedule[i]["date"] + ": " + schedule[i].games[0].teams.away.team.name + " " + schedule[i].games[0].teams.away.score + " vs " + schedule[i].games[0].teams.home.team.name + " " + schedule[i].games[0].teams.home.score + " (Game in progress)");
                        i--;
                        //gamesToCheck++;
                    }
                }
                let wins = record.endingRecord.wins - record.startingRecord.wins;
                let losses = record.endingRecord.losses - record.startingRecord.losses;
                let otl = record.endingRecord.otl - record.startingRecord.otl;
                console.log("Record over past " + numberOfGames + " games: " + wins + "-" + losses + "-" + otl);
                $overlay.append("</br>" + "Record over past " + numberOfGames + " games: " + wins + "-" + losses + "-" + otl);
                //$("#response").append("</br>" + "Record over past " + numberOfGames + " games: " + wins + "-" + losses + "-" + otl);
            }

            function displayError (error){
                alert(error.message);
            }

            // function setImageProperties() {
            //     $image = $('<img>');
            //     $image.css({
            //         "width": settings.imageWidth,
            //         "height": settings.imageHeight,
            //         "border": settings.imageBorder,
            //         "border-radius": settings.borderRadius
            //     });

            //     $overlay.append($image);

            //     if(settings.imageCaption.exist == true){
            //         $imageCaption = $("<p></p>");
            //         $imageCaption.css( {
            //             "color": settings.imageCaption.color,
            //             "font-size": settings.imageCaption.fontSize
            //         });
            //         $overlay.append($imageCaption);
            //     }
            // }

            function setOverlayProperties(){
                $overlay = $("<div><div>");
                $overlay.css({
                    "background": settings.overlay,
                    "position": "relative",
                    "margin": "auto",
                    "top": "0px",
                    "left": "0px",
                    "display": "none",
                    "text-align": "center",
                    "width": "50%",
                    "height": "50%",
                    "padding": "5%"
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
                    "z-index": "1"
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
                    //$overlay.hide();
                    $overlay.remove();      
                })
            });
        });
    }
}(jQuery));