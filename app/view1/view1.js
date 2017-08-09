'use strict';
//var host = "http://localhost:8080";
var host = "http://spell.pituwa.lk";
angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}]).controller('View1Ctrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {

    $scope.wordDiff = 0;
    $scope.sites = 0;
    $scope.words = 0;
    $scope.docElm = document.getElementById("pastedArea");
    $scope.checkResult = document.getElementById('checkResult');
    $scope.doc =  function () {
        console.log({"object" : document.getElementById("pastedArea").innerText.replace("\&nbsp;", " ")});
        return document.getElementById("pastedArea").innerText.replace("\&nbsp;", " ");
    };
    $scope.ndoc = "";
    $scope.result = {};
    $scope.handler = {};
    $scope.buttonName = "සිංහල අක්ෂර වින්යාස පරීක්ෂාව ";
    $scope.checkSpell = function () {
        //var words = $scope.doc().split(" ");
        $http.post(host + "/spell", $scope.doc()).then(function (res) {
            var result = res.data;
            $scope.result = result;
            var range = null;
            var sel = window.getSelection();
            if (sel.rangeCount > 0) {
                range = sel.getRangeAt(0).cloneRange();
                range.collapse(true);
                range.setStart($scope.docElm, 0);
            }
            console.log(Object.keys(result));
            Object.keys(result).forEach(function (v) {
                var start = 0;
                var childIndex = 0;
                while (-1 != (start = range.toString().indexOf(v, 0))) {
                    //var start = range.toString().indexOf(v);
                    console.log(start);
                    var end = start + v.length;
                    range.setStart($scope.docElm.childNodes.item(childIndex), start);
                    range.setEnd($scope.docElm.childNodes.item(childIndex), end);
                    range.deleteContents();

                    var elm = document.createElement("span");
                    elm.innerText = v;
                    elm.style.backgroundColor = 'yellow';
                    elm.data = result[v];
                    var boundHandler = $scope.handleDisplay.bind(elm, v);
                    elm.addEventListener("click", boundHandler);
                    range.insertNode(elm);
                    if ($scope.docElm.childNodes.length === (childIndex + 3)) {
                        childIndex += 2; //we + 2 because now there is at least 2 extra segments.
                    } else {
                        childIndex++;
                    }

                    range.collapse(true);
                    range.setStart($scope.docElm.childNodes.item(childIndex), 0);
                    range.setEnd($scope.docElm.childNodes.item(childIndex), range.startContainer.length);
                    console.log("fooooo " + range.toString());
                }
                range.setStart($scope.docElm, 0);
            });
        });
    };

    $scope.handleDisplay = function (word, me) {
        var ulx = document.getElementById("ulWordList");
        var words  = this.data;

        while(ulx.getElementsByTagName("li").length > 0) {
            var lis = ulx.getElementsByTagName("li");
            ulx.removeChild(lis[0]);
        }

        var that = this;

        words.forEach(function (v, k) {
            var li = document.createElement("li");
            li.innerHTML = v;
            li.addEventListener("mouseover", function (e) {
               e.srcElement.style.backgroundColor = "#34c3ef";
               e.srcElement.style.fontWeight= 700;
               e.srcElement.style.color = "#ffffff";
            });
            li.addEventListener("mouseout", function (e) {
                e.srcElement.style.backgroundColor = "";
                e.srcElement.style.fontWeight= "";
                e.srcElement.style.color = "";
            });

            li.addEventListener("click", function (e) {
                that.innerText = this.innerText;
                wordList.style.display = "none";
                that.style.fontWeight = "normal";
                that.style.backgroundColor = "";
            });

            ulx.appendChild(li);
        });

        var clsWord = document.getElementsByClassName("word")
        for (var i = 0; i < clsWord.length; i++) {
            clsWord[i].style.opacity = 0.4;
            clsWord[i].style.fontWeight = "normal";
        }

        this.style.opacity = 1.0;
        this.style.fontWeight = 800;
        var wordList = document.getElementById("wordList");
        var writePad = document.getElementById("writePad");
        wordList.style.top = me.pageY + "px";
        wordList.style.left = (me.pageX + 25) + "px";
        wordList.style.display = "block";
    };

}]);