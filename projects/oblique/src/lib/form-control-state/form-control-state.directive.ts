import {
	AfterViewInit,
	ContentChild,
	Directive,
	ElementRef,
	HostBinding,
	Input,
	Optional,
	Renderer2
} from '@angular/core';
import {FormGroupDirective, FormGroupName, NgControl, NgForm, NgModelGroup} from '@angular/forms';
import {merge} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe.class';
import {ThemeService} from '../themes/theme.service';

/**
 * @deprecated with material theme since version 4.0.0. Use angular default material behavior for both mandatory and error states instead
 */
@Directive({
	selector: '[orFormControlState]',
	exportAs: 'orFormControlState'
})
export class FormControlStateDirective extends Unsubscribable implements AfterViewInit {

	@Input() pristineValidation = false;
	@Input() mandatory;

	@HostBinding('class.has-error') hasErrorClass = false;

	@ContentChild(NgControl, {static: false}) ngControl: NgControl;

	private readonly form: NgForm | FormGroupDirective;
	private readonly group: NgModelGroup | FormGroupName;
	private inputContainer;
	private inputElement;

	constructor(@Optional() ngForm: NgForm,
				@Optional() formGroupDirective: FormGroupDirective,
				@Optional() formGroupName: FormGroupName,
				@Optional() modelGroup: NgModelGroup,
				theme: ThemeService,
				private readonly elementRef: ElementRef,
				private readonly renderer: Renderer2) {
		super();
		theme.deprecated('form control state', 'form-field/overview#error-messages');
		this.form = ngForm || formGroupDirective;
		this.group = modelGroup || formGroupName;

		if (!this.form) {
			throw new Error('You need either a NgForm or a FormGroupDirective for the FormControlStateDirective!');
		}
	}

	ngAfterViewInit() {
		if (!this.ngControl) {
			throw new Error('You need to provide an NgControl for the FormControlStateDirective!');
		}

		// NOTE: [ngModel] is for template-driven forms, [formControlName] is for reactive forms and [name] is for
		// template-driven forms with 2 ways binding because querySelector cannot match "[(ngModel)]"
		this.inputElement = this.elementRef.nativeElement.querySelector('[ngModel], [formControlName], [name]');
		if (!this.inputElement) {
			throw new Error('you need to provide either a ngModel or a formControlName for the FormControlStateDirective!');
		}

		this.inputContainer = this.inputElement.parentElement;

		merge(
			this.form.ngSubmit,
			this.ngControl.statusChanges
		)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(() => this.generateState());

		this.delayStateGenerationForReactiveForms();
	}

	private delayStateGenerationForReactiveForms(): void {
		// Reactive forms instantiate the view only after the model is ready. Thus modifying this.errors in the same
		// tick as ngAfterViewInit will trigger an ExpressionChangedAfterItHasBeenCheckedError
		if (this.form instanceof FormGroupDirective) {
			setTimeout(() => this.generateState(), 0);
		}
	}

	private isMandatory(): boolean {
		return this.mandatory
			|| this.inputElement.hasAttribute('required')
			|| (this.ngControl.errors && this.ngControl.errors.required);
	}

	private generateState(): void {
		this.hasErrorClass = (this.form.submitted || !this.ngControl.pristine || this.pristineValidation)
			? this.ngControl.invalid
			: false;

		const mandatory = 'control-mandatory';
		if (this.isMandatory() && !this.ngControl.value) {
			this.renderer.addClass(this.inputContainer, mandatory);
		} else {
			this.renderer.removeClass(this.inputContainer, mandatory);
		}
	}
}
