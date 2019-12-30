import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';

import { MenuItems } from '../../../Core/menu/menu-items/menu-items';
import { AdminGenericService } from 'src/app/AdminPanel/Service/AdminGeneric.service';
import { BaseUrl } from 'src/app/models/baseurl.data';
import { HomeMenu } from 'src/app/Models/MenuHome.model';
import { SousCateg } from 'src/app/Models/souscategorie.model';

export interface Menu {
  state: string;
  name?: string;
  type?: string;
  icon?: string;
  children?: Menu[];
}

@Component({
  selector: 'embryo-Menu',
  templateUrl: './Menu.component.html',
  styleUrls: ['./Menu.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})



export class MenuComponent implements OnInit {


    menu : Menu[]=[];
    MenuChilren : Menu[]=[];
    souscategMenu :Menu[]=[]
    categories:any=[]
    souscategories :SousCateg[]=[]
    expanded       : boolean;

   constructor(public menuItems: MenuItems,public router: Router, public translate: TranslateService,
    private genericservice: AdminGenericService) {

//       this.getCategories().subscribe(res => {
//         console.log(res);
//         this.categories=res;
// //  debugger
//         this.categories.forEach(categorie => {
//           this.souscategories=[]
          
          
//           categorie.SousCategories.forEach(e => {
//             this.souscategories.push(e as SousCateg)
//           });
          
//           // debugger
  
//           for (let i = 0; i < this.souscategories.length; i++) {
//             const souscateg = this.souscategories[i];
                
//             this.souscategMenu.push({
//                     state: 'products/'+categorie.Ncategorie,
//                     name: souscateg.NsousCategorie,
//                     type: 'queryParams',
//                     icon: 'arrow_right_alt',
//                      })
            
//           }
               

//           this.MenuChilren = [
//             {
//                 state: categorie.Ncategorie,
//                 name: categorie.Ncategorie,
//                 type: 'sub',
//                 icon: 'arrow_right_alt',
//                  children:this.souscategMenu
//             }
//           ]
        


//           console.log("Menu : ",this.MenuChilren);
          

//         });
//         }, err => { console.log(err); }); 

//         let MenuChilren1 = [
//           {
//               state: "categorie.Ncategorie",
//               name: "categorie.Ncategorie",
//               type: 'sub',
//               icon: 'arrow_right_alt',
               
//           }
//       ]

//       setTimeout(() => {
        
//         console.log("Menu 2 : ",this.MenuChilren);
//       }, 2000);


//       this.menu = [{
//         state: 'home',
//         name: 'ACCEUIL',
//         type: 'link',
//         icon: 'home',
//         },
//         {
//           state: 'products',
//           name: 'Products',
//           type: 'link',
//           icon: 'party_mode'
//       },
//       {
//         state: 'test',
//         name: 'test',
//         type: 'sub',
//         icon: 'party_mode',
//         children:MenuChilren1
//     },
//       {
//         state: 'products',
//         name: 'Categories',
//         type: 'sub',
//         icon: 'party_mode',
//         children: this.MenuChilren
//       },
//       {
//         state: 'contact',
//         name: 'CONTACT US',
//         type: 'link',
//         icon: 'perm_contact_calendar'
//     },
//   ]

//   setTimeout(() => {
    
//     console.log("Menu 3 : ",this.MenuChilren);
//   }, 2000);


   }

   ngOnInit() {

  
   }

   public onItemSelected(item: any) {
      if (item.children && item.children.length) {
         this.expanded = !this.expanded;
      }
   }


   public redirectTo(subchildState){
   }

   getCategories(){
     return this.genericservice.get(BaseUrl + '/categories')
    };

   
}