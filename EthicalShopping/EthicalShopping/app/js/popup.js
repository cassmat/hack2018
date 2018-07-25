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

var fakePraiseList = ["test1", "test2", "test3"];
var fakeCritisimList = ["test3", "test4", "test5"];
addPraises(fakePraiseList); 
addCritisim(fakeCritisimList)
addCorrectPhrase("This is hardcoded atm");

function addPraises(arr) {
    var parentNode = document.getElementById("Praise_Dynamic_List");

    // Loop through list and add to Praise_Dynamic_List 
    for(var i = 0; i < arr.length; i++)
    {
      // Append 
      var str = arr[i].toString(); 
      var node = document.createElement("li");
      var textNode = document.createTextNode(str);
      node.appendChild(textNode);
      parentNode.appendChild(node);
    }
}

function addCritisim(arr) {
    var parentNode = document.getElementById("Cristisim_Dynamic_List");

    // Loop through list and add to Praise_Dynamic_List 
    for(var i = 0; i < arr.length; i++)
    {
      // Append 
      var str = arr[i].toString(); 
      var node = document.createElement("li");
      var textNode = document.createTextNode(str);
      node.appendChild(textNode);
      parentNode.appendChild(node);
    }
}

function addCorrectPhrase(str) {
  var parentNode = document.getElementById("Phrase_Section"); 
  parentNode.textContent = str
}
