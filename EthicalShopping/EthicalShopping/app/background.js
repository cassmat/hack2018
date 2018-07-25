// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var domains = {
    "companyList": [
        'google.com',
        "www.kookai.com.au",
        'global.cue.cc',
        'https://mightygoodundies.com.au/',
        'https://www.marc-o-polo.com',
        'www.levi.com',
        'www.hm.com',
        'www.calvinklein.us',
        'www.donnakaran.com',
        'shop.diesel.com']
};
var companyURLMap = {
    'google.com': 'Google',
    "www.kookai.com.au": 'Kookai',
    'global.cue.cc': 'Cue',
    'https://mightygoodundies.com.au/': 'Mighty Good Undies',
    'https://www.marc-o-polo.com': 'Marco Polo',
    'www.levi.com': "Levi's",
    'www.hm.com': 'H&M',
    'www.calvinklein.us': 'Clavin Klein',
    'www.donnakaran.com': 'DKNY',
    'www.donnakaran.com': 'Gap',
    'shop.diesel.com': 'Diesel'
};

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
    var foundDomain = false;
    var domainName;
    var companyNames;

    getCompanyList(function (companyNames) {
        companyNames = domains["companyList"];
        companyNames.forEach(function (company) {
            if (tab.url.includes(company)) {
                foundDomain = true;
                domainName = company;
            }
        });

        if (foundDomain) {
            domainFound(domainName);
        }
        else {
            chrome.browserAction.setBadgeText({ text: "" });
        }
    })
});

function domainFound(domainName) {
    var companyName = companyURLMap[domainName];
    var rating;
    var letterGrade;
    var gradeColor;

    getData(domainName, function (data) {
        
    });
    switch (rating) {
        case 'Praises, no criticism':
            letterGrade = 'A';
            gradeColor = '#5B8959';
            break;
        case 'Some praise, no criticism':
            letterGrade = 'B';
            gradeColor = '#71C17A';
            break;
        case 'Praises, some criticism':
            letterGrade = 'C';
            gradeColor = '#F0BB58';
            break;
        case 'Criticism, some praise':
            letterGrade = 'D';
            gradeColor = '#F07D21';
            break;
        case 'Criticisms':
            letterGrade = 'F';
            gradeColor = '#FA5D5B';
        default:
            letterGrade = '?';
            gradeColor = '#B1B3B6';
    }
    chrome.browserAction.setBadgeText({ text: letterGrade });
    chrome.browserAction.setBadgeBackgroundColor({ color: gradeColor });
}
