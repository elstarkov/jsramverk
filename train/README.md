
# Welcome to our project for the BTH course "JSRAMVERK".

In this repo we will re-work a slightly broken app and hopefully add
some new features.

The repo handles train delays in Sweden. Train data is fetched from
Trafikverket with an API.


## Work flow

Here we will describe what we are doing and how.
------------------------------------------------------------------------------

To start with we created a user at www.trafiklab.se. From there we got an
API-key which could be used to fetch the train data. In the next step we store
the key in a variable and place it inside the question we are sending to the api.
We do this in every model that needs a key to fetch data.

Next step is to start the app and see how it went. In our Unix terminal, we type
"nodemon app.js" while standing in "train/backend" to start backend and
we use "python3 -m http.server 9000" in "train/frontend" to start up the frontend.

We then head to localhost:9000. It works. We can see the delays but we can't add
any error messages (tickets) for different trains. We need to set up the database
that stores this information.

To do that we need to create a table by running the "migrate.sql" file in
backend/db. In a Unix terminal we use the command "cat migrate.sql | sqlite3 trains.sqlite"
to use the content of migrate.sql to run with the trains.sqlite-database. We can now
add error messages to trains that explains why the are delayed.

If we, for any reason, want to reset our database we run the reset_db.bash file.
First we need to make the file executable by running "chmod 755". Then we can execute
the file from train/backend with "bash db/reset_db.bash". This will erase all
error messages and restore the database to default.

## Work choices

What techniques are we using and why?
-------------------------------------------------------------------------------

## NPM package security

How are we handling npm packages in terms of security?
--------------------------------------------------------------------------------