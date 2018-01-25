import { HomeComponent } from './home.component';

export const HomeRoutes = [
  { path: '', component: HomeComponent },
  { path: 'item/:id/:string', component: HomeComponent }
];
