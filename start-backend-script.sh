#!/bin/bash

docker compose -f docker-compose.dev.yml up -d postgres

docker compose -f docker-compose.dev.yml run --rm migrate

docker compose -f docker-compose.dev.yml up -d backend