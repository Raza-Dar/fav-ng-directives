angular.module('bootstrap-select-dropdown',['ui.bootstrap'])
.run(["$templateCache", function($templateCache) {
  $templateCache.put("dropdown.tpl.html",
    "<div >\n" +
    "    <div class=\"btn-group btn-block animate-if\" dropdown is-open=\"dropdown_options.is_open\">\n" +
    "        <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-block {{ dropdown_options.btn_class }}\"  ng-disabled=\"dropdown_options.disable_btn\"\n" +
    "                ng-class=\"{'btn-lg' : dropdown_options.big_btn}\" data-toggle=\"dropdown\">\n" +
    "            <span class=\"dropdown-label\"></span><span class=\"caret\"></span>\n" +
    "        </button>\n" +
    "        <ul ng-if=\"!dropdown_options.is_key_value\" class=\"dropdown-menu apply-max\" role=\"menu\">\n" +
    "            <li data-ng-repeat=\"item in array_list\" data-value=\"{{ item }}\" data-name=\"{{ item }}\">\n" +
    "                <a href=\"javascript:void(0);\">{{ item }}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <ul ng-if=\"dropdown_options.is_key_value\" class=\"dropdown-menu apply-max\" role=\"menu\">\n" +
    "            <li data-ng-repeat=\"item in array_list\" data-value=\"{{ getValue(item, dropdown_options.key_value)}}\" data-name=\"{{ getValue(item, dropdown_options.key_name) }}\">\n" +
    "                <a href=\"javascript:void(0);\">{{ getValue(item, dropdown_options.key_name) }}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}])
.controller('DemoController', ['$scope','$timeout', function($scope, $timeout){
  //list with key-value pair
  $scope.dropdown_list1 = [];
  $scope.list1_model = null;
  $timeout(function(){
    for(var i=1; i<10; i++){
      $scope.dropdown_list1.push({
        name : "name" + i, value : i
      });
    }
  }, 300);
  //list with string array
  $scope.dropdown_list2 = [];
  $scope.list2_model = "name3";

  for(var i=1; i<10; i++){
      $scope.dropdown_list2.push("name"+i);
  }
  $scope.callback = function(value){
    console.log('Selected Value is: '+value);
  };

}])

.directive('markDdGeneric', [function () {
    /** This directive used the angular UI dropdown feature and generate the dropdown by taking a list and
     * will mark the list with it's model value.
     * This directive also take certain options as an optional parametes like,
     * bool is_open = to open the dropdown automatically
     * bool big_btn  = to use bootstrap big button for dropdown button
     * bool disable_btn = to disabled the dropdown by default
     * string btn_class = to add any class or classes to dropdown button.
     * Example <div ng-if="dropdowns.makes.length" mark-dd-generic="dropdowns.makes" callback="getCarModels(value)" ng-model="search.make"
     dropdown-options="{is_open: open_makes, disable_btn : disable_make, big_btn : false, btn_class:'btn-sm-arrow-right' }">
     </div>
     ***
     * Mandatory: List should be single value list. Like  = ["First Opt", "Second Opt", "Third Opts", "Final Opts"]
     ***/

    return {
        scope: {
            array_list: '=markDdGeneric',
            model : '=ngModel',
            //dropdown_options : '=?dropdownOptions',//// '=' means mandatory these attributes should be provided otherwise there will be an error
            callback: '&callback'
        },
        link:function(scope, elm, attr ){
            var opts = {is_open : false, big_btn : true,disable_btn : false, btn_class : '', is_key_value: false, key_value : '', key_name : ''};
            var updateDropdownOptions = function(){
                if(!attr.dropdownOptions){
                    scope.dropdown_options = opts;
                }else{
                    scope.dropdown_options = scope.$parent.$eval(attr.dropdownOptions);
                    var opts_keys = ['is_open', 'big_btn', 'disable_btn', 'btn_class', 'is_key_value', 'key_value', 'key_name'];
                    angular.forEach(opts_keys, function(key,indx){
                        if(scope.dropdown_options[key] === undefined){
                            scope.dropdown_options[key] = opts[key];
                        }
                    });
                    if(scope.dropdown_options['btn_class'] !== ''){
                        scope.dropdown_options['big_btn'] = false;
                    }
                }
            };
            updateDropdownOptions();
            scope.getValue = function(item, key){
                return item[key];
            };
            scope.changeSelectList = function (li) {
                var element = angular.element(elm),
                    label = element.find('.dropdown-label'),
                    list_items = element.find('.dropdown-menu li');
                list_items.removeClass('active');
                angular.element(li).addClass('active');
                label.text(li.attr('data-name'));
            };
            var initializeList = function (){
                setTimeout(function () {
                    angular.element(elm.find('li')).on('click', function () {
                        var li = angular.element(this);
                        scope.changeSelectList(li);
                        var val = li.attr('data-value');
                        scope.$apply(function(){
                            scope.model = val;
                        });
                        scope.callback({ value: val });
                    });
                    if (scope.model) {
                        scope.changeSelectList(elm.find("li[data-value='" + scope.model + "']"));
                    } else {
                        scope.changeSelectList(angular.element(elm.find('li')[0]));
                    }
                });
            };
            scope.$watchCollection('array_list', function(val){
                initializeList();
                updateDropdownOptions();
            });
            scope.$watchCollection('dropdown_options.is_open', function(val){
                if(val){
                    // attach key listener when dropdown is shown
                    setTimeout(function(){///because in casecade operation binding next dropdown should be delayed until unbinding previous binding..
                        angular.element('body').keypress(function(e){
                            // get the key that was pressed
                            var key = String.fromCharCode(e.which).toUpperCase();
                            var list = angular.element(elm).find('ul').find('li[data-name^="'+ key + '"]');
                            if(list.length > 0){
                                var li = angular.element(list[0]);
                                scope.changeSelectList(li);
                                var val = li.attr('data-value');
                                scope.$apply(function(){
                                    scope.model = val;
                                });
                                scope.callback({ value: val });
                                angular.element(elm).find('ul').scrollTop(angular.element(li).position().top);
                                //scope.is_open = false;
                                ///angular.element(document).unbind("keypress");
                            }
                        });
                    });
                }else{
                    angular.element('body').unbind("keypress");
                }
            });
        },
        templateUrl:'dropdown.tpl.html'
    };
}]);
