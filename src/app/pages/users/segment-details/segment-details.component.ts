import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'app/shared/services/validator.service';
import { UserService } from 'app/shared/services/user.service';
import { GlobalService } from 'app/shared/services/global.service';

@Component({
  selector: 'app-segment-details',
  templateUrl: './segment-details.component.html',
  styleUrls: ['./segment-details.component.scss']
})
export class SegmentDetailsComponent implements OnInit {
  userId: any;
  mainSegmentType: any;
  subCategoryType = [];
  subCategoryArray: any[] = [];
  displayFunctionalityArray: any[] = [];
  public segmentForm: FormGroup;
  mainCatItems: FormArray;
  subCatItems: FormArray;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public validate: ValidationService,
    private userService: UserService,
    private global: GlobalService
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params.id;
    this.getSubCategory();
    this.setForm();
  }

  /**
   * Set Validation Form
   */
  setForm() {
    this.segmentForm = this.fb.group({
      mainCatItems: this.fb.array([])
    });
  }

  addSegmentTypeControls(value): void {
    this.mainCatItems = this.segmentForm.get('mainCatItems') as FormArray;
    this.mainCatItems.push(this.createSegment(value));
  }

  /**
   * Main Category FormArray
   * @param value 
   */
  createSegment(value): FormGroup {
    let selectedVar = false;
    if (value.selected) {
      selectedVar = value.selected;
    }
    return this.fb.group({
      selected: selectedVar,
      category_id: value.category_id,
      category_name: value.category_name,
      sub_cat_items: this.fb.array([])
    });
  }

  /**
 * Sub Category FormArray (Functionality)
 * @param value 
 */
  createSubSegment(value): FormGroup {
    let subcateselectedVar = false;
    if (value.subcate_selected) {
      subcateselectedVar = value.subcate_selected;
    }
    return this.fb.group({
      subcate_selected: subcateselectedVar,
      category_id: value.category_id,
      sub_category_id: value.id,
      sub_category_name: value.name,
      plan_id: '',
      plan_description: '',
      plans: this.fb.array([])
    });
  }

  /**
 * Plans FormArray (Plans)
 * @param value 
 */
  createPlans(value): FormGroup {
    let planSelectedVar = false;
    if (value.plan_selected) {
      planSelectedVar = value.plan_selected;
    }
    return this.fb.group({
      plan_selected: planSelectedVar,
      plan_id: value.id,
      plan_name: value.name,
      description: value.description
    });
  }

  /**
   * get All nested data of category=>sub-category(functionality)=>plans
   */
  getSubCategory() {
    this.userService.getPlans(this.userId).subscribe((res: any) => {
      if (res.success) {
        this.mainSegmentType = res.result;
        this.mainSegmentType.map((resItems, i) => {
          this.mainCatItems = this.segmentForm.get('mainCatItems') as FormArray;
          this.mainCatItems.push(this.createSegment(resItems));
          let control = (<FormArray>this.segmentForm.controls['mainCatItems']).at(i).get('sub_cat_items') as FormArray;
          if (resItems.sub_categories.length) {
            resItems.sub_categories.map((subItem, j) => {
              subItem['category_id'] = resItems['category_id'];
              this.subCatItems = this.segmentForm.get('subCatItems') as FormArray;
              control.push(this.createSubSegment(subItem));
              // console.log('control', control);
              const controlPlan = ((<FormArray>this.segmentForm.controls['mainCatItems']).at(i).get('sub_cat_items') as FormArray).at(j).get('plans') as FormArray;
              if (subItem.plans.length) {
                subItem.plans.map((planItem) => {
                  // console.log('controlPlan', controlPlan, 'planItem', planItem);
                  controlPlan.push(this.createPlans(planItem));
                  if (planItem.plan_selected) {
                    control['controls'].forEach((subCatCtrl: FormControl) => {
                      if (subCatCtrl.value.sub_category_id === subItem['id']) {
                        subCatCtrl.patchValue({ plan_id: planItem.id, plan_description: planItem.description });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  selectCategory($event, mainCategoryId: any) {
    if ($event.target.checked) {
      const parentArray = this.segmentForm.get('mainCatItems') as FormArray;
      parentArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value.category_id === mainCategoryId) {
          ctrl.patchValue({ selected: true });
        }
      });
    } else {
      const parentArray = this.segmentForm.get('mainCatItems') as FormArray;
      parentArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value.category_id === mainCategoryId) {
          ctrl.patchValue({ selected: false });
        }
      });
    }
  }

  /**
   * select segment sub category
   */
  selectSubCategory($event, mainCategoryId: any) {
    if ($event.target.checked) {
      const parentArray = this.segmentForm.get('mainCatItems') as FormArray;
      parentArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value.category_id === mainCategoryId) {
          ctrl.patchValue({ selected: true });
          let subCatFormArray = ctrl.get('sub_cat_items') as FormArray;
          subCatFormArray.controls.forEach((ctrlsub: FormControl) => {
            ctrlsub.patchValue({ subcate_selected: true });
            if (ctrlsub.get('plans')['controls']) {
              let plansArray = ctrlsub.get('plans')['controls'] as FormArray;
              // console.log('plansArray', plansArray, plansArray[0].get('plan_id').value, plansArray[0].get('description').value);
              ctrlsub.patchValue({ plan_id: plansArray[0].get('plan_id').value, plan_description: plansArray[0].get('description').value });
              plansArray[0].markAsTouched();
              plansArray[0].patchValue({ plan_selected: true });
            }
          });
        }
      });
      // console.log('parentArray', parentArray);
    } else {
      const parentArray = this.segmentForm.get('mainCatItems') as FormArray;
      parentArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value.category_id === mainCategoryId) {
          ctrl.patchValue({ selected: false });
          let subCatFormArray = ctrl.get('sub_cat_items') as FormArray;
          subCatFormArray.controls.forEach((ctrlsub: FormControl) => {
            ctrlsub.patchValue({ subcate_selected: false });
            if (ctrlsub.get('plans')['controls']) {
              let plansArray = ctrlsub.get('plans')['controls'] as FormArray;
              ctrlsub.patchValue({ plan_id: '', plan_description: '' });
              plansArray[0].markAsTouched();
              plansArray[0].patchValue({ plan_selected: false });
            }
          });
        }
      });
    }
  }
  /**
   * Change Brokerage Plan
   * @param $event 
   * @param mainCategoryId 
   * @param subCategoryId 
   */
  selectPlan($event, mainCategoryId: string | number, subCategoryId: string | number) {
    // console.log('planId', $event, mainCategoryId, subCategoryId);
    const planId = $event;
    let parentArray = this.segmentForm.get('mainCatItems') as FormArray;
    if (planId) {
      // console.log('parentArray.controls', parentArray.controls);
      parentArray.controls.map((ctrl: FormControl) => {
        if (ctrl.value.category_id === mainCategoryId) {//match with category id
          ctrl.patchValue({ selected: true });
          let subCatFormArray = ctrl.get('sub_cat_items') as FormArray;
          // console.log('subCatFormArray', ctrl.get('sub_cat_items'), subCatFormArray);
          subCatFormArray.controls.forEach((ctrlsub: FormControl) => {
            if (ctrlsub.value.sub_category_id === subCategoryId) {//match with subcategory id
              ctrlsub.patchValue({ subcate_selected: true });
              if (ctrlsub.get('plans')['controls']) {// plan control array
                let plansArray = ctrlsub.get('plans') as FormArray;
                plansArray.controls.forEach((planCtrl: FormControl) => {
                  planCtrl.patchValue({ plan_selected: false });
                  if (planCtrl.get('plan_id').value === planId) {//match with plan id
                    ctrlsub.patchValue({ plan_id: planCtrl.get('plan_id').value, plan_description: planCtrl.get('description').value });
                    ctrlsub.markAsTouched();
                    planCtrl.patchValue({ plan_selected: true });
                  }
                });
              }
            }
          });
        }
      });
    } else { // deselect main category, subcategory, plans too...
      parentArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value.category_id === mainCategoryId) {//match with category id
          ctrl.patchValue({ selected: false });
          let subCatFormArray = ctrl.get('sub_cat_items') as FormArray;
          // console.log('subCatFormArray', subCatFormArray);
          subCatFormArray.controls.forEach((ctrlsub: FormControl) => {
            // if (ctrlsub.value.sub_category_id === subCategoryId) {//match with subcategory id
            ctrlsub.patchValue({ subcate_selected: false });
            if (ctrlsub.get('plans')['controls']) {
              let plansArray = ctrlsub.get('plans') as FormArray;
              plansArray.controls.forEach((planCtrl: FormControl) => {
                // if (planCtrl.get('plan_id').value === planId) {//match with plan id
                ctrlsub.patchValue({ plan_id: '', plan_description: '' });
                ctrlsub.markAsTouched();
                planCtrl.patchValue({ plan_selected: false });
                // }
              });
            }
            // }
          });
        }
      });
    }
  }

  /**
   * save segment brokerage
   */
  onSubmit() {
    const valueOfForm = this.segmentForm.value;
    const selectedData = valueOfForm.mainCatItems.filter(ele => ele.selected === true);
    // return;
    if (!selectedData.length) {
      this.global.errorToastr('Please select the brokerage plan');
      return;
    }
    let objParams = [];
    selectedData.map((item) => {
      if (item.sub_cat_items.length) {
        item.sub_cat_items.map((subItem) => {
          const currentPage = {};
          if (subItem['plan_id']) {
            currentPage['category_id'] = subItem['category_id'];
            currentPage['sub_category_id'] = subItem['sub_category_id'];
            currentPage['plan_id'] = subItem['plan_id'];
            objParams.push(currentPage);
          }
          // if (subItem['plan_id']) {
          //   currentPage['is_sub_cat_exists'] = true;
          // }
          // console.log('currentPage', currentPage);
        });
      } else {
        const currentPage = {};
        currentPage['category_id'] = item['category_id'];
        currentPage['sub_category_id'] = '0';
        currentPage['plan_id'] = '0';
        objParams.push(currentPage);
      }
    });
    const planData = { planData: objParams };
    planData['id'] = this.userId;
    this.userService.segmentSubmit(planData).subscribe((res) => {
      if (res.success) {
        this.global.successToastr(res.message);
        this.router.navigate(['applications/details', this.userId]);
      } else {
        this.global.errorToastr(res.message);
      }
    });
  }

}
