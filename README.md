# CP1291-CourseProject-JQueryPlugin Installation Guide
CP1291 (Advanced JavaScript) Course Project - JQuery Plugin - Hockey Stats

## Step 1:
  - Download the files in the git repo https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin</br>
  - Unzip the downloaded folder and add the following files to your existing website:</br>
      - [js/app.js](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/blob/main/js/app.js)
      - js/jquery-3.6.0-min.js
      - js/jquery.team-info.js
      - images/ (all images from the images folder)</br>
  - Note: it is important that you add all JavaScript files listed above to a directory called js/ and keep all the images in the images/ directory.</br>
  - If you would like to demo the plugin, you can simply launch the index.html file located in the downloaded zip file. This will make use of the css/style.css file</br>
    and the js/script.js, which are simple files used for demonstration purposes.</br>
  
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


