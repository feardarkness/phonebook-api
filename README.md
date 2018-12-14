# PhoneBook Project

## What you need

- Nodejs > 8.x.x (although it should work with earlier versions too)
- [Postman](https://www.getpostman.com/apps)
- [MongoDB](https://www.mongodb.com)

## Installing npm dependencies

Before installing everything make sure you got all the required dependencies:

```
$ sudo apt-get install -y build-essential
$ NODE_ENV=development npm install
```

## Configurations (i'm leaving the .env file so everything runs without problems)

All configs must be done in ".env" (just rename .env.sample to .env).

## Install in production

Install pm2 and run:

```
$ sudo npm install -g pm2
$ pm2 start index.js --name phonebook-api -i 1
```

If you have more than one processor change the **-i** value

## Getting started

Import the postman collection (_postman-collection/Phonebook API.postman_collection.json_).

- Now create an user in (_User_ folder in postman, _Register regular user_).
- Login (_Login_) with the recently created user.
- Create a contact for the user (_Contact_ folder in postman, _Create Contact_)

It's posible to view other requests in the collection in postman.

## Run in development

```
$ npm start
```

## Run tests

- Unit tests

```
$ npm run test
```
