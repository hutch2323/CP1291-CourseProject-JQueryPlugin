# CP1291-CourseProject-JQueryPlugin Installation Guide
CP1291 (Advanced JavaScript) Course Project - JQuery Plugin - Hockey Stats

## Description:
This plugin was designed as the course project of CP1291: Advanced JavaScript. By implementing this plugin on your website, it will gain the ability to display the team name, record, rank (league, conference, division) and the results from the past 5 games played for any given NHL team, as selected using a drop-down list. On the click of a button, an overlay will pop up, containing all the previously mentioned information as well as the team's record over those five games, using today's date as the reference point.

# Installation
## Step 1:
- Download the files in the git repo https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin
- Unzip the downloaded folder and add the following files to your existing website:
    - [js/app.js](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/blob/main/js/app.js)
    - [js/jquery-3.6.0-min.js](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/blob/main/js/jquery-3.6.0-min.js)
    - [js/jquery.team-info.js](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/blob/main/js/jquery.team-info.js)
    - [images/](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/tree/main/images) (all images from the images folder)
- Note: it is important that you add all JavaScript files listed above to a directory called js/ and keep all the images in the images/ directory.
- If you would like to demo the plugin, you can simply launch [index.html](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/blob/main/index.html) in your default browser. This file will be located in the downloaded zip file. The demo will also make use of the [css/style.css](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/blob/main/css/style.css) and [js/script.js](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/blob/main/js/script.js), which are simple files used for demonstration purposes.
  
## Step 2:
Add the following script tags to your HTML file:
```html
<script src="js/jquery-3.6.0-min.js" type="text/javascript"></script>
<!-- YOUR JS FILE GOES HERE -->
<script src="js/jquery.team-info.js" type="text/javascript"></script>
<script src="js/app.js" type="text/javascript"></script>
```

Add the following HTML tags to your HTML file:
```html
<div id="teamStats">
  <label for="teamName">Team Name:</label>
  <select id ="teamSelector"></select>
  <input type="button" id="proceed" value="Proceed">
</div>
```

## Step 3:
Inside of your JavaScript file, add the following code:
```js
$(document).ready( () => {

    initializeDropDown();

});
```
This step is crutial to initializing the <select></select> drop-down list. Note: If using the /script.js file provided, this step is not necessary.

## Step 4:
If you would like to customize the popup overlay, you may do so in js/app.js. However, before customizing, you should first review the following options:

### Popup Overlay:
```js
(function ($) {
    $.fn.teamInfoPopup = function(options){
        let settings = $.extend({
            // custom options available for the plugin
            overlay: 'rgba(0.5, 0.5, 0.5, 0.5)',
            width: "50%",
            borderRadius: "10px",
            padding: "5%",
            margin: "auto",
```
- **overlay** - the background color of the overlay
- **width** - the width of the popup overlay
- **borderRadius** - the border-radius
- **padding** - the padding of the popup
- **margin** - this will control where the popup appears. To keep it centered, keep it auto


### Team Name (teamName), Record (record), Rank (rank):
![teamNameHeader](https://user-images.githubusercontent.com/59344045/144520471-2420275f-6424-4e18-a907-f90d234c768e.png)
```js
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
```
The settings will affect the font size and color of the image seen above.
- fontSize (this will control the size of the font of each of the Team Name, Record and Rank)
- fontColor (the color of the font)

### Game Results (gameResults)
![gameResult](https://user-images.githubusercontent.com/59344045/144538216-2eab82fa-4381-4e76-b5c6-518d6657b413.png)
```js
    gameResults: {
        primaryColor: getPrimaryColor(),
        secondaryColor: getSecondaryColor(),
    },
```
These settings will affect the background color and boarder color of the game results, as well as the team information header seen in the previous step. The primary color serves as the background while the secondary color of the selected team will be used as the boarder color.
- primaryColor (this will be the background color for the game results as well as the team name header)
- secondaryColor (this will be the border color for the game results as well as the team name header)

### Score (score), Status (status), Date (date):
![gameResultScore](https://user-images.githubusercontent.com/59344045/144539152-7dbfd261-be6e-480b-9076-42bd33266aa5.png)
```js
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
```
The settings will affect the font size and color of the score (the actual number score for each team), the status (Final / Final OT / Final S/O), the date (i.e Dec. 1). These elements can be seen in the image shown above.
- fontSize
- fontColor

### Record Over Last 5 Games (recordLast5):
![recordOverLast5](https://user-images.githubusercontent.com/59344045/144540089-c2bf60d2-69f4-4d32-b0ee-9c9cf0ff1762.png)
```js
    recordLast5:{
        fontSize: "16px",
        fontColor: "#FFFFFF"
    },
```
These settings will control the font size and color of the team's record over the last 5 games. This is located under the last game score in the popup.
- fontSize
- fontColor
 
## Step 5:
Now that the options have been explained, we can move into implementing custom options. It is recommended that you use the default settings, as a combination of setting changes could affect the appearance of the popup overlay. Below is the click function for the Proceed button (located in js/app.js), which will also initiate the function contained within the plugin file (js/jquery.team-info.js). As the function is called, a series of customizable options can be passed in, which become settings as the popup overlay generates. In this snippet, each option is commented out, but can be easily accessed by removing the comments.
```js
$("#proceed").click( () =>  {
    $("#proceed").attr("disabled", true);
    $(this).teamInfoPopup({
    //  margin: "0px",
    //  width: "50%",
    //  borderRadius: "10px",
    //  padding: "5%",
    //  margin: "auto",
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
```
** Note: The other function located in js/app.js, initializeDropDown(), is required for initializing the values of the drop-down list on the webpage. If you remove this method or fail to call it in your JavaScript file, the drop-down list will not populate. **
```js
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
```
# Using The Plugin
Now that the plugin has been installed and customized, it's time to learn how to use it.

## Step 1:
The first step in using the plugin is to select one of 32 NHL teams from the drop-down list that was created when the webpage was loaded.
![dropDownOnly](https://user-images.githubusercontent.com/59344045/144541716-f70608e7-ccc3-4d9d-a8e0-258a9d1dc0b3.png)
The first step in using the plugin is to select one of 32 NHL teams from the drop-down list that was created when the webpage was loaded.

## Step 2:


