# FormContainer Documentation

FormContainer is a React component that is intended to render and handle a form based on an object, allowing forms to be configurable on the fly.

It handles,

- Configuration-based rendering
- Validations
- Translations
- File uploads with AWS S3
- Accessibility-friendly fields

Props

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| allowSubmit | boolean | Boolean value that allows the form to be submitted. If a false value will also apply disabled submit properties. |
| buttons | array of objects | Takes an array of objects with a name and onClick key. Name is a string and onClick is a function. |
| className | string | Class name for the container of the component |
| description | React node | A React node that renders above the form field content. |
| fields | array of objects | The fields array is a list of field objects that specify the fields to be rendered by the component. |
| footer | React node | A React node that renders below the form field content. |
| initialValues | object | An object containing key-value pairs for fields and their values which set the initial values for the form. |
| loading | boolean | Turns on loading for submit button (spinner on submit while processing) |
| loadingStatus | boolean | Sets the current loading status |
| onChange | function | Callback which gets executed on form change. Has an object as an argument that contains the form fields and associated data (errors, etc.) |
| onFocus | function | Callback which gets executed on focus of any form fields |
| onBlur | function | Callback which gets executed on blur of any form fields |
| onSubmit | function | Callback which gets executed on form submit. The callback has an argument that contains all form fields with values. |
| setValue | object | Sets the value of any field. This allows a parent component to override values set by the FormContainer |
| submitText | string | Value of submit button. |
| translation | string | Translation root for all items in the field. |

Fields array

The fields array is a list of field objects that specify the fields to be rendered by the component. The object contains field info and required/optional parameters. Some parameters are specific to the field.

_Example:_

| depositFiatFields = [
  {
    name: &#39;Full Name&#39;,
    type: &#39;text&#39;,
    required: true
  },
  {
    name: &#39;Amount&#39;,
    type: &#39;text&#39;,
    required: true,
    validations: {
      onBlur: [
        {
          name: &#39;amount&#39;
        }
      ]
    }
  },
  {
    name: &#39;Memo&#39;,
    type: &#39;text-area&#39;,
    required: false
  }
]; |
| --- |

Required Parameters

| **Key** | **Description** |
| --- | --- |
| name | Name of field - **NOTE: The name here should be exactly how it should appear on the page, in plain English. Special casing (such as camel or dash case) is not needed and can result in unexpected behavior in the field container functionality. For example, &quot;First Name&quot; should not be &quot;first\_name&quot; or &quot;firstName&quot;. This is handled by the component.** |
| type | Field type (See field types below) |
| required | Flag for field if required for form submission |

Optional Parameters

| **Key** | **Description** |
| --- | --- |
| validations | Validations object |
| details | Adds a details string below field label |
| placeholder | String for placeholder |
| translation | Name of translation from JSON |

Validations

The field object has an optional validations key that accepts an object. The object can specify validations for onChange and onBlur events for that field. Each event type accepts an array of validation objects.

Validation objects contain a name key which reference the name of validation function in the validation object contained in  /util/validations.js.

_Example:_

| validations: {
      onBlur: [
        {
          name: &#39;validWalletAddress&#39;
        },
        {
          name: &#39;illegalWalletAddress&#39;
        },
] |
| --- |

This validation checks two validations on blur.

Validation functions can also accept additional arguments with optional argument keys.

_Example:_

| validations: {
      onChange: [
        {
          name: &#39;minLength&#39;,
          minLength: 8
        }
] |
| --- |

This one executes the minLength function on Change, which accepts the value of the field on change and an additional argument of minLength.

Field-Specific Parameters

| **Key** | **Type** | **Description** |
| --- | --- | --- |
| hideInput | text-input | Boolean, hides input of text input for sensitive information like passwords. |
| mask | text-input | Adds masking using react-maskedinput |
| text | text-label | Displays text |
| options | select | An array of objects that contain parameters for name and value |
| optionList | select | String of name of option list found in /util/optionLists.js |

Field Type

The table below lists currently supported field types:

| &#39;Checkbox&#39;,
&#39;date&#39;,
&#39;file-button&#39;,
&#39;form-label&#39;,
&#39;radio&#39;,
&#39;select&#39;,
&#39;text&#39;,
&#39;text-area&#39; |
| --- |

Class names

The form container automatically applies class names to various elements in the component. Fields are contained in divs with their respective names in dash case (ex: first-name). Fields can also be designated with active and error class names if applicable.

Submit behavior

The form container does not allow submit if there are any form errors, field errors, or empty required fields.

Translations

Translations are applied automatically to the fields. The translation root and key are derived from the translation prop and the key is the field name in screaming snake case (ex: ROOT.FIRST\_NAME). Placeholders for each field are translated with \_PLACEHOLDER (ex: ROOT.FIRST\_NAME\_PLACEHOLDER).

File Uploads

Files can be uploaded the an AWS S3 bucket based on AWS configurations set in the config file. Uploads are performed via the methods found in the s3RestApi.