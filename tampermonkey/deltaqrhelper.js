// ==UserScript==
// @name         DeltaQR Free Delta Combs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       CoreByte
// @match        https://deltaqr.ut.ee/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hibbard.eu
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const href_to_room_id_object = {
    'https://deltaqr.ut.ee/room/a6iA8c4Ar76GrhBq': 24,
    'https://deltaqr.ut.ee/room/WOCNHFPdbylxtrLW': 26,
    'https://deltaqr.ut.ee/room/GY44owcbXcFyYqSL': 28,
    'https://deltaqr.ut.ee/room/z8Sy14VBh9w4g1Wf': 30,
    'https://deltaqr.ut.ee/room/RipgUW6J4gk6OXw5': 32,
    'https://deltaqr.ut.ee/room/KmeWAsliJCa7mUum': 34,
    'https://deltaqr.ut.ee/room/KFiqYkcJqcsBFjKI': 36,
    'https://deltaqr.ut.ee/room/Xr9K4r90gZEJ45Tg': 38,
    'https://deltaqr.ut.ee/room/8oC3BY80s8e1ppUm': 40,
    'https://deltaqr.ut.ee/room/7XyHR5GBOL51ERFo': 42
  };


  function check_if_contained_between_times(data) {
    for (const booking of data) {
      let cur_time = new Date();
      let start = new Date(booking.start);
      let end = new Date(booking.end);
      if (cur_time >= start && cur_time <= end) {
        return true;
      }
    }
    return false;
  }

  async function weird_fetch(url, key) {
    const response = await fetch(url);
    const data = await response.json();

    return [key, data];
  }

  async function run() {
    const hexes = document.getElementsByClassName("hex");
    const hexes2 = document.getElementsByClassName("hex2");
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    let promises = [];
    for (const key of Object.keys(href_to_room_id_object)) {
      promises.push(weird_fetch(`/bookings/${href_to_room_id_object[key]}/${today}/${today}`, key));
    }
    const intermediate = await Promise.all(promises);
    let hrefs_not_available = [];
    for (const zipped of intermediate) {
      if (check_if_contained_between_times(zipped[1])) {
        hrefs_not_available.push(zipped[0]);
      }
    }
    for (const hex of hexes) {
      if (hrefs_not_available.includes(hex.href)) {
        let img = hex.getElementsByTagName('img')[0];
        img.style.filter = "grayscale(100%)";
      }
    }
    for (const hex of hexes2) {
      if (hrefs_not_available.includes(hex.href)) {
        let img = hex.getElementsByTagName('img')[0];
        img.style.filter = "grayscale(100%)";
      }
    }
  }

  let button = document.createElement("button");
  button.style.textAlign = 'centre';
  button.innerHTML = "Show currently available";
  button.addEventListener("click", () => run(), false);
  let parentCol = document.querySelector("body > div > div > div > div");
  parentCol.style.textAlign = 'center';
  parentCol.appendChild(button);
})();
