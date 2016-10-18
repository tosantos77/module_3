(function(){
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.constant('EndPoint', "https://davids-restaurant.herokuapp.com/menu_items.json")
.service('MenuSearchService', MenuSearchService)
.directive('itemsLoaderIndicator', ItemsLoaderIndicator)
.directive('foundItems', FoundItems);


function ItemsLoaderIndicator(){
  var ddo = {
    template: 'Number Of Items: {{menu.found.length}}'
  };

  return ddo;
}



function FoundItems(){
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      list: '<',
      onRemove: '&'
    }
  };

  return ddo;
}





NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService){
  var menu = this;

  menu.number = "0";

  menu.getMatchedMenuItems = function(searchTerm){
    var promisse = MenuSearchService.getMatchedMenuItems(searchTerm);

    promisse.then(function(result){
      menu.found = result;
      menu.number = menu.found.length;
    });
  }


  menu.removeItem = function(index){
    menu.found.splice(index, 1);
    menu.number = menu.found.length;
  }

}



MenuSearchService.$inject = ['$http', 'EndPoint'];
function MenuSearchService($http, EndPoint){
  var service = this;


  service.getMatchedMenuItems = function(searchTerm){
    return $http({
      method: "GET",
      url: (EndPoint)
    }).then(function(result){
      var i = 0;
      var foundItems = [];

      for(i = 0;i < result.data.menu_items.length;i++){
        if(result.data.menu_items[i].description.indexOf(searchTerm) != -1){
            foundItems.push(result.data.menu_items[i]);
        }
      }

      return foundItems;
    });
  };

}

})();
