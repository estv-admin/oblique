// import {Component, OnInit} from '@angular/core';
// import {TestBed, async, ComponentFixture} from '@angular/core/testing';
// import {
//     FormsModule, NgForm, FormBuilder, FormGroup, ReactiveFormsModule,
//     AbstractControl
// } from '@angular/forms';
// import {SchemaValidationDirective} from './schema-validation.directive';
// import {SchemaValidateDirective, schemaValidatorFactory} from './schema-validator';
// import {By} from '@angular/platform-browser';
// import {SchemaValidationService} from './schema-validation.service';
//
//
// describe('SchemaValidation', () => {
//
//     const schema = {
//         'title': 'SampleSchemaValidation',
//         'type': 'object',
//         'properties': {
//             'string': {
//                 'type': 'string',
//                 'minLength': 2,
//                 'maxLength': 10
//             },
//             'object': {
//                 'type': 'object',
//                 'properties': {
//                     'subproperty': {
//                         'type': 'number'
//                     },
//                 }
//             }
//         }
//     };
//
//     @Component({
//         template: `
//         <form [schemaValidation]='schema'>
//             <input type='text' name='string' ngModel schemaValidate>
//             <div ngModelGroup='object'>
//                 <input type='number' name='subproperty' ngModel schemaValidate>
//             </div>
//         </form>
//     `
//     })
//     class TemplateFormTestComponent {
//         schema = schema;
//     }
//
//     @Component({
//         template: `
//         <form [formGroup]='sampleForm'>
//             <input type='text' formControlName='string'>
//             <div formGroupName='object'>
//                 <input type='number' formControlName='subproperty'>
//             </div>
//         </form>
//     `,
//         providers: [SchemaValidationService]
//     })
//     class ModelFormTestComponent implements OnInit {
//         sampleForm: FormGroup;
//
//         constructor(private formBuilder: FormBuilder, private schemaValidationService: SchemaValidationService) {
//             schemaValidationService.compileSchema(schema);
//         }
//
//         ngOnInit() {
//             this.sampleForm = this.formBuilder.group({
//                 'string': ['', schemaValidatorFactory(this.schemaValidationService, 'string')],
//                 object: this.formBuilder.group({
//                     subproperty: [null, schemaValidatorFactory(this.schemaValidationService, 'object.subproperty')]
//                 })
//             });
//         }
//     }
//
//     /**
//      * This construct creates tests for template and model driven forms
//      */
//     [
//         {
//             formType: 'template', testComponent: TemplateFormTestComponent, formModule: FormsModule,
//             getControls: (fixture) => {
//                 return fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm).controls;
//             }
//         },
//         {
//             formType: 'model', testComponent: ModelFormTestComponent, formModule: ReactiveFormsModule,
//             getControls: (fixture: ComponentFixture) => {
//                 return fixture.componentInstance.sampleForm.controls;
//             }
//         }
//     ].forEach((CONFIG) => {
//         //TODO: add test for more complex types and required option
//         describe(`in a ${CONFIG.formType} driven form`, () => {
//             let fixture: ComponentFixture;
//             let component;
//             let controls: {[name: string]: AbstractControl};
//             let subproperties: {[name: string]: AbstractControl};
//
//             beforeEach(async(() => {
//                 TestBed.configureTestingModule({
//                     declarations: [
//                         CONFIG.testComponent,
//                         SchemaValidationDirective,
//                         SchemaValidateDirective
//                     ],
//                     imports: [CONFIG.formModule]
//                 })
//                     .compileComponents();
//             }));
//
//             beforeEach(async(() => {
//                 fixture = TestBed.createComponent(CONFIG.testComponent);
//                 component = fixture.componentInstance;
//                 fixture.detectChanges();
//
//                 fixture.whenStable().then(() => {
//                     controls = CONFIG.getControls(fixture);
//                     subproperties = (controls['object'] as FormGroup).controls;
//                 });
//             }));
//
//             it('should add no errors if input is valid', async(() => {
//                 fixture.whenStable().then(() => {
//                     controls['string'].setValue('validVal');
//                     fixture.detectChanges();
//
//                     expect(controls['string'].errors).toBeNull();
//                 });
//
//             }));
//
//             it('should add error object if input is invalid', async(() => {
//                 fixture.whenStable().then(() => {
//                     controls['string'].setValue('wayTooLongStringForTheMaxLength10');
//                     //ngControls['string'].valueAccessor.writeValue('wayTooLongStringForTheMaxLength10');
//                     fixture.detectChanges();
//
//                     expect(controls['string'].errors).not.toBeNull();
//                     expect(controls['string'].errors).toEqual({
//                         maxLength: {
//                             params: {
//                                 limit: 10
//                             }
//                         }
//                     });
//                 });
//             }));
//
//             it('should add no errors if subproperty is valid', async(() => {
//                 fixture.whenStable().then(() => {
//                     subproperties['subproperty'].setValue(42);
//                     fixture.detectChanges();
//
//                     expect(subproperties['subproperty'].errors).toBeNull();
//                 });
//             }));
//
//             it('should add error object if subproperty is invalid', async(() => {
//                 fixture.whenStable().then(() => {
//                     subproperties['subproperty'].setValue('aStringForANumberField');
//                     fixture.detectChanges();
//
//                     expect(subproperties['subproperty'].errors).not.toBeNull();
//                     expect(subproperties['subproperty'].errors).toEqual({
//                         type: {
//                             params: {
//                                 type: 'number'
//                             }
//                         }
//                     });
//                 });
//             }));
//         });
//
//     });
//
// });
