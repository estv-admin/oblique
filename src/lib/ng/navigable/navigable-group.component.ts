import {
	Input, EventEmitter, Output, AfterViewInit, ContentChildren, QueryList, Component, ViewEncapsulation
} from '@angular/core';
import {NavigableDirective, NavigableOnChangeEvent, NavigableOnMoveEvent} from './navigable.directive';

/**
 * NavigableGroup component.
 */
@Component({
	selector: 'or-navigable-group',
	template: `<ng-content></ng-content>`,
	exportAs: 'navigableGroup',
	encapsulation: ViewEncapsulation.None,
	styles: [`
		.navigable {
			line-height: 38px;
			transition-property: background-color;
			transition-duration: .25s;
			animation-timing-function: ease-in-out;
		}

		.navigable .navigable-actions {
			display: flex;
			justify-content: flex-end;
		}

		.navigable .navigable-actions:not(.navigable-actions-fluid) {
			min-height: 38px;
			min-width: 113px;
		}

		.navigable .navigable-actions.navigable-actions-md:not(.navigable-actions-fluid) {
			min-width: 150px;
		}

		.navigable .navigable-actions:not(.text-left) {
			text-align: right;
		}

		.navigable .navigable-actions .navigable-reveal {
			display: none;
		}

		.navigable .navigable-actions .navigable-show {
			visibility: hidden;
		}

		.navigable .navigable-actions .navigable-collapse {
			display: inline-flex;
		}

		.navigable .navigable-actions.navigable-actions-center {
			text-align: center;
		}

		.navigable:hover,
		.navigable:hover > td,
		.navigable.list-group-item:hover,
		.navigable.navigable-highlight:hover,
		.navigable.navigable-highlight:hover > td,
		.navigable.navigable-highlight.list-group-item:hover,
		.navigable.navigable-active,
		.navigable.navigable-active > td,
		.navigable.navigable-active.list-group-item,
		.navigable.navigable-selected,
		.navigable.navigable-selected > td,
		.navigable.navigable-selected.list-group-item {
			transition-property: background-color;
			transition-duration: .6s;
			animation-timing-function: ease-in-out;
			background-color: #d8e8ef;
		}

		.navigable:hover .navigable-actions .navigable-show,
		.navigable.navigable-active .navigable-actions .navigable-show {
			visibility: visible;
		}

		.navigable:hover .navigable-actions .navigable-reveal,
		.navigable.navigable-active .navigable-actions .navigable-reveal {
			visibility: visible;
			display: inline-flex;
		}

		.navigable:hover .navigable-actions .navigable-collapse,
		.navigable.navigable-active .navigable-actions .navigable-collapse {
			display: none;
		}

		.navigable.navigable-active,
		.navigable:focus {
			z-index: 2;
		}

		.navigable.navigable-highlight {
			background-color: #fffab2 !important;
			transition-duration: 3.5s;
		}

		.navigable.list-group-item .navigable-actions {
			white-space: nowrap;
		}

		@media screen {
			> td {
				height: 54px;
			}
		}`]
})
export class NavigableGroupComponent implements AfterViewInit {

	/**
	 * The array containing all group items
	 */
	@Input('items')
	items: any[];

	@ContentChildren(NavigableDirective)
	navigables: QueryList<NavigableDirective>;

	/**
	 * The array which will contain the selected models.
	 */
	@Input('selection')
	get selection() {
		return this.selectionValue;
	}

	set selection(val: any[]) {
		this.selectionValue = val;
		this.selectionOnChange.emit(this.selectionValue);
	}

	@Output()
	selectionOnChange = new EventEmitter();

	private selectionValue: any[];

	ngAfterViewInit(): void {
		this.navigables.forEach(navigable => {

			navigable.navigableOnActivation.subscribe(() => {
				this.addToSelection(navigable);
			});

			navigable.navigableOnChange.subscribe(($event: NavigableOnChangeEvent) => {
				const index = this.indexOf(navigable);
				let next: NavigableDirective = null;

				if ($event.keyCode === NavigableDirective.KEYS.UP) {
					next = this.fromIndex(Math.max(index - 1, 0));
				} else if ($event.keyCode === NavigableDirective.KEYS.DOWN) {
					next = this.fromIndex(Math.min(index + 1, this.navigables.length));
				}

				if (next) {
					if (next.selected) {
						this.deselect(navigable);
					}

					this.activate(next, $event.combine);
					next.focus();
				}
			});

			navigable.navigableOnMouseDown.subscribe(($event: MouseEvent) => {
				if ($event && $event.shiftKey) {
					this.selectChildRange(navigable);
				} else if ($event && $event.ctrlKey) {
					if (navigable.selected) {
						this.removeFromSelection(navigable);
					} else {
						this.addToSelection(navigable);
					}
				} else {
					this.navigables.forEach(child => {
						if (child !== navigable) {
							this.deactivate(child, true);
						}
					});

					this.addToSelection(navigable);
				}

				// In any case, deactivate current active navigable item:
				this.deactivate(this.getActive());
			});

			navigable.navigableOnFocus.subscribe(() => {
				if (!navigable.active) {
					// When a child is about to receive focus, deactivate the other items:
					this.navigables.forEach(child => child !== navigable && this.deactivate(child, true)); //TODO: take a look at this
					this.addToSelection(navigable);
				}
			});

			navigable.navigableOnMove.subscribe(($event: NavigableOnMoveEvent) => {
				if (!$event.prevented) {
					let from = this.indexOf(navigable);

					if ($event.keyCode === NavigableDirective.KEYS.UP) {
						let to = from - 1;
						if (to >= 0) {
							this.items.splice(to, 0, this.items.splice(from, 1)[0]);
						}
					} else if ($event.keyCode === NavigableDirective.KEYS.DOWN) {
						let to = from + 1;
						if (to < this.items.length) {
							this.items.splice(to, 0, this.items.splice(from, 1)[0]);
						}
					}
				}
			});
		});
	}

	// Public API ---------------------
	public add(model: any) {
		let navigableToSelect = this.navigables.find((navigable: NavigableDirective) => {
			return navigable.model === model;
		});

		if (navigableToSelect) {
			this.select(navigableToSelect, true);
		}
	}

	public remove(model: any) {
		let navigableToRemove = this.navigables.find((navigable: NavigableDirective) => {
			return navigable.model === model;
		});

		if (navigableToRemove) {
			this.deactivate(navigableToRemove, true);
		}
	}

	// Private API ---------------------

	private activate(navigable: NavigableDirective, combine?: boolean) {
		this.navigables.forEach(child => child !== navigable && this.deactivate(child)); //TODO: take a look at this

		navigable.active = true;
		this.select(navigable, combine);
	}

	private deactivate(navigable: NavigableDirective, unselect?: boolean) {
		if (navigable) {
			navigable.active = false;

			if (unselect) {
				this.deselect(navigable);
			}
		}
	}

	private select(navigable: NavigableDirective, combine?: boolean) {
		if (!combine) {
			this.navigables.forEach(child => this.deselect(child));
		}
		navigable.selected = true;
		this.addToSelection(navigable);
	}

	private deselect(navigable: NavigableDirective) {
		navigable.selected = false;
		this.removeFromSelection(navigable);
	}

	private selectChildRange(target: NavigableDirective, combine?: boolean) {
		const from = this.indexOf(this.getActive());
		if (!combine) {
			this.navigables.forEach(child => this.deselect(child));
		}
		const to = this.indexOf(target);
		const selection = this.navigables.toArray().slice(Math.min(from, to), Math.max(from, to) + 1);
		selection.forEach(child => child !== target && this.select(child, true));
	}

	private addToSelection(navigable) {
		if (!this.inSelection(navigable)) {
			this.selection.push(navigable.model);
		}
	}

	private removeFromSelection(navigable) {
		this.selection.splice(this.selection.indexOf(navigable.model), 1);
	}

	private inSelection(navigable) {
		return this.selection.indexOf(navigable.model) > -1;
	}

	private getActive() {
		return this.navigables.toArray().filter(child => child.active)[0];
	}

	private fromIndex(index: number): NavigableDirective {
		return this.navigables.toArray()[index];
	}

	private indexOf(child: NavigableDirective): number {
		return this.navigables.toArray().indexOf(child);
	}
}