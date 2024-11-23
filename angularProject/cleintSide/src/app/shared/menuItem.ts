import { Injectable } from "@angular/core"

export interface Menu {
    state : string,
    name : string,
    icon : string,
    role : string
}

const MENUITEMS = [
    {state:'dashboard',name:'Dashboard',icon:'dashboard',role:''},
    {state:'categories',name:'Manage Category',icon:'category', role:'admin'},
    {state:'products',name:'Manage Products',icon:'inventory_2', role:'admin'},
    {state:'orders',name:'Manage Orders',icon:'list_alt', role:'admin'},
    {state:'bills',name:'Manage Bills',icon:'invioce', role:'admin'},
    {state:'user',name:'Manage Users',icon:'user', role:'admin'}
]

@Injectable()

export class MenuItems{
    getMenuItem() : Menu []{
        return MENUITEMS 
    }
}