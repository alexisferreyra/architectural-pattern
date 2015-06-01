'use strict';

/**
 * This object implements the Interpreter component in the Interpreter Style example.
 *
 * The Interpreter has a method "run" which should be called with an object
 * representing the program to execute and an optional controller object where
 * callbacks from buttons will be called.
 *
 * When the "run" function ends, it returns a <div> element with the renderized form.
 *
 * Check the sample program bellow to understand the supported program type.
 *
 * @constructor
 */
function Interpreter() {

  this._createField = function (label, input) {
    var root = document.createElement('div');
    root.setAttribute('class', 'field')

    if(label) root.appendChild(label);
    if(input) root.appendChild(input);

    return root;
  };

  this._interpretStringField = function(fieldData) {
    var label = document.createElement('label');
    label.textContent = fieldData.name;

    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', '_vm_' + fieldData.name);

    return this._createField(label, input);
  };

  this._interpretPasswordField = function(fieldData) {
    var label = document.createElement('label');
    label.textContent = fieldData.name;

    var input = document.createElement('input');
    input.setAttribute('type', 'password');
    input.setAttribute('id', '_vm_' + fieldData.name);

    return this._createField(label, input);
  };

  this._interpretButtonField = function(fieldData, controllerObject) {
    var input = document.createElement('input');
    input.setAttribute('type', 'button');
    input.setAttribute('id', '_vm_' + fieldData.name);
    input.setAttribute('value', fieldData.name);

    if(fieldData.callback) {
      input.addEventListener('click', function () {
        var args = fieldData.args;
        var argValues = [];
        for(var i = 0; i < args.length; i++) {
          var argInput = document.getElementById('_vm_' + args[i]);
          if(argInput) {
            argValues.push(argInput.value);
          }
        }

        if(typeof(controllerObject[fieldData.callback]) === 'function') {
          controllerObject[fieldData.callback].apply(controllerObject, argValues);
        } else {
          alert('Target Function "' + fieldData.callback + '" not found in controller object. Arguments to be used will be: ' + JSON.stringify(argValues));
        }
      })
    }

    return this._createField(null, input);
  };

  this.run = function(program, controllerObject) {
    var root = document.createElement('div');

    for(var i = 0; i < program.fields.length; i++) {
      var itemRender = null;
      var fieldData = program.fields[i];
      switch(fieldData.type) {
        case 'string':
          itemRender = this._interpretStringField(fieldData);
          break;

        case 'password':
          itemRender = this._interpretPasswordField(fieldData);
          break;

        case 'button':
          itemRender = this._interpretButtonField(fieldData, controllerObject);
          break;

        default:
          console.log('Error in program. Field type "' + fieldData.type + '" is not valid.');
      }
      if(itemRender !== null) {
        root.appendChild(itemRender);
      }
    }
    return root;
  };
}

/**
 * Once the page is loaded, it prepares the page with a sample program.
 */
window.addEventListener('DOMContentLoaded', function () {
  var programField = document.getElementById('program');

  // Sample program with a Login dialog described.
  var defaultProgram = {
    fields: [
      {
        name: 'User Name',
        type: 'string',
        allowEmpty: false,
        defaultValue: 'John'
      },
      {
        name: 'Password',
        type: 'password',
        allowEmpty: false
      },
      {
        name: 'Login',
        type: 'button',
        callback: 'loginClicked',
        args: ['User Name', 'Password']
      }
    ]
  };

  programField.value = JSON.stringify(defaultProgram, null, 2);

  document.getElementById('run').addEventListener('click', function (){
    // create the interpreter
    var interpreter = new Interpreter();
    // create the arguments to be provided to run method
    var controllerObject = {
      loginClicked: function (user, password) {
        alert('User: ' + user + ', Password: ' + password);
      }
    };
    var program = JSON.parse(programField.value);
    // call the run method to obtain the form dynamically
    var result = interpreter.run(program, controllerObject);

    // add the output form to the current page but first remove the old one
    var outputElement = document.getElementById('output');
    var child = outputElement.firstChild;
    if(child) child.remove();
    outputElement.appendChild(result);
  });
});