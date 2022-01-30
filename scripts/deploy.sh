#!/bin/bash
SERVER_SERVICE=budget.service

# rebuild
npm run bootstrap
npm run build

# restart server
systemctl restart $SERVER_SERVICE
