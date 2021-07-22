# **Project architecture**
Cellr is a React-Native application written on functional components' architecture.

Frontend - Backend connection via GraphQL.
## Application main frameworks 
### [ApolloGraphQL](https://www.apollographql.com/docs/react/)
Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL.

Use it to fetch, cache, and modify application data, all while automatically updating your UI.

### [React-Native Permissions](https://github.com/react-native-community/react-native-permissions)
A unified permissions API for React Native on iOS and Android.

### [React-Navigation 4.x](https://reactnavigation.org/docs/4.x/getting-started/)
React Navigation is born from the React Native community's need for an extensible yet easy-to-use navigation solution written entirely in JavaScript (so you can read and understand all of the source), on top of powerful native primitives.

Before you commit to using React Navigation for your project, you might want to read the anti-pitch — it will help you to understand the tradeoffs that we have chosen along with the areas where we consider the library to be deficient currently.

### [React-Native CodePush](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/)
CodePush is an App Center cloud service that enables React Native developers to deploy mobile app updates directly to their users’ devices.

For more details visit official docmentation
#### CodePush deploying
CodePush configuration holds in 
```
~/AppFolder/src/App.tsx
```
Default configure line is 
```javascript
let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME};
```

For releasing app you need to set ***CODEPUSH_KEY***
As we have 2 appCenter accounts:
 * [Internal (InMost)](https://appcenter.ms/orgs/Inmost/applications)
 * [Customer Cellar Ventures](https://appcenter.ms/orgs/Cellar-Ventures/applications)

We need to set Up different keys. Keys you can found on appCenter app page:
```
Distrubute -> CodePush -> Production/Staging
``` 
Or you can found it in .env file in the root of the app.

When you need to release app for in company testing or customer testing you need to set appropriate ***CODEPUSH_KEY***

in 
```
ios/Cellr/Info.plist
```
Change CodePushDeploymentKey to one key from the list below, according to your needs


#### For full Release for Customer
```javascript
PRODUCTION_CELLAR_CODEPUSH=ylOgfRablZN_5xEs3W7m7V6BKYx9PcZREbDt9
```

## Main folder src/
Src divides into several main parts:
### Main.tsx
Entry point to the app, holds apollo graphQL provider logic

### App.tsx
Navigation entry point

### Apollo
Folder for interaction with GraphQL. There are:
* Mutations
* Queries
* Links
* Internal Cache updating

### Assets
Folder for holding local assets like:
* Fonts
* Images
* Photos
* FTE slider pictures
* Svg icons

### Constants
Folder for holding reusable constants in app:
* Colors
* Styles
* Action Types for reducer
* etc.

### Hooks
Folder for holding self-made hooks for app

### Reducers
Folder for holding custom useReducer hook reducers. 
If you have many useState() - you should think about useReducer hook!

### Navigation
Folder for creating and storing Navigation between app screens:
* Auth Navigator - holds navigation for Auth part of the app
* Drawer Navigator - holds navigation for all main part of the app
* Launch Navigator - holds navigation for start screen
* index.tsx - Connect all parts that was mentioned above

### Screens
Folder that holds all available screens in the app. Link for app prototype: [Product tree](https://cellarventures.atlassian.net/wiki/spaces/CA/pages/67665955/Product+tree)

### Types
As we use TypeScript as main language, types folder holds all available types for objects.

### Utils
Folder holds utility methods, class or objects for different screens. For example:
* AddWineUtils - Class for working with Add wine screen, holds methods and objects and let screen code be more clear
* PhotoRecognitionUtils - File that stores all methods that need for camera working. For example work with permissions should be here.
* etc.

###Components and NewUIComponents
These Folders hold helping components for screens to clean up code and prevent code duplication.


#### TODOs
TODO: When new design will be implemented fully, you should remove all old screens and components and then remove "NewUI" label from all part of the app, both screens and components.

For example:

There are screens named Inventory and InventoryNewUI. After confirmation by the customer new screen, old should be deleted.
