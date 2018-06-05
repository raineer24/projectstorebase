import { Component, OnDestroy, OnInit, Input, Output, OnChanges, EventEmitter  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/distinctUntilChanged';
import { AppState } from './../../../../interfaces';
import { environment } from './../../../../../environments/environment';
import { SearchActions } from './../../../reducers/search.actions';
import { CartItem } from './../../../../core/models/cart_item';
import { Item } from './../../../../core/models/item';
import { ProductService } from './../../../../core/services/product.service';
import { ProductActions } from './../../../../product/actions/product-actions';
import { getSelectedItem } from './../../../../product/reducers/selectors';
import { CheckoutActions } from './../../../../checkout/actions/checkout.actions';
import { UserActions } from './../../../../user/actions/user.actions';
import { UserService } from './../../../../user/services/user.service';


@Component({
  selector: "app-item-details-dialog",
  templateUrl: "./item-details-dialog.component.html",
  styleUrls: ["./item-details-dialog.component.scss"]
})
export class ItemDetailsDialogComponent implements OnInit, OnDestroy {
  @Input() item: any;
  @Input() categories: any;
  @Input() cartItems: CartItem[];
  @Input() isAuthenticated: boolean;
  @Input() userLists: any;
  @Output() onCloseModalEmit: EventEmitter<string> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  suggestedItems: Array<Object> = [];
  itemQuantity: number = 0;
  quantityControl = new FormControl();
  saveAmount: any;
  isCreateList: boolean = false;
  MIN_VALUE: number = 1;
  MAX_VALUE: number = 9999;
  includedLists: Array<any> = [];
  listState: Array<any> = [];
  inputNewList = new FormControl();
  specialInstructions = new FormControl();
  itemCategories: Array<any> = [null,null,null];
  itemSlider = { state: 'set1', class: '' };
  private imageRetries: number = 0;
  private componentDestroyed: Subject<any> = new Subject();

  constructor(
    private productService: ProductService,
    private productActions: ProductActions,
    private checkoutActions: CheckoutActions,
    private searchActions: SearchActions,
    private userActions: UserActions,
    private userService: UserService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {

    const cartItem = this.getCartItem(this.item.id);
    if (typeof cartItem != "undefined") {
      this.itemQuantity = cartItem.quantity;
      this.specialInstructions.setValue(cartItem.instructions);
    }
    this.quantityControl.valueChanges.debounceTime(300).subscribe(value => {
      if (isNaN(value) || !Number.isInteger(value) || value < this.MIN_VALUE || value > this.MAX_VALUE) {
        //do nothing
      } else {
        this.itemQuantity = value;
        let cartItem = this.getCartItem(this.item.id);
        cartItem.quantity = value;
        this.store.dispatch(this.checkoutActions.updateCartItem(cartItem));
      }
    });
    Observable.fromEvent(window, "wheel")
      .map((event: any) => {
        event.preventDefault();
        event.stopPropagation();
      })
      .takeUntil(this.componentDestroyed)
      .subscribe();

    this.userService.getListsOfItem(this.item.id)
      .takeUntil(this.componentDestroyed)
      .subscribe(res => {
        this.includedLists = res.map(x => {
          return {
            list_id: x.list_id,
            listitem_id: x.listitem_id
          };
        });
        this.setListCheckbox();
      });

    this.initSuggestedItems();
    this.initBreadCrumbs();
    //
    // this.store.select(getSelectedItem)
    //   .distinctUntilChanged(item => item)
    //   .takeUntil(this.componentDestroyed).subscribe(item => {
    //     console.log(item)
    //     this.initBreadCrumbs();
    // })
  }

  ngOnChanges() {
    console.log("TEST");
    if (this.cartItems.length) {
      console.log(this.item.id)
      const cartItem = this.getCartItem(this.item.id);
      if(cartItem) {
        this.itemQuantity = cartItem.quantity;
      } else {
        this.itemQuantity = 0;
      }
    }
    this.initBreadCrumbs();
  }

  ngOnDestroy() {
    this.onCloseModalEmit.emit();
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

  initBreadCrumbs(): void {
    this.itemCategories = [null,null,null];
    if(this.categories.length && this.item) {
      let index1, index2, index3;
      index1 = this.categories.findIndex(cat => cat.id == this.item.category1);
      this.itemCategories[0] = this.categories[index1];
      if (this.item.category2) {
        index2 = this.categories[index1].subCategories.findIndex(cat => cat.id == this.item.category2);
        this.itemCategories[1] = index2 >= 0 ? this.categories[index1].subCategories[index2]: null;
      }
      if (this.item.category3) {
        index3 = this.categories[index1].subCategories[index2].subCategories.findIndex(cat => cat.id == this.item.category3);
        this.itemCategories[2] = index3 >= 0 ? this.categories[index1].subCategories[index2].subCategories[index3]: null;
      }
    }
  }

  initSuggestedItems(): void {
    this.productService.getSuggestedItems(this.item.id)
      .takeUntil(this.componentDestroyed)
      .subscribe(res => {
        this.suggestedItems = res;
      });
  }

  hideSavings(dp, p) {
    return dp - p !== 0;
  }

  hideListPrice(dp, p) {
    return dp !== p;
  }

  getItemImageUrl(key) {
    let url = "";
    if (!key || this.imageRetries > 0) {
      url = "assets/omg-03.png";
    } else {
      url = environment.IMAGE_REPO + key + ".jpg";
    }
    return url;
  }

  onImageError() {
    this.imageRetries++;
  }

  onCloseModal() {
    this.onCloseModalEmit.emit();
  }

  addToCart() {
    this.itemQuantity = 1;
    this.store.dispatch(this.checkoutActions.addToCart(this.item));
  }

  incrementQuantity() {
    if (this.itemQuantity < this.MAX_VALUE) {
      this.itemQuantity++;
      this.quantityControl.setValue(this.itemQuantity);
    }
  }

  decrementQuantity() {
    if (this.itemQuantity > this.MIN_VALUE) {
      this.itemQuantity--;
      this.quantityControl.setValue(this.itemQuantity);
    }
  }

  getCartItem(id: number) {
    return this.cartItems.find(cartItem => cartItem.item_id === id);
  }

  toggleCreateNewList(): void {
    this.isCreateList = true;
  }

  selectList(index: number, id: number) {
    let state;
    if (this.listState[id] == "undefined") {
      this.listState[id] = true;
      state = true;
    } else {
      state = !this.listState[id];
      this.listState[id] = state;
    }
    if (state) {
      const listitem = {
        list_id: id,
        item_id: this.item.id
      };
      this.userService
        .addListItem(listitem)
        .takeUntil(this.componentDestroyed)
        .subscribe(res => {
          if (res.message == "Saved") {
            this.includedLists.push({ list_id: id, listitem_id: res.id });
            this.setListCheckbox();
          } else {
          }
        });
    } else {
      const ind = this.includedLists.findIndex(x => x.list_id == id);
      this.userService
        .removeListItem(this.includedLists[ind].listitem_id)
        .takeUntil(this.componentDestroyed)
        .subscribe(res => {
          if (res.message == "Deleted") {
            this.includedLists.splice(ind, 1);
            this.setListCheckbox();
          } else {
          }
        });
    }
  }

  createNewList(): void {
    if (this.inputNewList.value) {
      const d = new Date();
      const params = {
        name: this.inputNewList.value,
        description: d.toLocaleDateString() + " " + d.toLocaleTimeString()
      };
      this.store.dispatch(this.userActions.createUserList(params));
      this.inputNewList.setValue("");
      this.isCreateList = false;
      this.setListCheckbox();
    }
  }

  setListCheckbox(): void {
    this.userLists.forEach(list => {
      if (this.includedLists.find(x => x.list_id == list.id)) {
        this.listState[list.id] = true;
      } else {
        this.listState[list.id] = false;
      }
    });
  }

  keyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  checkIfValid(e) {
    const value = e.target.value;
    if(isNaN(value) || !Number.isInteger(value)) {
      this.quantityControl.setValue(this.itemQuantity)
    }
    if (value < this.MIN_VALUE) {
      this.quantityControl.setValue(this.MIN_VALUE)
    }
    if (value > this.MAX_VALUE) {
      this.quantityControl.setValue(this.MAX_VALUE)
    }
  }

  selectCategory(...categories): void {
    let filters;
    if(categories[0] == 'all') {
      this.store.dispatch(this.productActions.getAllProducts());
    } else {
      filters = {
        mode: 'category',
        level: categories[0].level,
        categoryId: categories[0].id,
        breadcrumbs: categories.map(cat => { return {id: cat.id, name: cat.name, level: cat.level}}).reverse()
      }
      this.store.dispatch(this.productActions.getItemsByCategory(filters));
    }
    this.store.dispatch(this.searchActions.setFilter({
      filters: filters ? [filters]: [],
      categoryIds: []
    }));
    this.onCloseModal()
    window.scrollTo(0, 0);
  }

  sliderBack(): void {
    switch(this.itemSlider.state) {
    case 'set1':
      break;
    case 'set2':
      this.itemSlider = { state: 'set1', class: 'set2ToSet1' };
      break;
    case 'set3':
      this.itemSlider = { state: 'set2', class: 'set3ToSet2' };
      break;
    }
  }

  sliderNext(): void {
    switch(this.itemSlider.state) {
    case 'set1':
      if(this.suggestedItems.length > 5) {
        this.itemSlider = { state: 'set2', class: 'set1ToSet2' };
      }
      break;
    case 'set2':
      if(this.suggestedItems.length > 10) {
        this.itemSlider = { state: 'set3', class: 'set2ToSet3' };
      }
      break;
    case 'set3':
      break;
    }
  }

  openSuggestedItem(item: Item): void {
    const slug = `/item/${item.id}/${item.slug}`;
    window.history.pushState('item-slug', 'Title', slug);
    this.store.dispatch(this.productActions.addSelectedItem(item));
    this.imageRetries = 0;
    this.itemSlider = { state: 'set1', class: '' };
    this.initSuggestedItems();
  }

  onInstructionsBlur(): void {
    const text = this.specialInstructions.value;
    let cartItem = this.getCartItem(this.item.id);
    if(text !== cartItem.instructions){
      cartItem.instructions = text;
      this.store.dispatch(this.checkoutActions.updateCartItem(cartItem));}
    }
}
