# locate-user-node
a web server that returns users who either reside or are within a particular distance of a given city

## Start locally
2. ``` npm ci``` this will import all the required packages as specified in the package lock file
3. ``` npm start``` this will start the service

## Start in Docker
```
docker build -t locate-user-node .
```
```
docker run -p 3000:3000 locate-user-node
```

## API
 - The following api will return users that either live in a city or are currently located within the specified distance of the city
 
```http://localhost:3000/api/v1/city/{city}/distance/{distance}```

- An example for 50 miles around london is below

```http://localhost:3000/api/v1/city/london/distance/50```

distance must be a positive integer

## Distance Calculation
 The following methods were considered for the distance calculation between the user's current location, and the city's coordinates
 
 | Method | Selected| Reason |
 | ------ | ------ | ------ |
 | Mongo geo-search capability | discounted | the data is not guaranteed to stay the same so would need to be reloaded and very resource heavy for the ask |
 | Simple distance calculation | discounted | Hand coded and therefore prone to errors, and is also not very accurate |
 | Haversine calculation hand coded | discounted|Hand coded and therefore prone to errors |
 | npm geo-distance | discounted | as it had no tests and while there isn't any dependencies it is 3 years old|
 | npm haversine-distance | potential | this package just does the Haversine calculation, is very small 5kb but is 2 years old |
 | npm geolib | potential | this package offers more options including more accurate calculations for distance, 104kb in size, only 2 months old |
  
 Since the API design allows for the user to select the distance between points and the errors for Haversine are greater for larger distances,  the GeoLib will be chosen and use the simple calculation for distances less than 300 miles and the more accurate calculation for distances over 300 miles

## Assumptions
### Node Version
- This project has been built and tested using node 16.13.1
- This can be installed using `nvm use` and follow the directions for installation 
### City Coordinates
- The following coordinates are being used for the city centre used in the distance calculation
- These have been retrieved from https://www.latlong.net/

 | City | Latitude | Longitude |
 | ---- | ------ | ------ |
 | London | 51.509865 | -0.118092 |
 |Blackpool|53.814178|-3.053540|
 |Madrid|40.416775|-3.703790|
 |Glasgow|55.861753|-4.252603|
 
## Run Cucumber Tests
 The cucumber tests require the service to be running.  This is now done by a prescript.
 A folder must be created in the project root called cucumber if one does not exist
 ```
npm run cucumber
```

## Pipeline
 - This project uses a pipeline created from the Actions facility in Github
 - As the author uses a custom repository for npm packages locally this was not available in the Github ci
 - The ```npm ci``` command that is normally recommended was replaced with ```npm install --no-package-lock``` for the project to build in Github
