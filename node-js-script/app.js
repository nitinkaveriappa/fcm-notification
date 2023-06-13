const { initializeApp, cert } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const serviceAccount = require("./service_account_private_key_file.json");

initializeApp({
  credential: cert(serviceAccount),
});

const registrationToken = "<REGISTRATION_TOKEN>";

const message = {
  data: {
    title: "TESTTITLE",
    body: "TESTBODY",
    url: "TESTURL",
  },
  token: registrationToken,
};

// Send a message to the device corresponding to the provided registration token.
getMessaging()
  .send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log("Successfully sent message:", response);
  })
  .catch((error) => {
    console.log("Error sending message:", error);
  });
