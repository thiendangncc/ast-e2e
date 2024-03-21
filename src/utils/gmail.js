import Imap from "imap";
var quotedPrintable = require("quoted-printable");

const getTodaysDate = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const date = new Date();
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  return monthNames[monthIndex] + " " + day + ", " + year;
};

/**
 * Fetches a message from the inbox
 * @param {{user: string, password: string, host: string, port: number, tls: boolean}} emailSettings
 * @param {string} emailAddress Messages that contain the specified string in the TO field
 * @param {string} subject Messages that contain the specified string in the SUBJECT field
 */
const getEmail = async (emailSettings, emailAddress, subject) => {
  let email;
  console.log(
    'Checking for emails sent to "' +
      emailAddress +
      '" with the subject "' +
      subject +
      '"'
  );
  for (let i = 0; i < 120; i++) {
    email = await fetchEmail(emailSettings, emailAddress, subject);
    if (typeof email !== "undefined") {
      if (email.length !== 0) {
        return email;
      }
    }
  }
  console.log("Could not find an email");
};

/**
 * Deletes all messages from the inbox which were received before today
 * @param {{user: string, password: string, host: string, port: number, tls: boolean}} emailSettings
 */
const cleanInbox = async (emailSettings) => {
  const imap = new Imap(emailSettings);
  await imap.connect();
  await new Promise((resolve, reject) => {
    imap.once("ready", () => {
      imap.openBox("INBOX", false, (err, box) => {
        if (err) resolve();
        imap.search(["ALL", ["BEFORE", getTodaysDate()]], (err, results) => {
          if (err) resolve();
          let fetchRequest;
          try {
            fetchRequest = imap.fetch(results);
            imap.setFlags(results, ["\\Deleted"], function (err) {
              if (err) return resolve();
            });
            fetchRequest.once("end", () => {
              console.log("Done fetching all messages!");
              imap.end();
              resolve();
            });
          } catch (err) {
            imap.end();
            resolve();
          }
        });
      });
      imap.once("error", () => {
        imap.end();
        resolve();
      });
    });
  });
};

const fetchEmail = async (emailSettings, emailAddress, subject) => {
  const email = [];
  const imap = new Imap(emailSettings);
  await imap.connect();
  await new Promise((resolve, reject) => {
    imap.once("ready", () => {
      imap.openBox("INBOX", true, (err, box) => {
        if (err) resolve();
        imap.search(
          [
            "UNSEEN",
            ["SINCE", getTodaysDate()],
            ["TO", emailAddress],
            ["SUBJECT", subject]
          ],
          (err, results) => {
            if (err) resolve();
            let fetchRequest;
            try {
              fetchRequest = imap.fetch(results, {
                bodies: ["HEADER.FIELDS (FROM TO)", "1"]
              });
              fetchRequest.on("message", (msg) => {
                msg.on("body", (stream, info) => {
                  let body = "";

                  // const { simpleParser } = require('mailparser');
                  // simpleParser(stream, (err, mail) => {
                  //   callback && callback(mail);
                  // });
                  stream.on("data", (data) => {
                    body += data; // .toString('utf8');
                  });
                  stream.once("end", () => {
                    const bodytype = info.which;
                    if (bodytype === "HEADER.FIELDS (FROM TO)") {
                      const headers = Imap.parseHeader(body);
                      email[0] = headers;
                    }
                    if (bodytype === "1") {
                      const plainText = quotedPrintable.decode(body);
                      email[1] = plainText;
                    }
                  });
                });
              });
              fetchRequest.once("end", () => {
                console.log("Done fetching all messages!");
                imap.end();
                resolve();
              });
            } catch (err) {
              imap.end();
              resolve();
            }
          }
        );
      });
      imap.once("error", () => {
        imap.end();
        resolve();
      });
    });
  });
  return email;
};

export { getEmail, cleanInbox, fetchEmail };
