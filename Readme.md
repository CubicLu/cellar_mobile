# Overview


## Project overview
All actual info about the Cellr app and developing process holds here:
* [Confluence](https://cellarventures.atlassian.net/wiki/spaces/CA/overview?homepageId=12582971)
* Jira:
    * [Customer backlog](https://cellarventures.atlassian.net/jira/software/projects/PB/boards/7)
    * [Developer SprintList](https://cellarventures.atlassian.net/secure/RapidBoard.jspa?rapidView=8&projectKey=CL&view=planning.nodetail&issueLimit=100)

## Installation

"Cellr" project setup needs MacOS for iOS launching and deploying

Set up react-native [environment](https://facebook.github.io/react-native/docs/getting-started). Follow instalation guide.

Assumed that on the device already installed XCode, node.js (stable), yarn, cocoa pods, npm and Android studio and Android SDK
### Clone Project from the repository

```bash
git clone https://{userName}@bitbucket.org/cellarventuresdev/celler-mobile.git
```
### Checkout to the actual branch

```bash
git checkout branchName
```
Then run command to install node_modules dependencies

```bash
yarn
```
or

```bash
npm install
```

## iOS launching
For iOS launching it is needed to instal pods native dependencies:

```bash
cd ios
```
and then

```bash
pod install
```

```bash
pod update
```

and then exit from ios directory

```bash
cd ..
```
Link ios resources and assets:

```bash
yarn build:ios
```
### Two ways to launch

#### First: 
Open XCode project. Open the file with the project by path: 
```
yourPath/celler-mobile/ios/Cellar.xcworkspace
```
Then press on "Play" button.

#### Second:
Run command
```bash
yarn ios
```
## Android launching
Set up local.properties file with your own directory path and place it 
```
yourPath/celler-mobile/android/local.properties
```
For example (content of local properties):
```
sdk.dir = /Users/{macName}/Library/Android/sdk
```
Open Android Studio and open android project for Cellar:

```
yourPath/celler-mobile/android/
```

Sync and Build project. Now you can launch the app by pressing the "Play" button in android studio or by command
```
yarn android
```
