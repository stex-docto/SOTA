# Firebase

## Project set-up (do it once)
1. Create a Firebase project
1. Add a web application, copy credential
1. Activate anonymous users
1. Activate mail users
1. Add 2 Firebase firestore: `prod` and `dev`

## Push firebase modification
1. Login with firebase-tools CLI
   ```
   docker compose run --rm firebase-tools firebase login --no-localhost
   ```
1. List your projects
   ```
   docker compose run --rm firebase-tools firebase projects:list
   ```
1. Deploy firebase
   ```
   docker compose run --rm --workdir "/firebase" firebase-tools firebase deploy
   ```