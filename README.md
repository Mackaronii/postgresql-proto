# postgresql-proto
## Background Steps
1. Create Github repository.
2. Create Heroku app.
3. Connect Heroku app with Github repo for CD under the Deploy tab.
4. Add Heroku Postgresql add-on under the Resources tab.
5. Write an sql file for the schema.
6. Run ```heroku pg:psql --app <app_name> < <sql_file>``` to load the schema.
7. Check schema using the Heroku CLI provided by the Heroku Postgresql app > Settings > View Credentials.
8. Create dataclips under the Dataclips tab of the Heroku Postgresql app to query data.


## How to Run Locally
1. Clone this repository.
2. Run ```npm install``` to pull the dependencies.
3. Create a ```.env``` file to contain the Heroku app's ```DATABASE_URL``` configuration variable under the Settings tab.
4. Ensure Postgres is installed on your machine and added to your system environment variables.
5. Log into Heroku using the Heroku CLI ```heroku login```.
6. Run ```npm run watch```.
7. The app should now be listening on port 8000.


## Files

```index.js``` contains the routing information (which queries are called and which views are rendered).

```queries.js``` contains all the REST calls.

```proto.sql``` contains the schema of the Heroku Postgresql database.

The ```views``` folder contains all the .ejs files which use the data returned by queries to populate their HTML elements.
