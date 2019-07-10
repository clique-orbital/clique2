// const functions = require("firebase-functions");
// const admin = require("firebase-admin");

// // initializes your application
// admin.initializeApp(functions.config().firebase);

// exports.sendPushNotificationMessage = functions.database
//   .ref(`/messages/f4bdd0c1-cd29-431a-b7e9-1d4e0fe4baee`)
//   .onWrite(event => {
//     const messages = event.val();
//     console.log(messages);
//     const pushToken = "dctuzVhN6Nw:APA91bHAI4_TGAG_ptwzswAGfe5zx_6w79mrYx_RUcMsLEGI8TNkSHqc0P5fLr89uB4brLlS7bAP2HiFxHm_Ss4SaYWEf8Cn5MNTQQh8XdPMv74fSEUv6G7cQlyDynjRGNw1_DGkULzm";
//     let payload = {
//       notification: {
//         title: "Testing Clique Message Notification",
//         body: "Hello World!"
//       }
//     }

//     return admin.messaging().sendToDevice([pushToken], payload);
//   });

// exports.sendPushNotification = functions.database()
//   .ref("messages")
//   .on("child_added", event => {
//     // gets standard JavaScript object from the new write
//     const writeData = event.data.data();
//     // access data necessary for push notification 
//     const sender = writeData.uid;
//     const senderName = writeData.name;
//     const recipient = writeData.recipient;
//     // the payload is what will be delivered to the device(s)
//     let payload = {
//       notification: {
//       title: 
//       body:
//       sound:
//       badge:
//      }
//     }
//     // either store the recepient tokens in the document write
//     const tokens = writeData.tokens;  

//     // or collect them by accessing your database
//     var pushToken = "";
//     return functions
//       .firestore
//       .collection("user_data_collection/recipient")
//       .get()
//       .then(doc => {
//          pushToken = doc.data().token;
//          // sendToDevice can also accept an array of push tokens
//          return admin.messaging().sendToDevice(pushToken, payload);
//       });
// });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });