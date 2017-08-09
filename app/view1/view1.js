'use strict';
/var host = "http://localhost:8080";
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
        return document.getElementById("pastedArea").innerText;
    };
    $scope.ndoc = "";
    $scope.result = {};
    $scope.handler = {};
    $scope.buttonName = "සිංහල අක්ෂර වින්යාස පරීක්ෂාව ";
    $scope.words = [];

    $scope.alertMe = function (e) {
        $scope.docElm.innerHTML = document.getElementById("pastedArea").innerText
    };

    $scope.checkSpell = function () {
        document.getElementById('btnName').style.backgroundColor = "red";
        document.getElementById('btnName').innerText = "මදක් රැදෙන්න";
        $scope.words = $scope.doc().replace(/[\u00a0]/g, " ").replace(/&nbsp;/, " ").replace(/\s+g/, " ").split(" ");
        console.log($scope.words);
        $http.post(host + "/spell", $scope.doc()).then(function (res) {
            document.getElementById('btnName').style.backgroundColor = "";
            document.getElementById('btnName').innerText = "හරිද?";
            var result = res.data;
            $scope.result = result;
            var range = null;
            var sel = window.getSelection();
            if (sel.rangeCount > 0) {
                range = sel.getRangeAt(0).cloneRange();
                range.collapse(true);
                range.setStart($scope.docElm, 0);
            }
            var replacements = 0;
            $scope.words.forEach(function (v) {
                if (!result[v]) return;
                var start = range.toString().indexOf(v);
                var end = start + v.length;
                range.setStart($scope.docElm.childNodes.item(replacements), start);
                range.setEnd($scope.docElm.childNodes.item(replacements), end);
                range.deleteContents();

                var elm = document.createElement("span");
                elm.innerText = v;
                elm.style.backgroundColor = 'yellow';
                elm.data = result[v];
                var boundHandler = $scope.handleDisplay.bind(elm, v);
                elm.addEventListener("click", boundHandler);
                range.insertNode(elm);

                replacements = $scope.docElm.childNodes.length - 1;
                range.collapse(true);
                range.setStart($scope.docElm.childNodes.item(replacements), 0);
                range.setEnd($scope.docElm.childNodes.item(replacements), range.startContainer.length);

            });
        });
    };

    $scope.lastWordActive = null;

    $scope.handleDisplay = function (word, me) {

        if ($scope.lastWordActive) {
            $scope.lastWordActive.style.fontWeight = "normal";
            $scope.lastWordActive.style.backgroundColor = "";
        }

        $scope.lastWordActive = this;

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