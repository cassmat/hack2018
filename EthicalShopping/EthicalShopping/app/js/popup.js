// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Team Ethicly

//simply collpasable with more info button

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  updatePopup(tab);
})

chrome.tabs.getSelected(null, function(tab) {
  updatePopup(tab);
});


function addPraises(arr) {
    var parentNode = document.getElementById("Praise_Dynamic_List");
    //clear old text before adding new.
    while (parentNode.firstChild) {
      parentNode.removeChild(parentNode.firstChild);
    }
    document.getElementById("Praise_Count").textContent = arr.length.toString();

    // Loop through list and add to Praise_Dynamic_List 
    for(var i = 0; i < arr.length; i++)
    {
      // Append 
      var str = arr[i]["title"].toString(); 
      var node = document.createElement("li");
      var textNode = document.createTextNode(str);
      node.appendChild(textNode);
      parentNode.appendChild(node);
    }
}

function addCritisim(arr) {
    var parentNode = document.getElementById("Cristism_Dynamic_List");
    //clear old text before adding new.
    while (parentNode.firstChild) {
      parentNode.removeChild(parentNode.firstChild);
    }
    document.getElementById("Criticism_Count").textContent = arr.length.toString();

    // Loop through list and add to Praise_Dynamic_List 
    for(var i = 0; i < arr.length; i++)
    {
      // Append 
      var str = arr[i]["title"].toString(); 
      var node = document.createElement("li");
      console.log(node);
      var textNode = document.createTextNode(str);
      node.appendChild(textNode);
      parentNode.appendChild(node);
    }
}

//todo fix this to actually be hooked up to the new html 
function addCorrectPhrase(str) {
  var parentNode = document.getElementById("Phrase_Section"); 
  parentNode.textContent = str
}

function getData(key, callback){
  chrome.storage.local.get([key], function(obj) {
    callback(obj);
  })
}

function setCompanyTitle(companyTitle){
  var parentNode = document.getElementById("Company_Title");
  parentNode.textContent = companyTitle;
}

function setCompanyRanking(ratingDescription){
  var parentNode = document.getElementById("Rating_Img");
  var imgPath = "images/regularRankings/";
  switch(ratingDescription) {
    case 'Praises, No Criticisms':
      imgPath += "A_button.png";
      break;
    case 'Lesser Praises, No Criticisms':
      imgPath += "b_button.png";
      break;
    case 'Lesser Criticisims':
      imgPath += "c_button.png";
      break;
    case 'Criticisms':
      imgPath += "dbutton.png";
      break;
    case 'Boycott':
      imgPath += "f_button.png";
      break;
    default:
      imgPath += "unavailable_button.png";
  }
  parentNode.src = imgPath;
}

function updatePopup(tab){
  getData("urlToCompany", function(urlList){
    getData("companyToData", function(companyList){
      domainFound = false;
      keyList = Object.keys(urlList["urlToCompany"]);
      for (var i = 0; i < keyList.length; i++) {
        url = keyList[i];
        if (tab.url.includes(url))
        {
          domainFound = true;
          companyName = urlList["urlToCompany"][url];
          companyList = companyList["companyToData"];
          companyData = companyList[companyName];
          praiseList = companyData["praise"];
          critisimList = companyData["criticism"];
          addPraises(praiseList); 
          addCritisim(critisimList);
          setCompanyTitle(companyName);
          setCompanyRanking(companyData["rating"]);
          addCorrectPhrase("This is hardcoded atm");
          break;
        }
      } 
      if (!domainFound){
          addPraises([]);
          addCritisim([]);
      }     
    })
  })
}