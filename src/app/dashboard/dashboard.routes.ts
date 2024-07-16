import { Routes } from "@angular/router";
import { DashboardLayoutComponent } from "./dashboard-layout/dashboard-layout.component";

export const routes: Routes = [
    {
        path: '',
        title: 'Chat',
        component: DashboardLayoutComponent
    },
]