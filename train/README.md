
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

## NPM audit

We ran the npm audit command to ensure we did not have any vulnerabilities in our project.
The audit command found 11 vulnerabilities, 3 moderate and 8 high risk.
We managed to resolve the vulnerabilities by updating our packages with npm update.

Below are the vulnerabilities:

#### debug  <=2.6.8
debug Inefficient Regular Expression Complexity vulnerability - [https://github.com/advisories/GHSA-9vvw-cc9w-f27h](https://github.com/advisories/GHSA-9vvw-cc9w-f27h)
Regular Expression Denial of Service in debug - [https://github.com/advisories/GHSA-gxpj-cx7g-858c](https://github.com/advisories/GHSA-gxpj-cx7g-858c)
Depends on vulnerable versions of ms

#### fresh  <0.5.2
Regular Expression Denial of Service in fresh - [https://github.com/advisories/GHSA-9qj9-36jm-prpv](https://github.com/advisories/GHSA-9qj9-36jm-prpv)

#### mime  <1.4.1
mime Regular Expression Denial of Service when mime lookup performed on untrusted user input - [https://github.com/advisories/GHSA-wrvr-8mpx-r7pp](https://github.com/advisories/GHSA-wrvr-8mpx-r7pp)

#### ms  <2.0.0
Vercel ms Inefficient Regular Expression Complexity vulnerability - [https://github.com/advisories/GHSA-w9mr-4mfr-499f](https://github.com/advisories/GHSA-w9mr-4mfr-499f)

#### node-fetch  <2.6.7
node-fetch is vulnerable to Exposure of Sensitive Information to an Unauthorized Actor - [https://github.com/advisories/GHSA-r683-j2x4-v87g](https://github.com/advisories/GHSA-r683-j2x4-v87g)

#### qs  <=6.2.3
Prototype Pollution Protection Bypass in qs - [https://github.com/advisories/GHSA-gqgv-6jq5-jjj9](https://github.com/advisories/GHSA-gqgv-6jq5-jjj9)
qs vulnerable to Prototype Pollution - [https://github.com/advisories/GHSA-hrpp-h998-j3pp](https://github.com/advisories/GHSA-hrpp-h998-j3pp)

#### semver  6.0.0 - 6.3.0 || 7.0.0 - 7.5.1
semver vulnerable to Regular Expression Denial of Service - [https://github.com/advisories/GHSA-c2qf-rxjj-qqgw](https://github.com/advisories/GHSA-c2qf-rxjj-qqgw)


How are we handling npm packages in terms of security?
--------------------------------------------------------------------------------
We always try our best to keep our package list up to date to avoid vulnerabilities.
