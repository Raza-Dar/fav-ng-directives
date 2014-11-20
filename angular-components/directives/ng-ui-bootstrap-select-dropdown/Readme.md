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


ToDo --
1 -  Dynamic List model is't working on controller scope.
2 -  Remove Jquery Dependency...
