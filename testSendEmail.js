const { sendConfirmation } = require("./services/sendConfirmation");

const fetchSendEmail = async () => {
  sendConfirmation(
    "Fataou",
    "Ahamadi",
    "confirmation_link",
    "fatahouahamadi88@gmail.com"
  );
};
fetchSendEmail();
