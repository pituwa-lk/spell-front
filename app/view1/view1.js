'use strict';
var host = "http://localhost:8080";
//var host = "http://spell.pituwa.lk";
angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}]).controller('View1Ctrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {

    $interval(function () {
        $http.get(host + "/stats").then(function (res) {
            if (res.data.words - $scope.words != 0) {
                $scope.wordDiff = res.data.words - $scope.words;
            }
            $scope.words = res.data.words;
            $scope.sites = res.data.sites;
        });
    }, 30000);

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
    $scope.checkSpell = function () {
        var words = $scope.doc().split(" ");

        $http.post(host + "/bulk", words).then(function (res) {
            var result = res.data;
            $scope.docElm.innerHTML = "";
            var errors = 0;
            words.map(function (word) {
                result[word] = result[word].reverse();
                var correct = result[word][0] === word;
                var elm = null;
                if (!correct) {
                    errors++;
                    elm = document.createElement("span");
                    elm.innerText = word;
                    elm.style.backgroundColor = 'yellow';
                    elm.data = result[word];
                    elm.addEventListener("click", function (e) {
                        $scope.handleDisplay(elm, e, word);
                    });
                } else {
                    elm = document.createTextNode(word)
                }
                $scope.docElm.appendChild(elm);
                var space = document.createTextNode(" ");
                $scope.docElm.appendChild(space);
            });
            if (errors === 0) {
                $scope.checkResult.innerText = "සිය ලුවච නනිවැරදී";
            }
        });
    };

    $scope.handleDisplay = function (elm, me, word) {
        var ulx = document.getElementById("ulWordList");
        var words  = elm.data;

        while(ulx.getElementsByTagName("li").length > 0) {
            var lis = ulx.getElementsByTagName("li");
            ulx.removeChild(lis[0]);
        }

        words.forEach(function (v, k) {
            var li = document.createElement("li");
            li.innerHTML = v;
            ulx.appendChild(li);
        });

        var clsWord = document.getElementsByClassName("word")
        for (var i = 0; i < clsWord.length; i++) {
            clsWord[i].style.opacity = 0.4;
            clsWord[i].style.fontWeight = "normal";
        }

        elm.style.opacity = 1.0;
        elm.style.fontWeight = 800;
        var wordList = document.getElementById("wordList");
        var writePad = document.getElementById("writePad");
        wordList.style.top = me.pageY + "px";
        wordList.style.left = (me.pageX + 50) + "px";
    };

}]);

/*function handleDisplay(clk, elm, words, e) {
    console.log(e);
}

var zwidth = [];

function selectList(words, dst)
{


    if (words === undefined || words.length === 0) {
        $http.get("http://localhost:8080/lvar?lookup=" + v + "&size=" + v.length - 2).then(function (res) {
            words = res.data;

            var clsWord = document.getElementsByClassName("word")
            for (var i = 0; i < clsWord.length; i++) {
                clsWord[i].style.opacity = 0.4;
            }
            dst.style.opacity = 1.0;
            dst.style.fontWeight = 800;
            var wordList = document.getElementById("wordList");
            var writePad = document.getElementById("writePad");
            wordList.style.top = dst.style.top;
            var idx2 = dst.id.substring(2, 3);
            var sumx = 0;
            for (var i = 0; i < idx2; i++) sumx += zwidth[i];
            wordList.style.left = sumx + "px";
        });
    } else {*/