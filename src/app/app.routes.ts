import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminDashBoardComponent } from './pages/admin-dash-board/admin-dash-board.component';
import { AgentDashBoardComponent } from './pages/agent-dash-board/agent-dash-board.component';
import { CustomerDashBoardComponent } from './pages/customer-dash-board/customer-dash-board.component';
import { RoleGuard } from './auth/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminDashBoardComponent, canActivate: [RoleGuard], data: { role: 'ADMIN' } },
  { path: 'agent', component: AgentDashBoardComponent, canActivate: [RoleGuard], data: { role: 'AGENT' } },
  { path: 'customer', component: CustomerDashBoardComponent, canActivate: [RoleGuard], data: { role: 'CUSTOMER' } },
  { path: '**', redirectTo: '/home' }
];