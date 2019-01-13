# Mobile Web Specialist Certification Course

---

#### _Three Stage Course Material Project - Restaurant Reviews_

## Table of Contents

- [Instructions](#instructions)
- [Development Journal/Thought](#dev)
- [TODO](#todo)
- [References](#references)

## Instructions

1. git clone repo-> https://github.com/kamsiuman/mws-restaurant-stage-1-google-maps.git
2. In a terminal, spin up the server with `python -m SimpleHTTPServer 8000` or `python -m http.server 8000`
   IMPORTMANT : if you see the server-worker error : plesae update the server.py and add the new mimetype : '.js': 'application/javascript' .. for details. please reference the known-issue below

3. browser the index.html

## Development Journal/Thought

[2019.01.01]

1. fetch down the repo. review all the project requirement
2. decide to use the google API
3. acquire the valid map key and update both index.html and restaurant.html
4. able to start the local web server (python script) and serve up the site !!

reference : https://www.youtube.com/watch?v=lE6Y6M9xPLw

[2019.01.06]

1. watch the following information
2. decide to use the google API
3. acquire the valid map key and update both index.html and restaurant.html

reference : https://www.youtube.com/watch?v=tyVQW2PkFk4

[2019.01.08]

1. researching the respondsive style (look at the moble-first) and playing with the chrome debugger.. the css...

note :
-- the reason why the resturant tile is fix width is because the width is fix "Restaurant Listing" which the width is set to "270px;"
-- restaurants-list => flex-wrap: wrap; (important)
-- decide the split into 2 css files.. one for index and one for resturant. the reasons is I cannot find a better way to use the @media query to control different elements from diff files..also looks unorganize.

reference : https://www.youtube.com/watch?v=tyVQW2PkFk4

[2019.01.09] - accessability

1. impleement the tab with tab-index (index, the resturant cab with tabindex 3)
2. add the image-alt tag in the creatResturantHTML

note :
-- the reason why the resturant tile is fix width is because the width is fix "Restaurant Listing" which the width is set to "270px;"
-- restaurants-list => flex-wrap: wrap; (important)
-- decide the split into 2 css files.. one for index and one for resturant. the reasons is I cannot find a better way to use the @media query to control different elements from diff files..also looks unorganize.

[2019.01.11]

1. fix the respondsive on the resturant page
1. fix the @media query by adding the meta tag in the html

## TODO

1. would like to add more oprtion feature when the time is permitted
2. fix the naming convention.
3. more to come!

[2019.01.12] - service-workers

1. add aria-label="select cuisine" to the selection-filter in the index.html
2. watching video : Intro To Service Workers & Caching

reference : https://matthewcranford.com/restaurant-reviews-app-walkthrough-part-4-service-workers/
reference : https://www.youtube.com/watch?v=ksXwaWHCW6k

## known-issue

Problem 1 :
service-worker failed to registration => "The script has an unsupported MIME type ('text/plain').Failed to load resource: net::ERR_INSECURE_RESPONSEmain.js:18 Service Worker Not registeredDOMException: Failed to register a ServiceWorker: The script has an unsupported MIME type ('text/plain')."
. able to register the srevice work as I am facing the error

solution : update the server.py and add the new mimetype : '.js': 'application/javascript'

Reference : https://knowledge.udacity.com/questions/6687

## TODO

1. would like to add more oprtion feature when the time is permitted
2. fix the naming convention.
3. more to come!

## References

1. https://www.diigo.com/outliner/fjslyn/Udacity-Restaurant-Reviews-App-(project-%235)?key=zqiopam1yz
2. (**good**) https://www.youtube.com/watch?v=tyVQW2PkFk4&feature=youtu.be
3. (**good**) https://alexandroperez.github.io/mws-walkthrough/?1.1.introduction
