import { PaymentComponent } from './payment/payment.component';
import { AddressComponent } from './address/address.component';
import { CartComponent } from './cart/cart.component';
import { ConfirmComponent } from './confirm/confirm.component';

export const CheckoutRoutes = [
  { path: '', redirectTo: 'cart', pathMatch: 'full' },
  { path: 'cart', component: CartComponent },
  { path: 'address', component: AddressComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'confirm', component: ConfirmComponent }

];
