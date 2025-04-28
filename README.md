Welcome To Travel Tracker:

This is a small duo project meant as the capstone for a web development program at Coding Dojo

Github Link: https://github.com/jflehew/travel_tracker

This project is a collaboration between Nathan Taylor and John Lehew

Project Features:
    1. Styling done using css framework TailwindCSS
    2. Server created using Java and Spring Boot ORM
    3. Client created using Javascript and React library
    4. Connectiong to the London Underground public API
        a. the api will be used to pull location, departure times, arrival times, and underground train status
        b. api will fill out information for the user to add a commute to the database. 
    5. display of database info on dashboard will be split into current commute, past commute, and future commutes
    6. users will have full CRUD capabilities over future commutes, and the DELETE feature for past commutes.
    7. a view page to view all the info for a users commute. 
    8. full user authentication via SpringBoot session and Reacts useContext.
    9. validations for all user registration and database updates and additions

Nathon Taylor responsibilities:
    1. Server setup
    2. models and mysql database utilization
    3. controllers for full CRUD
    4. back end validations for full CRUD
    5  Updating the database based on information sent from the front end
    6. API authorization and API calls on the backend
    7. setting up session to be utilized by the front end for user authentication

John Lehew responsibilities:
    1. Client setup
    2. styling by CSSTailwin
    3. pulling data from London Underground API and autofilling form data with the necessary information
    4. sending all form data to the server to process for the database.
    5. front end validations for all information
    6. connecting react to a spring boot server
    7. all view components. 
