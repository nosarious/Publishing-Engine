Publishing-Engine
=================

This collection of files is a prototype for a publishing engine that allows the creation of web pages that behave as magazines on touch and desktop devices.

This collection includes the following files for doing the work:

jpageMove - a jquery function for creating a table of contents from informaiton within specific classes, handling button cicks for the table of contents, touch events for those contents, and clicks for next/prev page buttons.

jpulldown - a jquery function which handles the pulling down of a menu which displays a page with the table of contents. This is a 'live' event so you click to open or click-drag to open. It updates it's location with your finger or mouse.

jscrollslide - a jquery function which handles vertical scrolling for different pages as well as side-to-side scrolling. This is the most complicated script and requires some fine tuning for speed of initial interaction.

resizer - a jquery function which handles resizing events for the various elements on the page, as well as the recentering or reconfiguring of all images used in the backgrounds. It also needs some fine-tuning.

script - the main script to initialize the page and organize events. It contains several functions which are used throughout the jquery functions.

This collection is reliant on several important files to work.

A css file with specifically named elements for limited layout design. This file includes several font-face references so their associated files are necessary as well.

An html page which has the core articles used in the publication. Images referenced within are also needed

An adaptive images file for resizing images based on device sizes, as well as a cache manifest file for storing information that can be read offline when there is no internet access.

This collection uses the html5 boilerplate with some modifications for use.

A Typical Article
=================
This document consists of several articles which have classes to identify certain characteristics. You may not want every single page in your document to have a button in the table of contents, for instance. Most magazines only use the first page of an article for the table of contents. In this project the "descriptor" class identifies the title and potential subtitle which will show up on the contents button. This is one of the first things placed within the structure of an article.
The "backdrop" class contains the information for the image which will be used within the page. The <img> itself gets the classes for placement on the page, such as <img src="photos/014.jpg" class="leftImage bottomImage"> If you do not identify an image, whatever background color or texture has been identified in the css file will be used instead.

resizer.js
==========
Resizer is a plugin which reformats the image used as a backdrop for a page of the publication. Portrait images on a landscape page will be full width. Landscape images on a portrait page will be full height. Images can also be 'locked' to a side so they can extend from one pageto another. 
Images are centered vertically on the page by default, but adding the class "bottomImage" will lock the bottom of the image to the base of the page, and "topImage" will keep the top of the image at the top of the page. 
Images are centered horizontally on the page by default. Adding the "leftImage" class means the right hand side of the image will be locked to the right hand side of the mage. Adding "rightImage" means the left hand side will be locked in place. Their naming implies you will have a seamless image between two pages, but that is not required.


