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
    {state:'orders',name:'Manage Orders',icon:'list_alt', role:''},
    {state:'bills',name:'Manage Bills',icon:'import_contacts', role:''},
    {state:'users',name:'Manage Users',icon:'people', role:'admin'}
]

@Injectable()

export class MenuItems{
    getMenuItem() : Menu []{
        return MENUITEMS 
    }
}