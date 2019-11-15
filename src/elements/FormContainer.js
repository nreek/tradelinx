import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { uploadFiles } from '../actions';
import { selectConfig } from '../reducers';

// Helpers
import {
  toDashCase, toAllCaps, toCamelCase, isFunction,
} from '../util/helpers';

// Validations
import validate from '../util/validations';

// Option lists
import * as optionLists from '../util/optionLists';

// Field React Components
import Button from './Button';
import Checkbox from './form-controls/Checkbox';
import FileUploadButton from './form-controls/FileUploadButton';
import FormLabel from './form-controls/FormLabel';
import DateInput from './form-controls/DateInput';
import RadioInput from './form-controls/RadioInput';
import Select from './form-controls/Select';
import Submit from './form-controls/Submit';
import TextInput from './form-controls/TextInput';
import TextArea from './form-controls/TextArea';
import ReCaptchaV2 from './form-controls/ReCaptchaV2';
import Header from './form-controls/Header';

// Constants
const CHECKBOX = 'checkbox';
const DATE = 'date';
const FILE_BUTTON = 'file-button';
const FORM_LABEL = 'form-label';
const RADIO = 'radio';
const SELECT = 'select';
const SELECT_ONE = 'select-one';
const TEXT = 'text';
const TEXT_AREA = 'text-area';
const RECAPTCHA = 'recaptcha';
const HEADER = 'header';
const FIELD_CONDITION_ONE = 'one';
const FIELD_CONDITION_ALL = 'all';
const FIELD_CONDITION_APPEAR = 'appear';
const FIELD_CONDITION_SPECIFY = 'specify';

const propTypes = {
  allowSubmit: PropTypes.bool,
  className: PropTypes.string,
  description: PropTypes.node,
  fields: PropTypes.array,
  footer: PropTypes.node,
  formValidations: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
  initialValues: PropTypes.object,
  loading: PropTypes.bool,
  loadingStatus: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onSubmit: PropTypes.func,
  setValue: PropTypes.object,
  submitText: PropTypes.string,
  translation: PropTypes.string,
  validationData: PropTypes.instanceOf(Object),
};

const defaultProps = {
  allowSubmit: true,
  className: '',
  formValidations: [],
  loading: false,
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  submitText: 'Submit',
  validationData: {},
};

class FormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      formValid: false,
      formErrors: [],
    };

    this.formValidations = [this.requiredFieldValidations, this.fieldValidations];
    if (isFunction(this.props.formValidations)) {
      this.formValidations.push(this.props.formValidations);
    } else if (Array.isArray(this.props.formValidations)) {
      this.props.formValidations.forEach(validation => this.formValidations.push(validation));
    }

    this.validFieldTypes = [
      CHECKBOX,
      DATE,
      FILE_BUTTON,
      FORM_LABEL,
      RADIO,
      SELECT,
      SELECT_ONE,
      TEXT,
      TEXT_AREA,
      RECAPTCHA,
      HEADER,
    ];

    this.nonPermanentFields = {};
    this.listOfOptions = {};
  }

  componentDidMount = () => {
    const fields = {};

    this.props.fields
      && this.props.fields.forEach((field) => {
        const { type, name } = field;

        if (this.validFieldTypes.includes(type)) {
          fields[name] = { value: '', active: false, errors: [] };

          if (field.initialValue) {
            fields[name].value = field.initialValue;
          } else if (this.props.initialValues && this.props.initialValues[name]) {
            fields[name].value = this.props.initialValues[name];
          } else if (type === CHECKBOX) {
            fields[name].value = false;
          } else if (type === RECAPTCHA) {
            fields[name].value = false;
          } else if (field.required) {
            field.validations = field.validations || {};
            field.validations.onBlur = field.validations.onBlur || [];
            field.validations.onBlur.push({ name: 'required' });
          }
        } else {
          console.error(
            `"${name}" field has an invalid field type of "${type}", check the config file.`,
          );
        }

        if (field.appear) {
          const { conditions } = field.appear;
          conditions
            .map(condition => condition.field)
            .forEach(item => this.nonPermanentFields[item] = [...(this.nonPermanentFields[item] || []), name]);
        }
      });

    this.setState({ fields }, () => {
      this.checkFormValidations();
    });
  };

  componentDidUpdate(prevProps) {
    const { setValue } = this.props;
    if (setValue && setValue !== prevProps.setValue) {
      this.setState((prevState) => {
        const { fields } = prevState;
        for (const field in setValue) {
          if (setValue[field] != undefined) {
            fields[field].value = setValue[field];
          }
        }
        return { fields };
      });
    }
  }

  // Helpers
  getOptionList = (optionList) => {
    switch (optionList) {
      case 'countryCodes':
        return optionLists.countryCodes.map(country => ({
          value: country.name,
          name: country.name,
        }));
      default:
        console.warn(`No option set found for ${optionList}, check the config file.`);
        return [];
    }
  };

  getFileUrl = fileKey => `${AlphaPoint.config.aws.urlPrefix}${AlphaPoint.config.aws.bucketName}/${fileKey[0]}`;

  // Event Handlerss
  onChangeHandler = name => (e) => {
    const { type } = e.target;
    let { value } = e.target;
    // TODO: move this into the set state
    if (type === 'checkbox') {
      value = !this.state.fields[name].value;
    }
    this.setState(
      (prevState) => {
        const { fields } = prevState;
        fields[name].value = value;
        return { fields };
      },
      () => {
        this.validateEvent('onChange', name);
        this.checkFormValidations();
        this.props.onChange(this.state.fields);
      },
    );
  };

  // Event Handlerss
  onReCaptchaChangeHandler = (name, value) => {
    this.setState(
      (prevState) => {
        const { fields } = prevState;
        fields[name].value = value;
        return { fields };
      },
      () => {
        this.validateEvent('onChange', name);
        this.checkFormValidations();
      },
    );
  };

  onFocusHandler = name => (e) => {
    this.setState((prevState) => {
      const { fields } = prevState;
      for (const field in fields) {
        fields[field].active = false;
      }
      fields[name].active = true;
      this.props.onFocus(fields);
      return { fields };
    });
  };

  onBlurHandler = name => () => {
    this.validateEvent('onBlur', name);
    this.setState((prevState) => {
      const { fields } = prevState;
      for (const field in fields) {
        fields[field].active = false;
      }
      this.props.onBlur(fields);
      return { fields };
    });
  };

  onFormChangeHandler = () => {
    this.checkFormValidations();
  };

  setFileReady = (name, flag) => this.setState((prevState) => {
    const { fields } = prevState;
    fields[name].value = flag;
    return { fields };
  }, this.checkFormValidations);

  onSubmitHandler = (e) => {
    e.preventDefault();

    if (
      this.props.fields.filter(field => field.type.includes('file')).some(field => !field.encode)
    ) {
      // this.props.uploadFiles(this.prepareFiles(), this.props.config.siteName);
      // TODO: flow with files after uploading
      this.submit();
    } else {
      this.submit();
    }
  };

  prepareFiles = () => {
    const files = [];
    const fileFields = this.props.fields.filter(
      field => field.type.includes('file')
      && (!field.hasOwnProperty(FIELD_CONDITION_APPEAR) || field.passCondition)
    );
    fileFields.forEach((field) => {
      files.push(this.state.fields[field.name].value);
    });
    return files;
  };

  submit = () => {
    const formData = {};
    for (const field in this.state.fields) {
      formData[toCamelCase(field)] = this.state.fields[field].value;
    }
    this.props.onSubmit(formData);
  };

  uploadHandler = name => (fileKey) => {
    const fileUrl = this.getFileUrl(fileKey);
    this.setState((prevState) => {
      const { fields } = prevState;
      fields[name].value = fileUrl;
      return { fields };
    }, this.checkAllUploadsComplete);
  };

  checkAllUploadsComplete = () => {
    if (
      this.props.fields
        .filter(field => field.type.includes('file') && !field.encode)
        .every(
          field => this.state.fields[field.name].value
            && typeof this.state.fields[field.name].value !== typeof true,
        )
    ) {
      this.setState({ upload: false }, this.submit());
    }
  };

  encodeHandler = name => (encodedFile) => {
    if (this.props.fields.find(field => field.name === name).encode) {
      this.setState(
        (prevState) => {
          const { fields } = prevState;
          fields[name].value = encodedFile;
          return { fields };
        },
        () => {
          this.checkFormValidations();
          this.validateEvent('onChange', name);
        },
      );
    }
  };

  // Validations
  checkFormValidations = () => {
    if (this.formValidations.every(validation => validation())) {
      this.setState({ formValid: true });
    } else {
      this.setState({ formValid: false });
    }
  };

  fieldValidations = () => {
    const { fields } = this.state;
    let fieldErrors = [];
    for (const field in fields) {
      fieldErrors = fieldErrors.concat(fields[field].errors);
    }

    if (fieldErrors.length > 0) {
      return false;
    }
    return true;
  };

  requiredFieldValidations = () => {
    if (
      this.props.fields
        .filter(field => (field.required && (!field.hasOwnProperty(FIELD_CONDITION_APPEAR) || field.passCondition)))
        .every(field => this.state.fields[field.name].value)
    ) {
      return true;
    }
    this.setState((prevState) => {
      const { formErrors } = prevState;
      formErrors.push(_t('Please check that each field is filled in correctly.', 'ERROR.MESSAGE'));
      return { formErrors };
    });
    return false;
  };

  validateEvent = (event, name) => {
    const { fields } = this.state;
    const changedField = this.props.fields.find(field => field.name === name);
    const errors = [];

    this.checkValidationsForEvent(changedField, event);
  };

  // checks if there are validations for field & event
  checkValidationsForEvent = (field, event) => {
    if (
      field.validations
      && field.validations[event]
      && field.validations[event].length
      && (!field.hasOwnProperty(FIELD_CONDITION_APPEAR) || field.passCondition)
    ) {
      field.validations[event].forEach((validation) => {
        const { name, ...parameters } = validation;
        const { validationData } = this.props;
        const test = this.testValidation(field, name, { ...parameters, ...validationData });
        if (!test.valid) {
          this.addError(field.name, test);
        } else {
          this.removeError(field.name, test);
        }
      });
    } else {
      this.props.onChange(this.state.fields);
    }
  };

  testValidation = (field, validationName, parameters) => {
    const fieldValue = this.state.fields[field.name].value;
    const validationResult = validate[validationName](fieldValue, parameters);
    return validate[validationName](fieldValue, parameters);
  };

  // Checks that error isn't already present, and adds it if it isn't
  addError = (name, error) => {
    if (!this.state.fields[name].errors.some(_ => _.name === error.name)) {
      this.setState(
        ({ fields }) => {
          const copyOfFields = JSON.parse(JSON.stringify(fields));
          copyOfFields[name].errors.push(error);
          return { fields: copyOfFields };
        },
        () => {
          this.checkFormValidations();
        },
      );
    } else {
      () => {
        this.checkFormValidations();
      };
    }
  };

  // Checks if an error is present, and removes it if it is
  removeError = (name, error) => {
    if (this.state.fields[name].errors.some(_ => _.name === error.name)) {
      this.setState(
        ({ fields }) => {
          const copyOfFields = JSON.parse(JSON.stringify(fields));
          const filteredErrors = copyOfFields[name].errors.filter(_ => _.name !== error.name);
          copyOfFields[name].errors = filteredErrors;
          return { fields: copyOfFields };
        },
        () => {
          this.checkFormValidations();
        },
      );
    } else {
      () => {
        this.checkFormValidations();
      };
    }
  };

  // Render functions
  renderGeneratedForm = () => this.props.fields && this.props.fields.map(field => this.renderFieldContainer(field));

  /**
   * @param {Boolean}
   * @param {Object}
   */
  changePassConditionStatus = (status, field) => {
    const { name } = field;
    this.props.fields.forEach((fieldConfig, index) => {
      if (fieldConfig.name === name) {
        this.props.fields[index].passCondition = status;
      }
    });
  }

  renderFieldContainer = (field) => {
    const { name, type } = field;
    const configField = this.state.fields[name];
    const { fields } = this.state;

    const active = configField && configField.active ? ' active' : '';
    const error = configField && configField.errors.length ? ' error' : '';

    let classNames = `form-input-container ${toDashCase(name)}`;

    classNames = type === 'form-label' ? classNames : `${classNames}${active}${error}`;

    field.errorMessages = configField && configField.errors && configField.errors.length
      ? configField.errors.map(error => error.error)
      : [];

    field.errorMessages = [...new Set(field.errorMessages)];

    if (field.hasOwnProperty(FIELD_CONDITION_APPEAR)) {
      let status = true;
      field.hideField = status;
      this.changePassConditionStatus(false, field);
      const { conditionsType = FIELD_CONDITION_ALL, conditions } = field.appear;

      conditions.forEach((condition) => {
        const conditionField = fields[condition.field];
        const options = this.listOfOptions[condition.optionList];

        switch (conditionsType) {
          case FIELD_CONDITION_SPECIFY:
            if(conditionField && options
              && options.some(e => e.is_others_type && e.id === +conditionField.value)) {
              field.hideField = false;
              this.changePassConditionStatus(true, field)
            }
            break;
          case FIELD_CONDITION_ONE:
            if (conditionField && condition.values.includes(conditionField.value)) {
              field.hideField = false;
              this.changePassConditionStatus(true, field)
            }
            break;
          case FIELD_CONDITION_ALL:
            if (conditionField && !condition.values.includes(conditionField.value)) {
              status = false;
            }
            break;
        }
      });

      if (conditionsType === FIELD_CONDITION_ALL && status === true) {
        field.hideField = false;
        this.changePassConditionStatus(true, field);
      }

      if (field.hideField) {
        return null;
      }
    }

    return (
      <div key={name} className={classNames}>
        {this.renderField(field)}
      </div>
    );
  };

  renderField = (field) => {
    const types = {
      [CHECKBOX]: this.renderCheckbox,
      [DATE]: this.renderDateField,
      [FILE_BUTTON]: this.renderFileUploadButton,
      [FORM_LABEL]: this.renderFormLabel,
      [RADIO]: this.renderRadioField,
      [SELECT]: this.renderSelectField,
      [SELECT_ONE]: this.renderSelectField,
      [TEXT]: this.renderTextField,
      [TEXT_AREA]: this.renderTextArea,
      [RECAPTCHA]: this.renderReCaptchaV2,
      [HEADER]: this.renderHeader,
    };

    if (types[field.type]) {
      return types[field.type](field);
    }
    console.error(
      `"${field.name}" field has an invalid field type of "${field.type}", check the config file.`,
    );
    return null;
  };

  renderHeader = field => <Header {...field} />;

  renderReCaptchaV2 = field => <ReCaptchaV2 {...field} onChange={this.onReCaptchaChangeHandler} />;

  renderFormLabel = field => <FormLabel {...field} translation={this.props.translation} />;

  renderTextField = (field) => {
    const { name } = field;
    return (
      <TextInput
        onChange={this.onChangeHandler(name)}
        onFocus={this.onFocusHandler(name)}
        onBlur={this.onBlurHandler(name)}
        value={this.state.fields[name] ? this.state.fields[name].value : ''}
        translation={this.props.translation}
        {...field}
      />
    );
  };

  renderDateField = (field) => {
    const { name } = field;
    return (
      <DateInput
        onChange={this.onChangeHandler(name)}
        onFocus={this.onFocusHandler(name)}
        onBlur={this.onBlurHandler(name)}
        value={this.state.fields[name] ? parseInt(this.state.fields[name].value) : 0}
        translation={this.props.translation}
        {...field}
      />
    );
  };

  renderRadioField = (field) => {
    const { name } = field;
    return (
      <RadioInput
        key={name}
        onChange={this.onChangeHandler(name)}
        onFocus={this.onFocusHandler(name)}
        onBlur={this.onBlurHandler(name)}
        value={this.state.fields[name] ? this.state.fields[name].value : ''}
        translation={this.props.translation}
        {...field}
      />
    );
  };

  renderSelectField = (field) => {
    const { name, optionList } = field;

    let options;
    if (optionList) {
      options = this.getOptionList(optionList);
    } else {
      options = field.options;
    }

    return (
      <Select
        options={options}
        onChange={this.onChangeHandler(name)}
        onFocus={this.onFocusHandler(name)}
        onBlur={this.onBlurHandler(name)}
        value={this.state.fields[name] ? this.state.fields[name].value : ''}
        translation={this.props.translation}
        {...field}
      />
    );
  };

  renderFileUploadButton = (field) => {
    const { name } = field;

    return (
      <FileUploadButton
        onFileAccepted={this.onChangeHandler(name)}
        onUploadComplete={this.uploadHandler(name)}
        onEncodeComplete={this.encodeHandler(name)}
        onFocus={this.onFocusHandler(name)}
        setFileReady={this.setFileReady}
        translation={this.props.translation}
        {...field}
      />
    );
  };

  renderCheckbox = (field) => {
    const { name } = field;
    return (
      <Checkbox
        onChange={this.onChangeHandler(name)}
        onFocus={this.onFocusHandler(name)}
        onBlur={this.onBlurHandler(name)}
        translation={this.props.translation}
        {...field}
      />
    );
  };

  renderTextArea = (field) => {
    const { name } = field;
    return (
      <TextArea
        onChange={this.onChangeHandler(name)}
        onFocus={this.onFocusHandler(name)}
        onBlur={this.onBlurHandler(name)}
        value={this.state.fields[name] ? this.state.fields[name].value : ''}
        translation={this.props.translation}
        {...field}
      />
    );
  };

  renderButtons = () => (
    <div className="form-buttons">
      {this.props.buttons
        && this.props.buttons.map(button => (
          <Button
            key={button.name}
            onClick={button.onClick}
            className={`${toDashCase(button.name)}-button`}
          >
            {_t(button.name, `${this.props.translation}.${toAllCaps(button.name)}`)}
          </Button>
        ))}
      {this.props.onSubmit && (
        <Button
          className="submit-button"
          disabled={!this.state.formValid || !this.props.allowSubmit || this.props.loadingStatus}
          loading={this.props.loading}
          loadingStatus={this.props.loadingStatus}
          onBlur={this.onBlurHandler}
          onClick={this.onSubmitHandler}
          onFocus={this.onFocusHandler}
          onSubmit={this.onSubmitHandler}
          type="submit"
          value={this.props.submitText}
        />
      )}
    </div>
  );

  render() {
    return (
      <form
        className={`form-container ${this.props.className}`}
        onSubmit={this.onSubmitHandler}
        onChange={this.onFormChangeHandler}
      >
        {this.props.description && <div className="form-description">{this.props.description}</div>}
        <div className={`fields-container ${this.props.className}-fields`}>
          {this.renderGeneratedForm()}
        </div>
        {this.props.footer && <div className="form-footer">{this.props.footer}</div>}
        {this.renderButtons()}
      </form>
    );
  }
}

const mapStateToProps = state => ({
  config: selectConfig(state),
});

const mapDispatchToProps = dispatch => ({
  uploadFiles: file => dispatch(uploadFiles(file)),
});

FormContainer.propTypes = propTypes;
FormContainer.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormContainer);
