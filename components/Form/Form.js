"use strict";

exports.__esModule = true;
exports.Form = void 0;

var _react = _interopRequireWildcard(require("react"));

var _MessageContext = require("../../contexts/MessageContext");

var _FormContext = require("./FormContext");

var _propTypes = require("./propTypes");

var _excluded = ["children", "errors", "infos", "messages", "onChange", "onReset", "onSubmit", "onValidate", "validate", "value"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var defaultValue = {};
var defaultTouched = {};
var defaultValidationResults = {
  errors: {},
  infos: {}
};

var stringToArray = function stringToArray(string) {
  var match = string == null ? void 0 : string.match(/^(.+)\[([0-9]+)\]\.(.*)$/);

  if (match) {
    var arrayName = match[1],
        indexOfArray = match[2],
        arrayObjName = match[3];
    return {
      indexOfArray: indexOfArray,
      arrayName: arrayName,
      arrayObjName: arrayObjName
    };
  }

  return undefined;
};

var getValueForName = function getValueForName(name, value) {
  var isArrayField = stringToArray(name);

  if (isArrayField) {
    var _value$arrayName;

    var indexOfArray = isArrayField.indexOfArray,
        arrayName = isArrayField.arrayName,
        arrayObjName = isArrayField.arrayObjName;
    var obj = (_value$arrayName = value[arrayName]) == null ? void 0 : _value$arrayName[indexOfArray];
    return arrayObjName ? obj == null ? void 0 : obj[arrayObjName] : obj;
  }

  return value[name];
};

var setValueForName = function setValueForName(name, componentValue, prevValue) {
  var nextValue = _extends({}, prevValue);

  var isArrayField = stringToArray(name);

  if (isArrayField) {
    var indexOfArray = isArrayField.indexOfArray,
        arrayName = isArrayField.arrayName,
        arrayObjName = isArrayField.arrayObjName;
    if (!nextValue[arrayName]) nextValue[arrayName] = [];

    if (arrayObjName) {
      var _nextValue$arrayName$;

      if (!nextValue[arrayName][indexOfArray]) nextValue[arrayName][indexOfArray] = (_nextValue$arrayName$ = {}, _nextValue$arrayName$[arrayObjName] = componentValue, _nextValue$arrayName$);
      nextValue[arrayName][indexOfArray][arrayObjName] = componentValue;
    } else nextValue[arrayName][indexOfArray] = componentValue;
  } else {
    nextValue[name] = componentValue;
  }

  return nextValue;
}; // Validating nameValues with the validator and sending correct messaging


var validate = function validate(validator, nameValue, formValue, format, messages) {
  var result;

  if (typeof validator === 'function') {
    result = validator(nameValue, formValue);
  } else if (validator.regexp) {
    if (!validator.regexp.test(nameValue)) {
      result = validator.message || format({
        id: 'form.invalid',
        messages: messages
      });

      if (validator.status) {
        result = {
          message: result,
          status: validator.status
        };
      }
    }
  }

  return result;
}; // Validates particular key in formValue


var validateName = function validateName(nameValidators, required) {
  return function (name, formValue, format, messages) {
    var nameValue = getValueForName(name, formValue);
    var result; // ValidateArg is something that gets passed in from a FormField component
    // See 'validate' prop in FormField

    if (required && ( // false is for CheckBox
    nameValue === undefined || nameValue === '' || nameValue === false || Array.isArray(nameValue) && !nameValue.length)) {
      // There is no value at that name, and one is required
      result = format({
        id: 'form.required',
        messages: messages
      });
    } else if (nameValidators) {
      if (Array.isArray(nameValidators)) {
        nameValidators.some(function (validator) {
          result = validate(validator, nameValue, formValue, format, messages);
          return !!result;
        });
      } else {
        result = validate(nameValidators, nameValue, formValue, format, messages);
      }
    }

    return result;
  };
}; // validations is an array from Object.entries()
// Validates all keys in formValue


var validateForm = function validateForm(validations, formValue, format, messages, omitValid) {
  var nextErrors = {};
  var nextInfos = {};
  validations.forEach(function (_ref) {
    var name = _ref[0],
        _ref$ = _ref[1],
        field = _ref$.field,
        input = _ref$.input;

    if (!omitValid) {
      nextErrors[name] = undefined;
      nextInfos[name] = undefined;
    }

    var result;

    if (input) {
      // input() are validations supplied through useFormInput()
      result = input(name, formValue, format, messages);
    }

    if (field && !result) {
      // field() are validations supplied through useFormField()
      result = field(name, formValue, format, messages);
    } // typeof error === 'object' is implied for both cases of error with
    // a status message and for an error object that is a react node


    if (typeof result === 'object') {
      if (result.status === 'info') {
        nextInfos[name] = result.message;
      } else {
        nextErrors[name] = result.message || result; // could be a node
      }
    } else if (typeof result === 'string') {
      nextErrors[name] = result;
    }
  });
  return [nextErrors, nextInfos];
};

var Form = /*#__PURE__*/(0, _react.forwardRef)(function (_ref2, ref) {
  var children = _ref2.children,
      _ref2$errors = _ref2.errors,
      errorsProp = _ref2$errors === void 0 ? defaultValidationResults.errors : _ref2$errors,
      _ref2$infos = _ref2.infos,
      infosProp = _ref2$infos === void 0 ? defaultValidationResults.infos : _ref2$infos,
      messages = _ref2.messages,
      onChange = _ref2.onChange,
      _onReset = _ref2.onReset,
      _onSubmit = _ref2.onSubmit,
      onValidate = _ref2.onValidate,
      _ref2$validate = _ref2.validate,
      validateOn = _ref2$validate === void 0 ? 'submit' : _ref2$validate,
      valueProp = _ref2.value,
      rest = _objectWithoutPropertiesLoose(_ref2, _excluded);

  var _useContext = (0, _react.useContext)(_MessageContext.MessageContext),
      format = _useContext.format;

  var _useState = (0, _react.useState)(valueProp || defaultValue),
      valueState = _useState[0],
      setValueState = _useState[1];

  var value = (0, _react.useMemo)(function () {
    return valueProp || valueState;
  }, [valueProp, valueState]);

  var _useState2 = (0, _react.useState)(defaultTouched),
      touched = _useState2[0],
      setTouched = _useState2[1];

  var _useState3 = (0, _react.useState)(defaultValidationResults),
      validationResults = _useState3[0],
      setValidationResults = _useState3[1]; // when onBlur input validation is triggered, we need to complete any
  // potential click events before running the onBlur validation.
  // otherwise, click events like reset, etc. may not be registered.
  // for a detailed scenario/discussion,
  // see: https://github.com/grommet/grommet/issues/4863
  // the value of pendingValidation is the name of the FormField
  // awaiting validation.


  var _useState4 = (0, _react.useState)(undefined),
      pendingValidation = _useState4[0],
      setPendingValidation = _useState4[1];

  (0, _react.useEffect)(function () {
    setPendingValidation(undefined);
    setValidationResults({
      errors: errorsProp,
      infos: infosProp
    });
  }, [errorsProp, infosProp]);
  var validations = (0, _react.useRef)({});
  var requiredFields = (0, _react.useRef)([]);
  var buildValid = (0, _react.useCallback)(function (nextErrors) {
    var valid = false;
    valid = requiredFields.current.filter(function (n) {
      return Object.keys(validations.current).includes(n);
    }).every(function (field) {
      return value[field] && (value[field] !== '' || value[field] !== false);
    });
    if (Object.keys(nextErrors).length > 0) valid = false;
    return valid;
  }, [value]); // Remove any errors that we don't have any validations for anymore.

  var filterErrorValidations = function filterErrorValidations(errors) {
    var nextErrors = errors;
    return Object.keys(nextErrors).filter(function (n) {
      return !validations.current[n] || nextErrors[n] === undefined;
    }).forEach(function (n) {
      return delete nextErrors[n];
    });
  }; // Remove any infos that we don't have any validations for anymore.


  var filterInfoValidations = function filterInfoValidations(infos) {
    var nextInfos = infos;
    return Object.keys(nextInfos).filter(function (n) {
      return !validations.current[n] || nextInfos[n] === undefined;
    }).forEach(function (n) {
      return delete nextInfos[n];
    });
  }; // On initial mount, when validateOn is change or blur,
  // set validation results for any set fields and calculate whether
  // the form is valid overall.


  (0, _react.useEffect)(function () {
    var validationsForSetFields = Object.entries(validations.current).filter(function (_ref3) {
      var n = _ref3[0];
      return getValueForName(n, value);
    });

    if (validationsForSetFields.length > 0 && validateOn !== 'submit') {
      var _validateForm = validateForm(validationsForSetFields, value, format, messages),
          errors = _validateForm[0],
          infos = _validateForm[1];

      filterErrorValidations(errors);
      filterInfoValidations(infos);
      var nextValidationResults = {
        errors: errors,
        infos: infos,
        valid: buildValid(errors)
      };
      if (onValidate) onValidate(nextValidationResults);
      setValidationResults(nextValidationResults);
    } // We only want to run this for the value we have on initial mount.
    // We don't want subsequent changes to the value to re-run this.
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []); // Currently, onBlur validation will trigger after a timeout of 120ms.

  (0, _react.useEffect)(function () {
    var timer = setTimeout(function () {
      if (pendingValidation) {
        // run validations on the pending one and any other touched fields
        var _validateForm2 = validateForm(Object.entries(validations.current).filter(function (_ref4) {
          var n = _ref4[0];
          return touched[n] || pendingValidation.includes(n);
        }), value, format, messages),
            validatedErrors = _validateForm2[0],
            validatedInfos = _validateForm2[1];

        setPendingValidation(undefined);
        setValidationResults(function (prevValidationResults) {
          // keep any previous errors and infos for untouched keys,
          // these may have come from a submit
          var nextErrors = _extends({}, prevValidationResults.errors, validatedErrors);

          var nextInfos = _extends({}, prevValidationResults.infos, validatedInfos);

          filterErrorValidations(nextErrors);
          filterInfoValidations(nextInfos);
          var nextValidationResults = {
            errors: nextErrors,
            infos: nextInfos,
            valid: buildValid(nextErrors)
          };
          if (onValidate) onValidate(nextValidationResults);
          return nextValidationResults;
        });
      } // a timeout is needed to ensure that a click event (like one on a reset
      // button) completes prior to running the validation. without a timeout,
      // the blur will always complete and trigger a validation prematurely
      // The following values have been empirically tested, but 120 was
      // selected because it is the largest value
      // Chrome: 100, Safari: 120, Firefox: 80

    }, 120);
    return function () {
      return clearTimeout(timer);
    };
  }, [buildValid, format, messages, pendingValidation, onValidate, touched, value, requiredFields]); // clear any errors when value changes

  (0, _react.useEffect)(function () {
    if (validateOn !== 'change') setPendingValidation(undefined);
    setValidationResults(function (prevValidationResults) {
      var _validateForm3 = validateForm(Object.entries(validations.current).filter(function (_ref5) {
        var n = _ref5[0];
        return prevValidationResults.errors[n] || prevValidationResults.infos[n];
      }), value, format, messages),
          nextErrors = _validateForm3[0],
          nextInfos = _validateForm3[1];

      return {
        errors: _extends({}, prevValidationResults.errors, nextErrors),
        infos: _extends({}, prevValidationResults.infos, nextInfos)
      };
    });
  }, [format, messages, touched, validateOn, value]); // There are three basic patterns of handling form input value state:
  //
  // 1 - form controlled
  //
  // In this model, the caller sets `value` and `onChange` properties
  // on the Form component to supply the values used by the input fields.
  // In useFormContext(), componentValue would be undefined and formValue
  // is be set to whatever the form state has. Whenever the form state
  // changes, we update the contextValue so the input component will use
  // that. When the input component changes, we will call update() to
  // update the form state.
  //
  // 2 - input controlled
  //
  // In this model, the caller sets `value` and `onChange` properties
  // on the input components, like TextInput, to supply the value for it.
  // In useFormContext(), componentValue is this value and we ensure to
  // update the form state, via update(), and set the contextValue from
  // the componentValue. When the input component changes, we will
  // call update() to update the form state.
  //
  // 3 - uncontrolled
  //
  // In this model, the caller doesn't set a `value` or `onChange` property
  // at either the form or input component levels.
  // In useFormContext(), componentValue is undefined and valueProp is
  // undefined and nothing much happens here. That is, unless the
  // calling component needs to know the state in order to work, such
  // as CheckBox or Select. In this case, those components supply
  // an initialValue, which will trigger updating the contextValue so
  // they can have access to it.
  //

  var formContextValue = (0, _react.useMemo)(function () {
    var useFormInput = function useFormInput(_ref6) {
      var name = _ref6.name,
          componentValue = _ref6.value,
          initialValue = _ref6.initialValue,
          validateArg = _ref6.validate;

      var _useState5 = (0, _react.useState)(initialValue),
          inputValue = _useState5[0],
          setInputValue = _useState5[1];

      var formValue = name ? getValueForName(name, value) : undefined; // for dynamic forms, we need to track when an input has been added to
      // the form value. if the input is unmounted, we will delete its
      // key/value from the form value.

      var keyCreated = (0, _react.useRef)(false); // This effect is for pattern #2, where the controlled input
      // component is driving the value via componentValue.

      (0, _react.useEffect)(function () {
        if (name && // we have somewhere to put this
        componentValue !== undefined && // input driving
        componentValue !== formValue // don't already have it
        ) {
          setValueState(function (prevValue) {
            return setValueForName(name, componentValue, prevValue);
          }); // don't onChange on programmatic changes
        }
      }, [componentValue, formValue, name]); // on unmount, if the form is uncontrolled, remove the key/value
      // from the form value

      (0, _react.useEffect)(function () {
        return function () {
          if (keyCreated.current) {
            keyCreated.current = false;
            setValueState(function (prevValue) {
              var nextValue = _extends({}, prevValue);

              var isArrayField = stringToArray(name);

              if (isArrayField) {
                var arrayName = isArrayField.arrayName;
                delete nextValue[arrayName];
              } else {
                delete nextValue[name];
              }

              return nextValue;
            });
          }
        };
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [] // only run onmount and unmount
      );
      (0, _react.useEffect)(function () {
        if (validateArg) {
          if (!validations.current[name]) {
            validations.current[name] = {};
          }

          validations.current[name].input = validateName(validateArg);
          return function () {
            return delete validations.current[name].input;
          };
        }

        return undefined;
      }, [validateArg, name]);
      var useValue;
      if (componentValue !== undefined) // input component drives, pattern #2
        useValue = componentValue;else if (valueProp && name && formValue !== undefined) // form drives, pattern #1
        useValue = formValue;else if (formValue === undefined && name) // form has reset, so reset input value as well
        useValue = initialValue;else useValue = inputValue;
      return [useValue, function (nextComponentValue) {
        if (name) {
          // we have somewhere to put this
          var nextTouched = _extends({}, touched);

          nextTouched[name] = true;

          if (!touched[name]) {
            // don't update if not needed
            setTouched(nextTouched);
          } // if nextValue doesn't have a key for name, this must be
          // uncontrolled form. we will flag this field was added so
          // we know to remove its value from the form if it is dynamically
          // removed


          if (!(name in value)) keyCreated.current = true;
          var nextValue = setValueForName(name, nextComponentValue, value);
          setValueState(nextValue);
          if (onChange) onChange(nextValue, {
            touched: nextTouched
          });
        }

        if (initialValue !== undefined) setInputValue(nextComponentValue);
      }];
    };

    var useFormField = function useFormField(_ref7) {
      var errorArg = _ref7.error,
          infoArg = _ref7.info,
          name = _ref7.name,
          required = _ref7.required,
          disabled = _ref7.disabled,
          validateArg = _ref7.validate;
      var error = disabled ? undefined : errorArg || validationResults.errors[name];
      var info = infoArg || validationResults.infos[name];
      (0, _react.useEffect)(function () {
        var index = requiredFields.current.indexOf(name);

        if (required) {
          if (index === -1) requiredFields.current.push(name);
        } else if (index !== -1) requiredFields.current.splice(index, 1);

        if (validateArg || required) {
          if (!validations.current[name]) {
            validations.current[name] = {};
          }

          validations.current[name].field = validateName(validateArg, required);
          return function () {
            return delete validations.current[name].field;
          };
        }

        return undefined;
      }, [error, name, required, validateArg, disabled]);
      return {
        error: error,
        info: info,
        inForm: true,
        onBlur: validateOn === 'blur' ? function () {
          return setPendingValidation(pendingValidation ? [].concat(pendingValidation, [name]) : [name]);
        } : undefined,
        onChange: validateOn === 'change' ? function () {
          return setPendingValidation(pendingValidation ? [].concat(pendingValidation, [name]) : [name]);
        } : undefined
      };
    };

    return {
      useFormField: useFormField,
      useFormInput: useFormInput
    };
  }, [onChange, pendingValidation, touched, validateOn, validationResults.errors, validationResults.infos, value, valueProp]);
  return /*#__PURE__*/_react["default"].createElement("form", _extends({
    ref: ref
  }, rest, {
    onReset: function onReset(event) {
      setPendingValidation(undefined);

      if (!valueProp) {
        setValueState(defaultValue);
        if (onChange) onChange(defaultValue, {
          touched: defaultTouched
        });
      }

      setTouched(defaultTouched);
      setValidationResults(defaultValidationResults);

      if (_onReset) {
        event.persist(); // extract from React's synthetic event pool

        var adjustedEvent = event;
        adjustedEvent.value = defaultValue;

        _onReset(adjustedEvent);
      }
    },
    onSubmit: function onSubmit(event) {
      // Don't submit the form via browser form action. We don't want it
      // if the validation fails. And, we assume a javascript action handler
      // otherwise.
      event.preventDefault();
      setPendingValidation(undefined);

      var _validateForm4 = validateForm(Object.entries(validations.current), value, format, messages, true),
          nextErrors = _validateForm4[0],
          nextInfos = _validateForm4[1];

      setValidationResults(function () {
        var nextValidationResults = {
          errors: nextErrors,
          infos: nextInfos,
          // Show form's validity when clicking on Submit
          valid: buildValid(nextErrors)
        };
        if (onValidate) onValidate(nextValidationResults);
        return nextValidationResults;
      });

      if (Object.keys(nextErrors).length === 0 && _onSubmit) {
        event.persist(); // extract from React's synthetic event pool

        var adjustedEvent = event;
        adjustedEvent.value = value;
        adjustedEvent.touched = touched;

        _onSubmit(adjustedEvent);
      }
    }
  }), /*#__PURE__*/_react["default"].createElement(_FormContext.FormContext.Provider, {
    value: formContextValue
  }, children));
});
exports.Form = Form;
Form.displayName = 'Form';
Form.propTypes = _propTypes.FormPropTypes;