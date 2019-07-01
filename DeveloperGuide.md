# Developer Guide :book:
### Table of Contents
1. [Installation](#installation-guide)
    * [Prerequisites](#prerequisites)
    * [Setting Up](#setting-up)
    * [Getting Started](#getting-started)
2. [Design](#design)
3. [Implementation](#implementation)
    * [Authentication](#authentication-:unlock::key:)
    * [Groups](#groups)
    * [Messages](#messages)
    * [Events](#events)
    * [Calendar](#calendar)


## Installation
### Prerequisites
  * Terminal
  * Android Studio
  * Node (v10.15.3^) (if unsure, check out Setting Up)
  * npm (v6.4.1^) (if unsure, check out Setting Up)
  * Xcode (only for Mac users)
  
### Setting Up
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

### Getting Started

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

### Signing into the app
You may use the following pre-authorized phone number and verification code to test and login to the app. 
```
Phone Number/Verification Code
+6599999999/999999
+6588888888/888888
```

## Implementation
### Authentication :unlock::key:

To use Clique, a user must have an account. We use Google’s Firebase to handle our authentication process, where the sign-in method is the user’s phone number. An SMS verification code will be sent to the phone number inputted and used to confirm the authentication of the user.  The app then checks whether it is a first-time sign in or an existing user. If it is the former, it will direct the user to create his name and add a profile picture. 

### Groups  :two_men_holding_hands::two_women_holding_hands:

Groups are essentially chat rooms. They store all the members unique identification (UID), the messages between the members, and the events of that group. A user can create a group with his contacts (those who have signed up with Clique already), give a group name and upload a group picture. Once that is done, the information will be send to our database, users can start texting each other in the group. At the moment of writing, anyone can remove other members of that group inside the group information screen. Members can also edit the group’s display photo and group name. 

### Messages  :speech_balloon::calling:

Users can type and send messages to the group. The messages are first sent to our database, and when the ChatScreen component detects the change in data in the database, it will update the messages on the screen. The most important feature of texting in a group is to know who wrote which texts. Thats why we implement every text message to store the sender’s UID. By comparing that to the user’s UID (stored in the app during authentication), we are able to differentiate the user’s messages and that of other members of the group. Text messages also have different types, from the normal text, to event types, which our ChatScreen component will render accordingly.  


### Events  :date::basketball::hamburger::microphone::books::airplane:

Combining messages and events was the core of Clique. Members of a group can create events for that group. By providing a title (minimally), start and end time, location, and notes of the event, the event will be stored in the cloud database when publish. Events have responses in them, mainly accept and reject (may add pending in the near future). Users can then indicate their attendance to the event inside the Event modal. The Event modal is filled with event’s information, and also shows who have accepted and rejected the invitation. 

### Calendar  :calendar:

For Calendar, we figured it will be an uphill task to implement the component ourselves, especially with our inexperience in React Native. To avoid any wastage of time, we used the third-prarty library [react-native-calendars](https://www.npmjs.com/package/react-native-calendars) to aid us in our implementation. For groups, we passed the group’s events data to the component and let it handle the rendering, albeit with a bit of tweaks from our side. For personal calendar, every time the user responds to an event, the database will keep track of whether he/she has accepted/rejected the invitation. The main focus for personal calendars would be the events that the user has accepted, and that data is kept under the user’s data object in the database. We then pass this specific data to the calendar component. 
