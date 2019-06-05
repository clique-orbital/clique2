# Clique
![Logo](https://github.com/clique-orbital/clique2/blob/master/ios/RNFirebaseStarter/Images.xcassets/AppIcon.appiconset/icon-40%402x.png)

### The idea
Many of our group chats we create involve some form of event that will be planned in the future. Be it your group project :file_folder: where you will have frequent meetings, or simply your **clique** of best friends :two_women_holding_hands::two_men_holding_hands: that will hang out all the time, there are many a times where your plans :date: are buried deep in a heap of messages :envelope:. Clique aims to integrate the experience of group chats and calendars, to help better event planning and ensure that you never miss an event again!

### Installation
1. Clone the repository to your local computer

`git clone `

2. Change directory to ios folder

`cd clique2/ios`

3. Edit the Podfile

`vim Podfile`

4. Delete all lines with react in the code, e.g.

`pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'`

5. Press Esc and save file using :wq

6. Lastly, change back to root directory, install npm, change to ios directory and install pod, change back to root directory and link all dependencies

`npm i && cd ios && pod install && cd .. && react-native link`
