import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EmbryoService } from '../../../Services/Embryo.service';
import { AccountService } from 'src/app/AdminPanel/Service/account.service';

@Component({
  selector: 'HeaderOne',
  templateUrl: './HeaderOne.component.html',
  styleUrls: ['./HeaderOne.component.scss']
})
export class HeaderOneComponent implements OnInit {

   toggleActive     : boolean = false;
   cartProducts     : any;
   popupResponse    : any;
   wishlistProducts : any;

   constructor(public embryoService: EmbryoService , private accountservice : AccountService) {}

   ngOnInit() {  
      if(this.accountservice.getToken()){
         let role = this.accountservice.getPayload().role
         console.log(role);
         role?this.embryoService.connected= true :this.embryoService.connected = false 
      }
      else{
         this.embryoService.connected = false 
      }
     
      
   }

   public toggleSearch() {
      document.querySelector('app-main').classList.toggle('form-open');
   }

   public toggleSidebar()
   {
      this.embryoService.sidenavOpen = !this.embryoService.sidenavOpen;
   }

   public openConfirmationPopup(value:any) {
      let message = "Are you sure you want to delete this product?";
      this.embryoService.confirmationPopup(message).
         subscribe(res => {this.popupResponse = res},
                   err => console.log(err),
                   ()  => this.getPopupResponse(this.popupResponse, value, 'cart')
                  );
   }

   public getPopupResponse(response:any, value:any, type) {
      if(response) {
         if(type == 'cart'){
            this.embryoService.removeLocalCartProduct(value);
         } else {
            this.embryoService.removeLocalWishlistProduct(value);
         }
      }
   }

   public addAllWishlistToCart(values:any) {
      this.embryoService.addAllWishListToCart(values);
   } 

   public openWishlistConfirmationPopup(value:any) {
      let message = "Are you sure you want to add all products?";
      this.embryoService.confirmationPopup(message).
         subscribe(res => {this.popupResponse = res},
                   err => console.log(err),
                   ()  => this.getPopupResponse(this.popupResponse, value, 'wishlist')
                  );
   }

   public selectedCurrency(value) {
      this.embryoService.currency = value;
   }

   public selectedLanguage(value) {
      this.embryoService.language = value;
   }

   public addToCart(value) {
      this.embryoService.addToCart(value, 'wishlist');
   }
}
