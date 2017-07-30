'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}]).controller('View1Ctrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {

    $interval(function () {
        $http.get("http://localhost:8080/stats").then(function (res) {
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
    $scope.doc = "";
    $scope.ndoc = "";
    $scope.result = {};
    $scope.handler = {};
    $scope.buttonName = "සිංහල අක්ෂර වින්යාස පරීක්ෂාව ";
    $scope.checkSpell = function () {
        var pastedArea = document.getElementById("pastedArea");
        pastedArea.innerText = "";
        var words = $scope.doc.split(" ");
        $http.post("http://localhost:8080/bulk", words).then(function (res) {
            var result = res.data;
            Object.keys(result).map(function (v, k) {
                var words = result[v];
                var correct = (words.length !== 0) || words[0] === v;
                $scope.wordElms[v].data = words;
                if (correct) {
                    $scope.wordElms[v].elms.forEach(function (v, k) {
                      v.elm.style.color = "green";
                    });
                } else {
                    $scope.wordElms[v].elms.forEach(function (v, k){
                        v.elm.style.color = "red";
                    });
                }
            })
        });

    var temps = words.map(function(v, k) {
          var elmWord = document.createElement("span");
          var elmId = "WW" + k + v
          elmWord.id = elmId;
          elmWord.innerHTML = v;
          elmWord.style.display = "inline-block";
          elmWord.className = "word";
          elmWord.addEventListener("click", function (e) {
              $scope.handleDisplay(elmWord, e, v);
          });
          pastedArea.appendChild(elmWord);
          var handler = null; //$scope.resultDraw.bind(elmWord, v);
          return {word: v, elms: {elm: elmWord, handler: handler}}
        });

    $scope.wordElms = temps.reduce(function (acl, v) {
        if (!acl[v.word]) acl[v.word] = { elms : [v.elms], data: [] };
        else acl[v.word].elms.push(v.elms);
        return acl;
    }, {});
    };

    /*$scope.resultDraw = function(v, res) {
        //var m = document.getElementById("WW" + k + v);
        if (res.data.length === 0) {
            this.style.color = "red";
            $scope.retryLess(v, v.length - 2);
        } else {
            if (res.data[0] === v) {
                this.style.color = "green";
            }
            $scope.result[v] = res.data;
        }
    };*/

    $scope.handleDisplay = function (elm, me, word) {
        var ulx = document.getElementById("ulWordList");
        var words  = $scope.wordElms[word].data;

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

    $scope.retryLess = function (v, size) {
        $http.get("http://localhost:8080/lookup?lookup=" + v + "&size=" + size).then(function (res) {
            if (res.data.length !== 0) {
                $scope.wordElms[v].data = res.data;
            }
        })
    }



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