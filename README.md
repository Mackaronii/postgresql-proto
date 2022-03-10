# postgresql-proto
## Background Steps
1. Create Github repo.
2. Create Heroku app.
3. Connect Heroku app with Github repo for CD under the Deploy tab.
4. Add Heroku Postgresql add-on under the Resources tab.
5. Write an sql file for the schema.
6. Run "heroku pg:psql --app <app_name> < <sql_file>" to load the schema.
7. Check schema using the Heroku CLI provided by the Heroku Postgresql app > Settings > View Credentials.
8. Create dataclips under the Dataclips tab of the Heroku Postgresql app to query data.


## Files

index.js contains the routing information (which queries are called and which views are rendered).

queries.js contains all the REST calls.

proto.sql contains the schema of the Heroku Postgresql database (idk if this should be on the repo, probably not).

The views folder contains all the .ejs files which use the data returned by queries to populate their HTML elements.
