// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

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
addPraises(fakePraiseList); 

function addPraises(array) {
    console.log("in addPraise")
    var ul = document.getElementById("Praise_Dynamic_Listt");
    
    // Loop through list and add to Praise_Dynamic_List 
    var i = 0;
    var len = array.length;

    for(; i < len; i++)
    {
      // Append 
      var li = document.createElement("li");
      li.setAttribute('id', array[i]);
      li.appendChild(document.createTextNode(array[i]));
      ul.appendChild(li);

    }
}

// function removePrase(){
//     var ul = document.getElementById("dynamic-list");
//     var candidate = document.getElementById("candidate");
//     var item = document.getElementById(candidate.value);
//     ul.removeChild(item);
// }
