import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { EmbryoService } from '../../../Services/Embryo.service';
import { AdminGenericService } from 'src/app/AdminPanel/Service/AdminGeneric.service';
import {BaseUrl} from '../../../models/baseurl.data';

@Component({
  selector: 'app-DetailPage',
  templateUrl: './DetailPage.component.html',
  styleUrls: ['./DetailPage.component.scss']
})
export class DetailPageComponent implements OnInit {

   Product              :any
   id                : any;
   type              : any;
   apiResponse       : any;
   singleProductData : any;
   productsList      : any;

   constructor(private route: ActivatedRoute,
              private router: Router,
              public embryoService: EmbryoService,
              private genericservice : AdminGenericService) {
      
   }

   ngOnInit() {
      this.route.params.subscribe(res => {
         this.id = res.id;
         this.type = res.type;
         this.getData();
      })
      console.log(this.id);
      
      this.getProduct()
   }

   public getData() {
      this.embryoService.getProducts().valueChanges().subscribe(res => this.checkResponse(res));
   }

   public checkResponse(response) {
      // this.productsList = null;
      // this.productsList = response[this.type];
      // for(let data of this.productsList)
      // {
      //    if(data.id == this.id) {
      //       this.singleProductData = data;
      //       break;
      //    }
      // }
   }

   public addToCart(value) {
      this.embryoService.addToCart(value);
   }

   public addToWishList(value) {
      this.embryoService.addToWishlist(value);
   }

   getProduct(){
      this.genericservice.get(BaseUrl+'/produits/'+this.id)
      .subscribe(res=>{
         this.Product=res
         console.log(this.Product);
      },
      err=>{
         console.log(err);
         
      })
   }
redirecttoCatpage(){
   this.router.navigate(['/products', this.Product.NsousCategorie]);
}

}
