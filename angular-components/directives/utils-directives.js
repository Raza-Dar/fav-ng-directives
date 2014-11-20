angular.module('tcApp.utils.directives', [])
.directive('rcSubmit', ['$parse', function ($parse) {
        /* this code is taken from to check fields validity on submit...
            ///http://code.realcrowd.com/on-the-bleeding-edge-advanced-angularjs-form-validation/
         */

        return {
            restrict: 'A',
            require: ['rcSubmit', '?form'],
            controller: ['$scope', function ($scope) {
                this.attempted = false;

                var formController = null;

                this.setAttempted = function() {
                    this.attempted = true;
                };

                this.setFormController = function(controller) {
                  formController = controller;
                };

                this.needsAttention = function (fieldModelController) {
                    if (!formController){
                        return false;
                    }

                    if (fieldModelController) {
                        return fieldModelController.$invalid && (fieldModelController.$dirty || this.attempted);
                    } else {
                        return formController && formController.$invalid && (formController.$dirty || this.attempted);
                    }
                };
            }],
            compile: function(cElement, cAttributes, transclude) {
                return {
                    pre: function(scope, formElement, attributes, controllers) {

                        var submitController = controllers[0];
                        var formController = (controllers.length > 1) ? controllers[1] : null;

                        submitController.setFormController(formController);

                        scope.rc = scope.rc || {};
                        scope.rc[attributes.name] = submitController;
                    },
                    post: function(scope, formElement, attributes, controllers) {

                        var submitController = controllers[0];
                        var formController = (controllers.length > 1) ? controllers[1] : null;
                        var fn = $parse(attributes.rcSubmit);

                        formElement.bind('submit', function (event) {
                            submitController.setAttempted();
                            if (!scope.$$phase){
                                scope.$apply();
                            }

                            if (!formController.$valid){
                                return false;
                            }

                            scope.$apply(function() {
                                fn(scope, {$event:event});
                            });
                        });
                    }
              };
            }
        };
    ///}]
}])
    .filter('noFractionCurrency',
        [ '$filter', '$locale',
            function(filter, locale) {
                var currencyFilter = filter('currency');
                var formats = locale.NUMBER_FORMATS;
                return function(amount, currencySymbol) {
                    var value = currencyFilter(amount, currencySymbol);
                    var sep = value.indexOf(formats.DECIMAL_SEP);
                    if(amount >= 0) {
                        return value.substring(0, sep);
                    }
                    return value.substring(0, sep) + ')';
                };
            }
        ])
    .directive('markDropdown', [function () {
        return {
            scope: {
                model: '=markDropdown',
                callback: '&callback'
            },
            link: function (scope, elm, attr) {
                scope.is_open = false;
                scope.changeSelectList = function (li) {
                    var element = angular.element(elm),
                        label = element.find('.dropdown-label'),
                        list_items = element.find('.dropdown-menu li');
                    list_items.removeClass('active');
                    angular.element(li).addClass('active');
                    label.text(li.attr('data-name'));
                };
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
            }
        };
    }])
    .directive('catchEnter', [function () {
        /* This directive will capture the enter keypress on input element and
         * will the catchEnter callback function accordingly ..
         * **/
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.catchEnter);
                    });
                    //element.blur();
                    event.preventDefault();
                }
            });
        };
    }]).directive("passwordVerify",[ function() {
        /** This directive used to verify the confirm password field.
         * **/
        return {
            require: "ngModel",
            scope: {
                passwordVerify: '='
            },
            link: function(scope, element, attrs, ctrl) {
                scope.$watch(function() {
                    var combined;

                    if (scope.passwordVerify || ctrl.$viewValue) {
                        combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                    }
                    return combined;
                }, function(value) {
                    if (value) {
                        ctrl.$parsers.unshift(function(viewValue) {
                            var origin = scope.passwordVerify;
                            if (origin !== viewValue) {
                                ctrl.$setValidity("passwordVerify", false);
                                return undefined;
                            } else {
                                ctrl.$setValidity("passwordVerify", true);
                                return viewValue;
                            }
                        });
                    }
                });
            }
        };
    }]).directive('eatClick',['$timeout', function($timeout){
        /* This directive helps to stay open even after clicking it's content
         * the dropdown will be closed by simply clicking outside the dropdown container.
         * **/
        return {
            link:function(scope, elm, attr){
                $timeout(function(){
                    elm.find(".dropdown-menu").on('click', function(event){
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                    });
                });
            }
        };
    }])

    .directive('onEsc', [function () {
        // On esc event
        return function (scope, elm, attr) {
            elm.bind('keydown', function (e) {
                if (e.keyCode === 27) {
                    scope.$apply(attr.onEsc);
                }
            });
        };
    }])

    .directive('onEnter', [ function () {
        // On enter event
        return function (scope, elm, attr) {
            elm.bind('keypress', function (e) {
                if (e.keyCode === 13) {
                    scope.$apply(attr.onEnter);
                    e.stopPropagation();
                    e.preventDefault();
                }
            });
        };
    }])

    .directive('showLoader', [function(){
        /*this directive shows the loader image centered
         * positioned by using the passed boolean value
         * **/
        return{
            scope: {
                show_loader : '=showLoader'
            },

            template : '<div class="row"><div class="col-md-offset-5 col-md-2 padtb10" ng-show="show_loader "> <div class="green-loader"></div> </div></div>',
            link: function(scope, elm, attr){
                /*scope.$watch('show_loader', function(new_val, old_val){
                 });*/
            }
        };
    }]).directive('stickyAlert', [function(){
        /*this directive make the alerts stick to top of the page
         * top of all elements with the centered alignment.
         * **/
        return {
            link:  function(scope, elm, attr ){

                setTimeout(function(){
                    var element = angular.element(elm);
                    element.css({
                        position: 'fixed',
                        'z-index': 9999,
                        width: '710px',
                        padding: '8px',
                        border: '2px solid'
                    });

                    var w_width = angular.element(window).width();
                    var left = ((w_width - element.width())/2) + 'px';
                    var childrens = element.parent('.alert-wrapper').children('.alert');
                    var child_heights = 71;////10 - for bottom padding, 41 for header;
                    for(var i= 0; i < element.index(); i++){
                        child_heights = child_heights + angular.element(childrens[i]).height() + 25  ;
                    }
                    element.css({
                        top : child_heights + 'px',
                        left : left
                    });
                });
            }
        };
    }]).directive('ngPrint', [function () {
        /*Made any section of the current page printable by using browser print feature
         * **/
        var printSection = document.getElementById('printSection');

        // if there is no printing section, create one
        if (!printSection) {
            printSection = document.createElement('div');
            printSection.id = 'printSection';
            document.body.appendChild(printSection);
        }

        function link(scope, element, attrs) {
            element.on('click', function () {
                printSection.innerHTML = '';
                var elemToPrint = document.getElementById(attrs.printElementId);
                if (elemToPrint) {
                    printElement(elemToPrint);
                    window.print();
                }
            });

            window.onafterprint = function () {
                // clean the print section before adding new content
                printSection.innerHTML = '';
            };
        }

        function printElement(elem) {
            // clones the element you want to print
            var domClone = elem.cloneNode(true);
            printSection.appendChild(domClone);
        }

        return {
            link: link,
            restrict: 'A'
        };
    }]).directive('restrictNumbers', [function () {
        /*this directive restrice an input form element to only take number's as a string
         * **/
        return function (scope, element, attrs) {
            element.bind("keypress", function (evt) {
                var charCode = null;
                if(evt.which){
                    charCode = evt.which;
                } else{
                    charCode = event.keyCode;
                }
                if (charCode > 31 && (charCode < 48 || charCode > 57)){
                    return false;
                }
                return true;
            });
        };
    }])
    .directive('tcTableSort', [ function () {
        /*tcTableSort Directive used to enable backend sorting on Html Tables
         * **/
        return {
            scope : {
                sort_by : '=tcTableSort',
                sort_order : '=sortOrder',
                callback : '&callback'
            },
            link: function (scope, element, attr) {
                var elm = angular.element(element);
                elm.find('th.sort-item').on("click", function (evt) {
                    var id = angular.element(this).attr('id');
                    elm.find('th.sort-item .fa').removeClass('fa-chevron-up fa-chevron-down');
                    scope.$apply(function(){
                        if(scope.sort_by === id){
                            if(scope.sort_order === 'asc'){
                                scope.sort_order = 'desc';
                            }else{
                                scope.sort_order = 'asc';
                            }
                        }else{
                            scope.sort_by = id;
                            scope.sort_order = 'asc';
                        }
                    });
                    if(scope.sort_order === 'asc'){
                        angular.element(this).find('.fa').addClass('fa-chevron-up');
                    }else{
                        angular.element(this).find('.fa').addClass('fa-chevron-down');
                    }
                    scope.callback();
                });
            }
        };
    }]).directive('ngElevateZoom',[ function() {
        /*This directive user jquery ElavateZoom plugin to make images zoom on over/hover
         * **/
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                //console.log("Linking");

                //Will watch for changes on the attribute
                attrs.$observe('zoomImage',function(){
                    linkElevateZoom();
                });

                var linkElevateZoom = function (){
                    //Check if its not empty
                    if (!attrs.zoomImage){
                        return;
                    }
                    element.attr('data-zoom-image',attrs.zoomImage);
                    $(element).elevateZoom({
                        /*zoomType : 'Lens',
                         lenszoom : true
                         */
                        //zoomWindowPosition : 1,
                        /*tint:true,
                         tintColour:'#F90',
                         tintOpacity:0.5,
                         zoomWindowWidth:120,
                         zoomWindowHeight:200*/
                    });
                };

                linkElevateZoom();

            }
        };
    }])
    /////////////////Popover module starts /////////////////////
    .directive("popoverHtmlUnsafePopup", [ function () {
        /*Use these directive's to use popover to render Html string..
         * */
        return {
            restrict: "EA",
            replace: true,
            scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&" },
            templateUrl: "utils/directive-templates/popover-html-unsafe-popup.tpl.html"
        };
    }])

    .directive("popoverHtmlUnsafe", [ "$tooltip", function ($tooltip) {
        /*Use these directive's to use popover to render Html string..
         * */
        return $tooltip("popoverHtmlUnsafe", "popover", "click");
    }])
    /////////////////Popover module ends/////////////////////

    .directive('inlineEdit',['$timeout', function ($timeout) {
        /** This directive allow text to be edited in-line by simply clicking the text
         *  It can render both the input field as well the textarea.
         * */
        return {
            scope: {
                model: '=inlineEdit',
                pholder: '=pholder',
                handleSave: '&onSave',
                handleSaveAndNext: '&onSaveAndNext',
                handleCancel: '&onCancel',
                editing: '=editing',
                field_type: '=fieldType'
            },
            link: function (scope, elm, attr) {
                var previousValue;
                scope.field_type = attr.fieldType;
                scope.editMode = scope.editing;
                scope.renderTemplate = function(type){
                    return scope.field_type===type;
                };
                scope.edit = function () {
                    scope.editMode = true;
                    previousValue = scope.model;
                    $timeout(function () {
                        var ta = elm.find('textarea')[0];
                        if(scope.field_type === 'textfield')
                        {
                            ta = elm.find('input[type=text]')[0];
                        }
                        ta.focus();
                        $(ta).autogrow();
                        ta.value = '';
                        ta.value = scope.model;
                        ta.scrollTop = ta.scrollHeight;
                    }, 0, false);
                };
                scope.save = function () {
                    if(!validateEmptyText(elm))
                    {
                        return false;
                    }
                    scope.editMode = scope.editing;
                    scope.handleSave({value: scope.model});
                };
                scope.saveAndNext = function () {
                    if(!validateEmptyText(elm))
                    {
                        return false;
                    }
                    scope.editMode = scope.editing;
                    scope.handleSaveAndNext({value: scope.model});
                    setTimeout(function(){
                        var scroll_to= angular.element('#'+ attr.scrollTo);
                        if(scroll_to.parent().parent()[0]){
                            scroll_to.parent().parent().scrollTop(scroll_to.parent().parent()[0].scrollHeight);
                        }
                    });
                };
                scope.cancel = function () {
                    scope.editMode = scope.editing;
                    scope.model = previousValue;
                    scope.handleCancel({value: scope.model});
                    resetValidation(elm);
                };
                function validateEmptyText(elm)
                {
                    var value = "";
                    var elem = null;
                    //if(elm.find('textarea')[0] != null)
                    if(scope.field_type === 'textarea')
                    {
                        elem = elm.find('textarea')[0];
                        value = elem.value;
                    }
                    //else if(elm.find('input[type=text]')[0] != null)
                     else if(scope.field_type === 'textfield')
                    {
                        elem = elm.find('input[type=text]')[0];
                        value = elem.value;
                    }
                    if(value === "")
                    {
                        elem.style.borderColor = "#FF0000";
                        return false;
                    }
                    else {
                        elem.style.borderColor = "";
                        return true;
                    }
                }

                function resetValidation(elm)
                {
                    var elem = null;
                    if(scope.field_type === 'textarea')
                    {
                        elem = elm.find('textarea')[0];
                    }
                    //else if(elm.find('input[type=text]')[0] != null)
                    else if(scope.field_type === 'textfield')
                    {
                        elem = elm.find('input[type=text]')[0];
                    }
                    elem.style.borderColor = "";
                }
            },
            templateUrl: function (tElement, tAttrs) {
                /*if (scope.field_type === 'textfield'){
                 return 'utils/directive-templates/inline-edit-field.tpl.html';
                 }else{*/
                return 'utils/directive-templates/inline-edit.tpl.html';
                //}
            }
        };
    }])

// see gist: https://gist.github.com/aberke/042eef0f37dba1138f9e
//////////////////Phone number module starts////////////////////
    .directive('phonenumberDirective', ['$filter', function($filter) {
        /*
         Intended use:
         <phonenumber-directive placeholder='prompt' model='someModel.phonenumber'></phonenumber-directive>
         Where:
         someModel.phonenumber: {String} value which to bind only the numeric characters [0-9] entered
         ie, if user enters 617-2223333, value of 6172223333 will be bound to model
         prompt: {String} text to keep in placeholder when no numeric input entered
         */

        function link(scope, element, attrs, ctrl) {

            if(attrs.addClass){
                angular.element('.phonenumber').addClass(attrs.addClass);
            }

            // scope.inputValue is the value of input element used in template
            //scope.inputValue = scope.phonenumberModel;
            scope.inputValue = scope.phonenumberModel;

            var checkValidation = function(){
                $('#'+ scope.errorId).first().addClass('hide');
                //scope.$apply(function () {
                ctrl.$setValidity('minError',true);
                if(scope.phonenumberModel.length < 10 && scope.phonenumberModel !== ''){
                    ctrl.$setValidity('minError', false);
                    $('#'+ scope.errorId).first().removeClass('hide');
                }
                //});
                /*if(!scope.$$phase) {
                 //$digest or $apply
                 scope.$apply();
                 }*/
            };
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    checkValidation();
                    ///event.preventDefault();
                }
            })
                .bind('focusout', function(evt){
                    checkValidation();
                });
            scope.$watch('inputValue', function(value, oldValue) {
                value = String(value);
                var number = value.replace(/[^0-9]+/g, '');
                scope.phonenumberModel = number;
                scope.inputValue = $filter('phonenumber')(number);
                if(scope.phonenumberModel.length >= 10){
                    checkValidation();
                }
            });
        }

        return {
            link: link,
            require: 'ngModel',
            restrict: 'E',
            scope: {
                phonenumberPlaceholder: '=placeholder',
                phonenumberModel: '=ngModel',
                fieldName : '=fieldName',
                errorId : '=errorId'//,
                ///addClass : '='
            },
            //templateUrl: '/static/phonenumberModule/template.html',
            template: '<input ng-model="inputValue" type="text" class="form-control phonenumber" name="{{fieldName}}" placeholder="{{phonenumberPlaceholder}}" title="Phonenumber (Format: (999) 9999-9999)" required />'
        };
    }])

    .filter('phonenumber', [ function() {
        /*
         Format phonenumber as: c (xxx) xxx-xxxx
         or as close as possible if phonenumber length is not 10
         if c is not '1' (country code not USA), does not use country code
         */

        return function (number) {
            /*
             @param {Number | String} number - Number that will be formatted as telephone number
             Returns formatted number: (###) ###-####
             if number.length < 4: ###
             else if number.length < 7: (###) ###

             Does not handle country codes that are not '1' (USA)
             */
            if (!number) { return ''; }

            number = String(number);

            // Will return formattedNumber.
            // If phonenumber isn't longer than an area code, just show number
            var formattedNumber = number;

            // if the first character is '1', strip it out and add it back
            var c = (number[0] == '1') ? '1 ' : '';
            number = number[0] == '1' ? number.slice(1) : number;

            // # (###) ###-#### as c (area) front-end
            var area = number.substring(0,3);
            var front = number.substring(3, 6);
            var end = number.substring(6, 10);

            if (front) {
                formattedNumber = (c + "(" + area + ") " + front);
            }
            if (end) {
                formattedNumber += ("-" + end);
            }
            return formattedNumber;
        };
    }]);
//////////////////Phone number module end////////////////////
