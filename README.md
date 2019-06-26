<img src="https://github.com/clique-orbital/clique2/blob/master/ios/RNFirebaseStarter/Images.xcassets/AppIcon.appiconset/icon-40%402x.png" align='right' />

# Clique

Many of our group chats we create involve some form of event that will be planned in the future. Be it your group project where you will have frequent meetings, or simply your **clique** of best friends that will hang out all the time, there are many a times where your plans are buried deep in a heap of messages. Clique aims to integrate the experience of group chats and calendars, to help better event planning and ensure that you never miss an event again!

- Clique is a mobile, cross-platform (iOS and Android) application written with React-Native.
- Clique integrates a calendar feature into group messaging for easier event planning and scheduling with your friends.

## Main Features

- Group messaging
- Account validation via phone number SMS authentication
- Groups and group members CRUD
- Calendar features (personal and group)
- Caching photos locally

## Features to be implemented in the future:

- Unit and Integrated Tests using Jest and Enzyme
- Events update and delete
- Dark mode
- Animations

## Site Map

- User Guide
- Developer Guide

## Installation

Clone the repository to your local computer

Change directory to ios folder

`cd clique2/ios`

Edit the Podfile

`vim Podfile`

Delete all lines with react in the code, e.g.

`pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'`

Press Esc and save file using :wq

Lastly, change back to root directory, install npm, change to ios directory and install pod, change back to root directory and link all dependencies

`npm i && cd ios && pod install && cd .. && react-native link`

## Contributions

Contributions are always welcome!
