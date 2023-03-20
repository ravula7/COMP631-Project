#!/bin/bash

PROJECT=project631-379216
ARTIFACT_REPO=us-central1-docker.pkg.dev/project631-379216/server

# docker build -t nginx-server .
cd .. && cd server
gcloud --credential-file-override=../keys/admin.json builds submit --project $PROJECT --region=us-central1 --tag $ARTIFACT_REPO/build:latest .

# docker build -t us-central1-docker.pkg.dev/$PROJECT/server/build:latest .
# docker push us-central1-docker.pkg.dev/$PROJECT/server/build:latest

docker pull us-central1-docker.pkg.dev/project631-379216/server/build:latest


# gcloud --project lets-whirl-dev run deploy ${SERVICE}-service --image us-central1-docker.pkg.dev/lets-whirl-dev/${SERVICE}/build:latest --platform managed --region us-central1