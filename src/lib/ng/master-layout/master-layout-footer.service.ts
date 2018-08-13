import {Injectable, EventEmitter} from '@angular/core';

/**
 * Service for controlling ObliqueUI footer composite features.
 * @deprecated since version 2.1.0. Will be deleted in version 3.0.0. Use MasterLayoutComponent & MasterLayoutService instead
 */
@Injectable()
export class MasterLayoutFooterService {

	public variantChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	private smallValue = false;

	set small(value) {
		this.smallValue = value;
		this.variantChange.next(this.smallValue);
	}

	get small() {
		return this.smallValue;
	}

	constructor() {
		console.warn('@deprecated since version 2.1.0. Will be deleted in version 3.0.0. Use MasterLayoutComponent & MasterLayoutService instead');
	}
}
