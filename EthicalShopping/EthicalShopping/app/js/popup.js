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

getData("companyToData", function(val){
  nikeData = val["companyToData"]["Nike"];
  praiseList = nikeData["praise"];
  critisimList = nikeData["criticism"];
  addPraises(praiseList); 
  addCritisim(critisimList)
  addCorrectPhrase("This is hardcoded atm");
})

function addPraises(arr) {
    var parentNode = document.getElementById("Praise_Dynamic_List");
   // document.getElementById("Praise_Count").textContent = arr.length.toString();

    // Loop through list and add to Praise_Dynamic_List 
    for(var i = 0; i < arr.length; i++)
    {
      // Append 
      var str = arr[i]["title"].toString(); 
      var node = document.createElement("li");
      var textNode = document.createTextNode(str);
      console.log(node)
      node.appendChild(textNode);
      parentNode.appendChild(node);
    }
}

function addCritisim(arr) {
    var parentNode = document.getElementById("Cristism_Dynamic_List");
    //document.getElementById("Criticism_Count").textContent = arr.length.toString();

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