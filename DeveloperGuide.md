# Developer Guide
### Table of Contents
1. [Installation](#installation-guide)
    * [Prerequisites](#prerequisites)
    * [Getting Started](#getting-started)


## Installation
### Prerequisites
  * Terminal
  * Android Studio
  * Node (v10.15.3^) (if unsure, check out Getting Started)
  * npm (v6.4.1^) (if unsure, check out Getting Started)
  * Xcode (only for Mac users)
  
### Getting Started
Install node and watchman with Homebrew by entering the following commands in the terminal.

```
brew install node
brew install watchman
```

Ensure that both Node and npm meet the version requirements. You can check the versions with the commands

```
node -v
npm -v
```

Next, install React Native Command Line Interface (CLI) with npm.

`npm i -g react-native-cli`

Change the current working directory to the location where you want the working directory to be made. Clone the repository to your local computer.

`git clone git@github.com:clique-orbital/clique2.git`

Change directory to ios folder

`cd clique2/ios`

Edit the Podfile

`vim Podfile`

Delete all lines with react in the code, e.g.

`pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'`

Press Esc and save file using `:wq`

Lastly, change back to root directory, install npm, change to ios directory and install pod, change back to root directory and link all dependencies

`npm i && cd ios && pod install && cd .. && react-native link`

**For Android**

Ensure that you have Android Studio installed. Clique is build on top of **SDK versions 24-28**. Next, open up an Android Virtual Device (AVD).
If you are unsure on how to open an AVD, check out this [link](https://developer.android.com/studio/run/managing-avds). Once the AVD is started up, run the following command:

`react-native run-android`

The app will take some time for the initial build, and once done, it will be running on the AVD.

**For iOS** (only for Mac users)
Open `RNFirebaseStarter.xcworkspace` in the ios directory of the file.

`open ios/RNFirebaseStarter.xcworkspace`

Once the project has been indexed, choose a simulator device (preferably iPhone XS) at the top left bar. Press the play button to build the app.
The iOS simulator will automatically open, while the initial build will take some time. Once done, the app will be running on the simulator.
