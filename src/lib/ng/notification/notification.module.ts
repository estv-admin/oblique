import {NgModule, ModuleWithProviders} from '@angular/core';
import {NotificationComponent} from './notification.component';
import {CommonModule} from '@angular/common';
import {NotificationService} from './notification.service';
import {TranslateModule} from '@ngx-translate/core';
import {NotificationConfig} from './notification-config';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	declarations: [NotificationComponent],
	exports: [NotificationComponent]
})
export class NotificationModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: NotificationModule,
			providers: [
				NotificationService,
				NotificationConfig
			]
		};
	}
}
