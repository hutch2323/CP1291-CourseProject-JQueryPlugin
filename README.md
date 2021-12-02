# CP1291-CourseProject-JQueryPlugin Installation Guide
CP1291 (Advanced JavaScript) Course Project - JQuery Plugin - Hockey Stats

## Description:
This plugin was designed as the course project of CP1291: Advanced JavaScript. By implementing this plugin on your website, it will gain the ability to display the team name, record, rank (league, conference, division) and the results from the past 5 games played for any given NHL team, as selected using a drop-down list. On the click of a button, an overlay will pop up, containing all the previously mentioned information as well as the team's record over those five games.

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
If you would like to customize the popup overlay, you may do so in js/app.js. As seen in the following snippet of code, there are a variety of customizable options, which include:

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


### Team Name (teamName), Record (record), Rank (rank) 
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
- fontSize (this will control the size of the font of each of the Team Name, Record and Rank)
- fontColor (the color of the font)











- Game Results (gameResults - this will control the color scheme for the popup content)
    - primaryColor (this will be the background color for the game results as well as the team name header)
    - secondaryColor (this will be the border color for the game results as well as the team name header)
- Score (score)
    - fontSize
    - fontColor
- Status (status)
    - fontSize
    - fontColor
- Date (date)
    - fontSize
    - fontColor
- Record Over Last 5 Games (recordLast5)
    - fontSize
    - fontColor
 
    
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





![dropDown](https://user-images.githubusercontent.com/59344045/144517115-2f542574-65db-4e44-8d3e-6afa1fcd68b1.png)

