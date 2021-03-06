import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';
import {DataResourceBrowserComponent} from "./data-resource-browser.component";



const routes: Routes = [
    {
        path: '',
        component: DataResourceBrowserComponent,
        data: {
            title: 'Data Resource Browser'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DataResourceBrowserRoutingModule {}
