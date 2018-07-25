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
    getCompanyData("Bunnings", function(val){
      console.log(val)
    })
  });
});

//get json data from file and store as key value pairs by company name.
function storeCompanyData(){
  fetch(chrome.extension.getURL('/company_data.json'))
        .then((resp) => resp.json())
        .then(function (jsonData) {
          var company_list = []
          var data = jsonData["data"];
          for (var i = 0; i < data.length; i++)
          {
            var obj = data[i]
            company_list.push(obj["company"])
            var key = "COMPANY_" + obj["company"];
            var value = {"rating": obj["rating"], "category": obj["category"],
            "praise" : obj["praise"], "criticism": obj["criticism"], "information" : obj["information"]};
            var objToStore = {};
            objToStore[key] = value;
            chrome.storage.local.set(objToStore);
          }
          chrome.storage.local.set({"companyList" : company_list});
        })
}

function getCompanyData(key, callback) {
  if (key != null) {
    key = ["COMPANY_" + key];
    chrome.storage.local.get(key, function(obj) {
      callback(obj);
    })
  }
}

function getCompanyList(callback) {
  chrome.storage.local.get(["companyList"], function(obj) {
    callback(obj);
  })
}

chrome.browserAction.onClicked.addListener(function () {
    chrome.browserAction.setPopup({ "popup": "popup.html" });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // TODO : update every time focus changes, just just on refresh
    var domains = {"companyList":[{'google.com' : "Google"}, 'yahoo.com', 'https://www.google.com/maps', 'https://www.katespade.com/']};
    var foundDomain = false;
    getCompanyList(function (companyNames) {
        var companyNames = domains["companyList"];
        // iterates over each domain to find our current tab URL
        companyNames.forEach(function (company) {
            if (tab.url.includes(company)) {
                foundDomain = true;
            }
            console.log(company);
        });

        if (foundDomain) {
            chrome.browserAction.setBadgeText({ text: "A" });
            chrome.browserAction.setBadgeBackgroundColor({ color: "green" });
        }
        else {
            chrome.browserAction.setBadgeText({ text: "" });
            //chrome.browserAction.setBadgeBackgroundColor({ color: "red" });
        }
    })
});
