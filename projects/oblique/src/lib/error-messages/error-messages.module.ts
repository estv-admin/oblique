import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {TranslateParamsModule} from '../translate-params/translate-params.module';
import {FormControlStateModule} from '../form-control-state/form-control-state.module';
import {ErrorMessagesComponent} from './error-messages.component';
import {ErrorMessagesService} from './error-messages.service';
export {ErrorMessagesComponent} from './error-messages.component';
export {ErrorMessagesService} from './error-messages.service';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		FormControlStateModule,
		TranslateParamsModule
	],
	declarations: [ErrorMessagesComponent],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [ErrorMessagesComponent]
})
export class ErrorMessagesModule {
}