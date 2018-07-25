// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function () {
  console.log("Ethicly Extension started")
  storeCompanyData();
  //redirects to developer page on install
  var newURL = "https://developer.chrome.com/";
  chrome.tabs.create({ url: newURL });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
      actions: []
    }]);
  });
});

//get json data from file and store as key value pairs by company name.
function storeCompanyData(){
  fetch(chrome.extension.getURL('/company_data.json'))
        .then((resp) => resp.json())
        .then(function (jsonData) {
          var company_obj = {}
          var url_obj = {}
          var data = jsonData["data"];
          for (var i = 0; i < data.length; i++)
          {
            var obj = data[i];
            url_obj[obj["url"]] = obj["company"];
            var value = {"rating": obj["rating"], "category": obj["category"],
            "praise" : obj["praise"], "criticism": obj["critcism"], "information" : obj["information"]};
            company_obj[obj["company"]] = value;
          }
          chrome.storage.local.set({"url_to_company" : url_obj});
          chrome.storage.local.set({"company_to_data" : company_obj});
        })
}

function getData(key, callback) {
    chrome.storage.local.get([key], function(obj) {
      callback(obj);
    })
}

chrome.browserAction.onClicked.addListener(function () {
    chrome.browserAction.setPopup({ "popup": "popup.html" });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    var domains = ['google.com', 'yahoo.com', 'https://www.google.com/maps', 'https://www.katespade.com/'];
    //for (domain in domains) {
    if (changeInfo.url.includes("google.com")) {
        chrome.browserAction.setBadgeText({ text: "Y" });
    } else {
        chrome.browserAction.setBadgeText({ text: "" });
    }
    //}
});
