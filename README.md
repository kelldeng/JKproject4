# MyPathFinder

A web app that helps business students explore majors and careers. Users take a short personality quiz, see their results, get recommended Fox School of Business majors, and can search career data from O\*NET.

Built as a college project at Temple University by [kelldeng](https://github.com/kelldeng) and [jingwenlin123](https://github.com/jingwenlin123), April to May 2023.

## Features

- **Accounts:** sign up and log in, with form validation for required fields and password rules
- **Personality quiz:** the 10-question Ten-Item Personality Inventory (TIPI), rated from 1 to 7
- **Scoring:** reverse-codes the even-numbered answers, averages them into the Big Five traits, and builds a four-letter personality type
- **Results chart:** shows the five trait scores as a bar chart
- **Major recommendations:** lists 3 recommended Fox School majors with links
- **Career search:** keyword search using the O\*NET Web Services API

## Built with

- JavaScript, jQuery, HTML, CSS, and Bootstrap
- Chart.js for the results chart
- O\*NET Web Services for career data
- A separate AWS-hosted backend API for accounts, quiz results, and recommendations (not included in this repository)

## Project structure

    index.html              Page layout and views
    css/app.css             Styles
    js/app.js               Accounts, quiz scoring, results, and recommendations
    js/OnetWebService.js    Requests to O*NET Web Services
    js/keyword_search.js    Career keyword search
    images/                 Logo and images

## Notes

- The four-letter personality type comes from this project's own simplified logic. It is not part of TIPI and is not a validated assessment.
- The career search asks for an O\*NET Web Services username, which requires a registered O\*NET account.
- This was a class project and is no longer maintained, so the backend and O\*NET connection may no longer work.
