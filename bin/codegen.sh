#!/bin/sh

set -e

for resource in coaches comments reviews recordings users; do
  docker run --rm --net=host -v /workspaces/ranklab-web:/local swaggerapi/swagger-codegen-cli-v3 generate \
      -i http://localhost:8000/$resource/openapi.json \
      -l typescript-axios \
      -o /local/src/api
done
