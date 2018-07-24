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
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

//get json data from file and store as key value pairs by company name.
function storeCompanyData(){
  fetch(chrome.extension.getURL('/company_data.json'))
        .then((resp) => resp.json())
        .then(function (jsonData) {
          var data = jsonData["data"];
          for (var i = 0; i < data.length; i++)
          {
            var obj = data[i]
            var key = "COMPANY_" + obj["company"];
            var value = {"rating": obj["rating"], "category": obj["category"],
            "praise" : obj["praise"], "criticism": obj["criticism"], "information" : obj["information"]};
            var objToStore = {};
            objToStore[key] = value;
            chrome.storage.local.set(objToStore);
          }
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
