# README

Sync XML Files from FTP into a National 4-day Fire Danger Rating Layer on ArcGIS Online

## Objective

This program will sync the Fire Danger Rating values from multiple XML files on a FTP site and update a layer in ArcGIS Online with the latest values for each district. This will create a national dataset of fire districts and their current warning status.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

The app can be deploy as standalone NodeJS web app or as a AWS lambda function. To deploy to AWS Lambda, use [Serverless](https://serverless.com/)

### Installing

```
npm install
```

OR

```
yarn install
```

### Credentials and Registering your App

For this code to work, you need to

1. [Add an app in ArcGIS Online](https://doc.arcgis.com/en/marketplace/provider/create-listing.htm)
2. [Register an app in ArcGIS Online](http://doc.arcgis.com/en/marketplace/provider/register-app.htm)
3. Create .env file based on [env.sample](./.env.sample) and fill up the following details
   - featureServerUrl
     - main URL for updating the data of feature layer
   - fsTimeExtentUrl
     - URL for updating time extent cache
   - clientId
     - Client ID
   - clientSecret
     - Client Secret

### Deploy to AWS Lambda

```
sls deploy
```

### Manually trigger AWS Lambda function

```
sls invoke -f app
```

### Running the function locally

```
npm run dev
```

OR

```
yarn dev
```
