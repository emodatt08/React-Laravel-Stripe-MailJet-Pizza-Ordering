# Pizzeria API Service
This laravel docker API application powers the pizzeria react front-end



## Features For API
- Endpoint to return pizza menu
- Endpoint store pizza menu with image upload.
- Endpoint edit pizza menu
- Endpoint take location, quantity, pizza type, toatl price as a pizza order
- Endpoint that takes in pizza order fulfilment or cancellation emails via mailgun to customers.
- API to Authenticate Admin login and logout
-  Endpoint to allow Administrators to fulfil or cancel order with notes and emails via mailgun.
- take in credit/debit card payments via stripe integration.




## Prerequisites for API
- Docker/Docker Compose
- [All Laravel Dependencies](https://laravel.com/docs/7.4#server-requirements)

## Installation for API
* Clone the Repository
* Set up your .env
    - Configuring the docker database

Build the images and start the services:
```
docker-compose build --no-cache pizzeria-api
docker-compose up -d
```

## Helper scripts
Running `composer`, `php artisan` or `phpunit` against the `php` container with helper scripts in the main directory:

### container
Running `./container` takes you inside the `pizzeria-api` container under user uid(1000) (same with host user)
```
$ ./container
devuser@8cf37a093502:/var/www/html$
```
### db
Running `./db` connects to your database container's daemon using mysql client.
```
$ ./db
mysql>


## Troubleshooting
If you happen to have issues after installing try to

- Install dependencies with composer if the vendor folder doesn't exist or errors related to dependencise are thrown
- Clear config, cache, view and route caches with artisan commands
- Modify permissions for the storage and bootstrap directories