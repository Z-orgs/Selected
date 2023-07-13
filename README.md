<p align="center">
  <a href="https://github.com/Z-orgs/Selected" target="blank"><img src="https://i.imgur.com/JjjgDjL.png" width="300" alt="selected logo" /></a>
</p>

# Selected

Welcome to Selected, the online music streaming website developed by [710](https://github.com/710x). With this application, you can stream and enjoy your favorite music from all around the world.

## Contributing

We welcome your pull requests, bug reports, and feature requests. If you find any issues or would like to suggest a feature, please feel free to open an issue in our [GitHub repository](https://github.com/Z-orgs/Selected).

## Prerequisites

Before you install and use the Selected project, you'll need the following:

- [NodeJS](https://nodejs.org/en/)

## Installation

1.  Clone this repository

```
git clone https://github.com/Z-orgs/Selected.git
```

2.  Install all dependencies

```
npx yarn install
```

3.  Start the Selected server

```
npm start
```

That's it! You have successfully completed the installation of Selected.

## Documentation

- API: [v1](https://documenter.getpostman.com/view/20764163/2s93RWMq5a)

## Docker image

- [vuongsyhanh/selected](https://hub.docker.com/r/vuongsyhanh/selected)

## docker-compose.yml

- Example:

```
services:
    nest:
        env_file:
            - selected.env
        image: vuongsyhanh/selected
        command: sh -c "yarn start"
        ports:
            - 3000:3000
        networks:
            - selected
    mongo:
        env_file:
            - selected.env
        image: mongo:focal
        restart: always
        ports:
            - 27017:27017
        volumes:
            - ./data/mongo:/data/db
        networks:
            - selected
networks:
    selected:
```

## selected.env

- Example:

```
MONGO_URI=mongodb://admin:example@mongo:27017/?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EXPIRES_IN=
CALLBACK_URL=http://localhost:3000/auth/redirect
PASSWORD=
DEFAULTPASSWORD=
UNITPRICE=
MONGO_INITDB_ROOT_email=admin
MONGO_INITDB_ROOT_PASSWORD=example
MONGO_INITDB_DATABASE=selected
```
