const { initializeApp, cert } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const serviceAccount = require("./<SERVICE_ACCOUNT_PRIVATE_KEY_JSON_FILE>");

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

/**
 * If you face the Error code: UNABLE_TO_GET_ISSUER_CERT_LOCALLY
 * while running the NodeJS Code then run the below command before running this script.
 *
 * set NODE_TLS_REJECT_UNAUTHORIZED=0
 *
 * node app.js
 *
 */
