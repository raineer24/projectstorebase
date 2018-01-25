import { HomeComponent } from './home.component';
import { ItemListEntryComponent } from './content/item-list/item-list-entry/item-list-entry.component';

export const HomeRoutes = [
  { path: '', component: HomeComponent },
  { path: 'item/:code/:string', component: ItemListEntryComponent }
];
