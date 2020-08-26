import { Component, OnInit, ViewChild } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as XLSX from 'xlsx';
type AOA = any[][];
@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit {

  showPreview: boolean = false;
  editFieldIndex: any;
  formNameModel = "";
  editedField: boolean = false;
  currentFormVal = "";
  isDisabled: boolean = false;
  isHide: boolean = false;
  formIndex: number = 1;   // this is for index of array that is repeating
  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  formArray = ['Form1'];

  // formName=["Form 1","Form 2"]
  formName = [
    {
      name: "Trading Details",
      value: "Form 1"
    },
    {
      name: "Demat Details",
      value: "Form 2"
    },
    {
      name: "Other Details",
      value: "Form 3"
    }
  ]
  form1 = "Form 1";
  form2 = "Form 2";
  form3 = "Form 3";
  currentForm = this.form1;
  form = new FormGroup({});
  model = {};
  fieldsArr: FormlyFieldConfig[] = [];
  showForm: boolean = false;
  selectedForm: string;
  constructor() { }

  ngOnInit(): void {
    const key = 'form' + (this.formIndex);
    this.addNewForm(key);
  }
  hidePreview() {
    this.showPreview = false;
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fieldsArr, event.previousIndex, event.currentIndex);
  }
  dropdownFields: any = ['input', 'dropdown', 'checkbox', 'radio'];
  fieldsArray = [];
  finalJson = [];
  fields: any;
  selectedField: any;
  formPosition: string = "";
  formPositionOptions = [{
    name: "Before Payment",
    value: "before"
  },
  {
    name: "After Payment",
    value: "after"
  },
  {
    name: "Personal Details",
    value: "personal"
  }
  ];
  beforePaymentForm = [];
  afterPaymentForm = [];
  showFieldsDiv = false;
  showPreviewFunc() {
    this.fieldsArr = [...this.finalJson];
  }
  changeFormName() {
    if (this.currentForm == this.form1) {
      this.form1 = this.formNameModel;
      this.currentForm = this.formNameModel;
    }
    if (this.currentForm == this.form2) {
      this.form2 = this.formNameModel;
      this.currentForm = this.formNameModel;
    }
    if (this.currentForm == this.form3) {
      this.form3 = this.formNameModel;
      this.currentForm = this.formNameModel;
    }
  }
  createNewForm(data) {
    this.currentForm = data;
    this.selectedForm = data;
    this.showForm = true;

    this.form = new FormGroup({});
    if (data == 'Form 1') {
      this.formNameModel = this.form1;
      this.form1 = this.formNameModel;
    }
    if (data == 'Form 2') {
      this.formNameModel = this.form2;
      this.form2 = this.formNameModel;
    }
    if (data == 'Form 3') {
      this.formNameModel = this.form3;
      this.form3 = this.formNameModel;
    }
    this.model = {};
    this.fieldsArr = [];
    if (data == 'Form 1') {
      if (localStorage.getItem('form1') != undefined) {
        let obj = JSON.parse(localStorage.getItem('form1'));
        this.form1 = obj.name;
        this.formNameModel = obj.name;
        this.currentForm = obj.name
        this.fieldsArr = JSON.parse(obj.value);
        this.finalJson = JSON.parse(obj.value);
      }
      else {
        this.finalJson = [];
        this.fieldsArr = [];
      }
    }
    else if (data == 'Form 2') {
      if ((localStorage.getItem('form2')) != undefined) {
        let obj = JSON.parse(localStorage.getItem('form2'));
        this.fieldsArr = JSON.parse(obj.value);
        this.finalJson = JSON.parse(obj.value);
      }
      else {
        this.finalJson = [];
        this.fieldsArr = [];
      }
    }
    else {
      if ((localStorage.getItem('form3')) != undefined) {
        let obj = JSON.parse(localStorage.getItem('form3'));
        this.fieldsArr = JSON.parse(obj.value);
        this.finalJson = JSON.parse(obj.value);
      }
      else {
        this.finalJson = [];
        this.fieldsArr = [];
      }
    }
  }
  editPreviousForm() {
    this.showForm = true;
    this.fieldsArr = JSON.parse(localStorage.getItem('finalForm'));
    this.finalJson = JSON.parse(localStorage.getItem('finalForm'))
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.fields.templateOptions.options = [];
      for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < 1; j++) {
          this.fields.templateOptions.options.push({ value: this.data[i][j + 1], label: this.data[i][j] })
        }
      }

    };
    reader.readAsBinaryString(target.files[0]);
  }
  addField() {
    this.isDisabled = false;
    this.isHide = false
    if (this.selectedField == 'input') {
      this.fields = {
        key: '',
        type: 'input',
        templateOptions: {
          label: '',
          placeholder: 'Enter input placeholder',
          required: true,
        }


      }

    }
    if (this.selectedField == 'checkbox') {
      this.fields =
      {
        key: '',
        type: 'checkbox',
        templateOptions: {
          label: '',
          required: true,
        }


      }

    }
    if (this.selectedField == 'dropdown') {
      this.fields =
      {
        key: '',
        type: 'select',
        templateOptions: {
          label: '',
          placeholder: 'Placeholder',
          description: '',
          required: true,
          options: [
            { value: 1, label: 'Option 1' }
          ],
        },
      }

    }
    if (this.selectedField == 'radio') {
      this.fields =
      {
        key: '',
        type: 'radio',
        templateOptions: {
          label: '',
          placeholder: 'Placeholder',
          required: true,
          options: [
            { value: 1, label: 'Option 1' },

          ],
        },
      }

    }
  }
  addNewForm(data) {
    if (localStorage.getItem(data) == undefined) {
      let key = "Form" + (+this.formArray.length + 1);
      this.formArray.push(key);
      this.formIndex = (+this.formArray.length);
      this.form = new FormGroup({});
      this.model = {};
      this.fieldsArr = [];
      this.finalJson = [];
      this.fieldsArr = [];
    }
    else {
      this.fieldsArr = JSON.parse(localStorage.getItem(data))

    }
  }
  addFieldToMain() {
    if (!this.editedField) {
      if (this.isDisabled) {
        this.fields['expressionProperties'] = {
          'templateOptions.disabled': 'true'
        }
        this.fields['isDisabled'] = true;
      }
      if (this.isHide) {
        this.fields['hideExpression'] = true;
        this.fields['isHide'] = true;
      } else {
        this.fields['expressionProperties'] = {
          'templateOptions.disabled': 'false'
        }
        this.fields['isDisabled'] = false;
        if (!this.isHide) {
          this.fields['hideExpression'] = false;
          this.fields['isHide'] = true;
        }
      }
      this.finalJson.push(this.fields);
      this.fieldsArray = [];
      this.fieldsArr = this.finalJson;
    }
    else {
      this.finalJson[this.editFieldIndex] = this.fields;
      this.fieldsArray = [];
      this.fieldsArr = this.finalJson;
      this.editedField = false;

    }
    this.fields = {};
  }
  removeOption(index, array) {
    array.splice(index, 1);
  }
  removeField(index) {
    this.fieldsArr.splice(index, 1);
  }
  editField(index) {
    this.editFieldIndex = index;
    this.editedField = true;
    this.fields = this.fieldsArr[index];
  }
  addOptions(data) {
    data.push(
      { value: "", label: '' }
    )
  }
  seePreview() {

  }
  saveForm() {
    this.finalJson = [...this.fieldsArr];
    if (this.selectedForm == 'Form 1') {
      let obj = {
        name: this.form1,
        value: JSON.stringify(this.finalJson)
      }

      localStorage.setItem('form1', JSON.stringify(obj));
    }

    else if (this.selectedForm == 'Form 2') {
      let obj = {
        name: this.form2,
        value: JSON.stringify(this.finalJson)
      }

      localStorage.setItem('form2', JSON.stringify(obj));
    }
    else {
      let obj = {
        name: this.form3,
        value: JSON.stringify(this.finalJson)
      }
      localStorage.setItem('form3', JSON.stringify(this.finalJson));
    }

  }

}
