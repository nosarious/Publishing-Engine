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

Please see the pages portion of this git for more information on setting up the content of a publication.
