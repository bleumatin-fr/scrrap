# DEPLOYMENT

Deployment works with docker. The image is built then pushed on a registry, the server then fetches that image through docker-compose to run the app.

Per-commit images are stored on registry.bleumatin.fr and tagged commits push the image to ghcr.io

## Build

```bash
docker build --no-cache --tag [registry]/[image]:[tag] .
```

## Publish

```bash
docker push [registry]/[image]:[tag]
```

## First installation

For the first installation, you need to initialize a docker-compose file with all environment variables set.
An example is available in `.deployment/docker-compose.yml`.

By default, the app will be served on port 3000 but will work if mapped to any other port with docker.

### Environment variables

Environment variables prefixed with
- `FRONT_` are only injected into public front-end.
- `ADMIN_` are only injected into private administration front-end.
- every other variables are available to the back-end

#### Front-End

##### FRONT_FRONT_URL

Address of the public website from the point of view of the browser of the user

ex : `https://chuto.talm.fr/scrrap`

##### FRONT_API_URL

Address of the API root from the point of view of the browser of the user

ex : `https://chuto.talm.fr/scrrap/api`

#### Admin

##### ADMIN_AUTH_API_URL

Address of the authentication API URL from the point of view of the browser of the user

ex : `https://chuto.talm.fr/scrrap/api/authentication`

##### ADMIN_FRONT_URL

Address of the public front-end from the point of view of the browser of the user

ex : `https://chuto.talm.fr/scrrap`

##### ADMIN_API_URL

Address of the admin API root from the point of view of the browser of the user

ex : `https://chuto.talm.fr/scrrap/admin/api`

##### ADMIN_DOCUMENTSERVER_URL

Address of the documentserver from the point of view of the browser of the user

ex : `https://chuto.talm.fr/scrrap/docs`

#### API


##### PORT

Port the server runs on (API + Front + Admin)

ex: `3000`

##### MONGO_URL

Mongo address

ex: `mongodb://root:root@localhost:27017/simulator`

##### JWT_SECRET

Secret used to sign authentication JWT token and OnlyOffice DocumentServer JWT tokens

ex: `XcG8Eqnt3j52BQsJe2DskNB9`

##### JWT_EXPIRY

Time in ms before the JWT auth token expires

ex : `60 * 60 * 1000` (= 1 hour)

##### REFRESH_TOKEN_SECRET

Secret used to sign authentication refresh token

ex : `daiGixHvEq9UUjou7WWZ86hg`

##### REFRESH_TOKEN_EXPIRY

Time in ms before the JWT auth token expires

ex : `60 * 60 * 1000 * 24` (= 24 hours)

##### COOKIE_SECRET

Secret used to sign authentication cookies

ex : `uqUB6o5X9jgCi6kyS2273DER`

##### RESET_PASSWORD_TOKEN_SECRET

Secret used to sign the refresh password token in reset password mails

ex : `wGeobRQpwMuWE7`

##### RESET_PASSWORD_TOKEN_EXPIRY

Time in ms before the link in the reset password mails becomes inactive

ex : `60 * 60 * 1000 * 24 * 30` (= 30 days)

##### INVITATION_TOKEN_EXPIRY

Time in ms before the link in the invite mails becomes inactive

ex : `60 * 60 * 1000 * 24 * 7` (= 7 days)

##### DOCBUILDER_SPREADSHEET_FOLDER

Location where the spreadsheets are saved

ex: `/app/spreadsheets`

##### MAIL_HOST

Host for the SMTP server.

Example: `587`

##### MAIL_PORT

PORT for the SMTP server.

Example: `talm.fr`

##### MAIL_AUTH_USERNAME

(Optional)

Username for SMTP authentication

Example: `no-reply@scrrap.org`

##### MAIL_AUTH_PASSWORD

(Optional)

Username for SMTP authentication

Example: `m41lb0x-p4ssw0rd`

##### MAIL_FROM

Mail address from where the app sends its mails.

Example: `no-reply@scrrap.fr`

##### MAIL_TO

Mail address to where the app sends its management mails.

Example: `simulator@scrrap.fr`

##### WHITELISTED_DOMAINS
The addresses the API can answer to.
Can be multiple addresses separated by commas.

ex: `https://chuto.talm.fr`

##### DOCUMENTSERVER_API_URL

Address of DocumentServer API from the point of view of the simulator server

ex : `https://192.168.0.1`

##### FRONTEND_URL

Address of the public website from the point of view of the browser of the user

ex : `https://chuto.talm.fr/scrrap`


## Backups

- MongoDB : holds all data. [Backup / restore guide](https://www.mongodb.com/docs/manual/tutorial/backup-and-restore-tools/)
- spreadsheets docker Volume : holds all spreadsheets for computation projects. [Volume driver documentation](https://docs.docker.com/storage/volumes/#share-data-between-machines)
