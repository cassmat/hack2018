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
        'gap.com',
        'shop.diesel.com',
        'nike.com']
};
var companyURLMap = {
    'google.com': 'Google',
    "www.kookai.com.au": 'Kookai',
    'global.cue.cc': 'Cue',
    'https://mightygoodundies.com.au/': 'Mighty Good Undies',
    'https://www.marc-o-polo.com': 'Marco Polo',
    'www.levi.com': "Levi Strauss & Co",
    'www.hm.com': 'H&M',
    'www.calvinklein.us': 'Calvin Klein',
    'www.donnakaran.com': 'DKNY',
    'gap.com': 'Gap',
    'shop.diesel.com': 'Diesel',
    'nike.com': 'Nike'
};

chrome.runtime.onInstalled.addListener(function () {
  console.log("Ethicly Extension started")
  storeCompanyData();
  //redirects to ethicly page on install
  var newURL = "https://ethicly.org/";
  chrome.tabs.create({ url: newURL });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
      actions: []
    }]);
    getData("companyToData", function(val) {
      console.log(val);
    })
  });
});

//get json data from file and store as key value pairs by company name.
function storeCompanyData() {
  fetch(chrome.extension.getURL('data/sample_data.json'))
        .then((resp) => resp.json())
        .then(function (jsonData) {
          var urlToCompany = {};
          var companyToData = {};
          var data = jsonData["data"];
          for (var i = 0; i < data.length; i++)
          {
            var obj = data[i];
            urlToCompany[obj["url"]] = obj["company"];
            var value = {"rating": obj["rating"], "category": obj["category"],
            "praise" : obj["praise"], "criticism": obj["critcism"], "information" : obj["information"]};
            companyToData[obj["company"]] = value;
          }
          console.log(urlToCompany);
          console.log(companyToData);
          chrome.storage.local.set({"urlToCompany" : urlToCompany});
          chrome.storage.local.set({"companyToData" : companyToData});
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

// see if current URL matches one of known companies
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    var foundDomain = false;
    var domainName;
    var companyNames;

    getData("urlToCompany", function (companyNames) {
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

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
      var foundDomain = false;
      var domainName;
      var companyNames;

      getData("urlToCompany", function (companyNames) {
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
})

// if we recognize domain name, update the badge to reflect company rating
function domainFound(domainName) {
    var companyName = companyURLMap[domainName];
    var rating;
    var letterGrade;
    var gradeColor;
    var company;

    getData("companyToData", function (companyData) {
        companyData = companyData["companyToData"];
        company = companyData[companyName];
        rating = company["rating"];
        switch (rating) {
            case 'Praises, No Criticisms':
                letterGrade = 'A';
                gradeColor = '#5B8959';
                break;
            case 'Lesser Praises, No Criticisms':
                letterGrade = 'B';
                gradeColor = '#71C17A';
                break;
            case 'Lesser Criticisims':
                letterGrade = 'C';
                gradeColor = '#F0BB58';
                break;
            case 'Criticisms':
                letterGrade = 'D';
                gradeColor = '#F07D21';
                break;
            case 'Boycott':
                letterGrade = 'F';
                gradeColor = '#FA5D5B';
                break;
            default:
                letterGrade = '?';
                gradeColor = '#B1B3B6';
        }
        chrome.browserAction.setBadgeText({ text: letterGrade });
        chrome.browserAction.setBadgeBackgroundColor({ color: gradeColor });
    });
}
