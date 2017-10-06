import {
	AfterViewInit, ContentChild, ContentChildren, Directive,
	ElementRef, EventEmitter, HostBinding, Inject, Output, QueryList
} from '@angular/core';
import {MasterLayoutNavigationToggleDirective} from './master-layout-navigation-toggle.directive';
import {MasterLayoutNavigationMenuDirective} from './master-layout-navigation-menu.directive';
import {MasterLayoutHeaderService} from './master-layout-header.service';

@Directive({
	selector: '[orMasterLayoutNavigationItem]',
	exportAs: 'orMasterLayoutNavigationItem'
})
export class MasterLayoutNavigationItemDirective implements AfterViewInit {

	@HostBinding('class.show')
	public show = false;

	@Output()
	onClose = new EventEmitter<void>();

	@ContentChildren(MasterLayoutNavigationToggleDirective, {descendants: true})
	$toggles: QueryList<MasterLayoutNavigationToggleDirective>;

	@ContentChild(MasterLayoutNavigationMenuDirective)
	$menu: MasterLayoutNavigationMenuDirective;

	@ContentChildren(MasterLayoutNavigationItemDirective, {descendants: true})
	$items: QueryList<MasterLayoutNavigationItemDirective>;

	constructor(
		public elementRef: ElementRef,
		private headerService: MasterLayoutHeaderService) {

		// Subscribe to header changes:
		// this.headerService.openChange.subscribe((open) => {
		// 	// Ensure we close all open sub menus:
		// 	if (this.$menu && !open) {
		// 		this.$menu.hide();
		// 	}
		// });
	}

	ngAfterViewInit() {
		this.$toggles.forEach(($toggle) => {
			$toggle.onToggle.subscribe(($event) => {
				if (!$event.prevented) {
					if (this.$menu) {
						if (this.show) {
							this.close();
						} else {
							this.open();
						}
					} else {
						// Final toggle, let's close all parent menus:
						this.onClose.emit();

						// Ensure we close the application header (when master layout is collapsed):
						this.headerService.open = false;
					}
					$event.prevented = true;
				}
			});
		});

		this.$items.forEach(($item) => {
			$item.onClose.subscribe(() => {
				this.close();
			});
		});
	}

	open() {
		this.show = true;

		if (this.$menu) {
			this.$menu.show();
		}
	}

	close() {
		this.show = false;

		if (this.$menu) {
			this.$menu.hide();
		}
	}
}