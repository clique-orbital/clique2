const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.sendPushNotificationMessage = functions.database
  .ref("/messages/{groupID}/{msgID}")
  .onCreate((snapshot, context) => {
    const groupID = context.params.groupID;
    const msg = snapshot.val();
    const msgType = msg.type;
    const senderUsername = msg.username;
    let value = "";

    if (msgType === "text" || msgType === "system") {
      value = msg.message;
    } else if (msgType === "poll") {
      value = msg.pollObject.question;
    } else if (msgType === "event") {
      value = msg.event.title;
    }

    let payload = {
      notification: {
        title: senderUsername,
        body: value
      }
    };

    return admin
      .database()
      .ref(`groups/${groupID}/users`)
      .once("value")
      .then(ss => {
        return Object.keys(ss.val()).map(async uid => {
          const snapshot = await admin
            .database()
            .ref(`users/${uid}/notificationToken`)
            .once("value");
          return snapshot.val();
        });
      })
      .then(async arr => {
        const res = await Promise.all(arr);
        return admin.messaging().sendToDevice(res, payload);
      });
  });
