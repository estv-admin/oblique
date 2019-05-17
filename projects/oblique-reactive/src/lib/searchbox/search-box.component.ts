import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit, ViewEncapsulation} from '@angular/core';

export interface SearchWidgetItem {
	id: string;
	label: string;
	routes: string[];
	fragment?: string;
	description?: string;
}

let nextId = 0;

@Component({
	selector: 'or-search-box',
	exportAs: 'orSearchBox',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './search-box.component.html',
	styleUrls: ['./search-box.component.scss'],
	encapsulation: ViewEncapsulation.None,
	/* tslint:disable:use-host-property-decorator */
	host: {class: 'search-box', role: 'search'}
})
export class SearchBoxComponent implements OnInit {
	@Input() items: SearchWidgetItem[];
	@Input() placeholder = 'i18n.oblique.search.placeholder';
	@Input() minPatternLength = 1;
	@Input() maxResults = 10;
	@Input() @HostBinding('class.slide-control') slide = true;
	pattern: string;
	isOpened = false;
	id = `search-input-${nextId++}`;

	ngOnInit() {
		this.isOpened = !this.slide;
	}

	open(): void {
		this.isOpened = true;
	}

	close(): void {
		if (this.slide) {
			this.isOpened = false;
		}
	}
}
