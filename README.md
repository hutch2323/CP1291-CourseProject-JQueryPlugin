# CP1291-CourseProject-JQueryPlugin Installation Guide
CP1291 (Advanced JavaScript) Course Project - JQuery Plugin - Hockey Stats

## Step 1:
- Download the files in the git repo https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin
- Unzip the downloaded folder and add the following files to your existing website:
    - [js/app.js](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/blob/main/js/app.js)
    - [js/jquery-3.6.0-min.js](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/blob/main/js/jquery-3.6.0-min.js)
    - [js/jquery.team-info.js](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/blob/main/js/jquery.team-info.js)
    - [images/](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/tree/main/images) (all images from the images folder)
- Note: it is important that you add all JavaScript files listed above to a directory called js/ and keep all the images in the images/ directory.
- If you would like to demo the plugin, you can simply launch the [index.html](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/blob/main/index.html) file located in the downloaded zip file. This will make use of the [css/style.css](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/blob/main/css/style.css) and [js/script.js](https://github.com/hutch2323/CP1291-CourseProject-JQueryPlugin/blob/main/js/script.js), which are simple files used for demonstration purposes.
  
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

