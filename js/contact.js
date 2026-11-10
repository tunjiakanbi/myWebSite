/*
 * Contact form
 * ------------
 * Sends the form to the Google Apps Script endpoint and tells the visitor what happened,
 * on the page (no pop-ups):
 *   - while sending: the button is disabled and reads "Sending..."
 *   - success: the form is cleared and a confirmation appears
 *   - failure (offline, endpoint down, rejected): an error message appears and nothing is lost
 * The browser's own validation handles empty or malformed fields before this runs.
 */
(function () {
  "use strict";

  var ENDPOINT =
    "https://script.google.com/macros/s/AKfycbywoIU1Hp1AvdFHWnZsat3F0CmH09TA42mzDaQ8TXXTNku3rNdajSGT4nZYRqNWIP8/exec";

  var form = document.getElementById("myForm");
  var status = document.getElementById("form-status");
  if (!form || !status) return;
  var button = form.querySelector('button[type="submit"]');
  var buttonLabel = button.textContent;

  function say(text, state) {
    status.textContent = text;
    if (state) status.setAttribute("data-state", state);
    else status.removeAttribute("data-state");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (button.disabled) return; // already sending
    button.disabled = true;
    button.textContent = "Sending…";
    say("", null);

    fetch(ENDPOINT, { method: "POST", body: new FormData(form) })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.result !== "success") throw new Error("rejected");
        form.reset();
        say("Thanks, your message was sent.", "success");
      })
      .catch(function () {
        say("Sorry, your message could not be sent. Please try again, or reach me on LinkedIn.", "error");
      })
      .then(function () {
        button.disabled = false;
        button.textContent = buttonLabel;
      });
  });
})();
