
#!/usr/bin/env bash

#
# Use this script to reset the database.
# Edit .env in /backend to decide which database to reset.
# Choose between local and offical one at Atlas.
#

node "db/delete_tickets.js"