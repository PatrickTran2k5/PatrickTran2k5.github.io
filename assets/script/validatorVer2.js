
function Validator(formSelector) {
    var _this = this;
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }

            element = element.parentElement;
        }
    };

    var formRules = {};

    /*
        // Quy ước tạo rule:
        - Nếu có lỗi => return 'error message'
        - Nếu ko có lỗi => return 'undefined'
    */
    var ValidatorRules = {
        required: (value) => {
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: (value) => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email';
        },
        min: (min) => {
           return (value) => {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`;
           }
        },
        max: (max) => {
            return (value) => {
                 return value.length <= max ? undefined : `Chỉ được nhập tối đa ${min} kí tự`;
            }
         },
    };


    // Lấy ra form element trong DOM theo 'formSelector'
    var formElement = document.querySelector(formSelector);

    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]')
        for (var input of inputs) {
            var rules = input.getAttribute('rules').split('|');
            for (var rule of rules) {

                var isRuleHasValue = rule.includes(':');
                if (isRuleHasValue) {
                    var ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }
                
                var ruleFunc = ValidatorRules[rule];
                if (isRuleHasValue) {
                    ruleFunc = ValidatorRules[rule](ruleInfo[1]);
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] = [ruleFunc];
                }
            }
        
            // Lắng nghe sự kiện để validate (blur, change, ...)
            input.onblur = handleValidate;
            input.oninput = handleClearError;

        }
        // Hàm thực hiện validate
        function handleValidate(event) {
            var rules = formRules[event.target.name];
            var errorMessage;

            for (var rule of rules) {
                errorMessage = rule(event.target.value);
                if(errorMessage) break;
            }

            // Nếu có lỗi thì hiễn thị message ra UI
            if (errorMessage) {
                var formGroup = getParent(event.target, '.form-group');
                if (formGroup) {
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            }

            return !errorMessage;
        }
        // Hàm clear message lỗi khi có input thỏa mãn
        function handleClearError(event) {
            var formGroup = getParent(event.target, '.form-group');
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');

                var formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.innerText = '';
                    }
            }
        }
    }

    

    // Xử lí hành vi submit form
    formElement.onsubmit = (event) => {
        event.preventDefault();

        var inputs = formElement.querySelectorAll('[name][rules]')
        var isValid = true;

        for (var input of inputs) {
            if (!handleValidate({target: input})) {
                isValid = false;
            }
        }

        // Khi ko có lỗi thì submit form
        if (isValid) {
            if (typeof _this.onSubmit === 'function') {
                var enableInputs = formElement.querySelectorAll('[name]:not([disabled])'); ;
                    
                var formValues = Array.from(enableInputs).reduce((values, input) => {
                    switch(input.type) {
                        case 'checkbox':
                            if (!input.matches(':checked')) {
                                values[input.name] = [];
                                return values;
                            }
    
                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = [];
                            }
                            values[input.name].push(input.value);
                            break;
                        case 'radio':
                            values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                    } 
                    return values;
                }, {});
                _this.onSubmit(formValues);
            } else {
                formElement.submit();
            }
        }
    }
}