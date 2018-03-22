import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MockTranslatePipe} from '../../../../../testhelpers';
import {NumberFormatSampleComponent} from './number-format-sample.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NumberFormatDirective} from '../../../../lib/ng/number-format';

describe('NumberFormatSampleComponent', () => {
	let component: NumberFormatSampleComponent;
	let fixture: ComponentFixture<NumberFormatSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule],
			declarations: [NumberFormatSampleComponent, MockTranslatePipe, NumberFormatDirective]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NumberFormatSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
