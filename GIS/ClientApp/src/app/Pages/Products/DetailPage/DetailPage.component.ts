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
   'data': any = [
      {
          'image': 'https://via.placeholder.com/625x800',
          'image_gallery': [
              'https://via.placeholder.com/625x800',
          ]
      }
  ];
   Product              :any
   id                : any;
   type              : any;
   apiResponse       : any;
   singleProductData : any;
   productsList      : any;
   mainImgPath: any;
   Images: any = [];
   ImagesPath: any= [];

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
         this.mainImgPath=res.FrontImg
         this.Images=res.Images


         this.Images.forEach(e => {
            this.ImagesPath.push(e.ImageName)
        });

        this.data[0].image_gallery=this.ImagesPath

         console.log(this.Product);
      },
      err=>{
         console.log(err);
         
      })
   }
redirecttoCatpage(){
   this.router.navigate(['/products', this.Product.NsousCategorie]);
}

  /**
     * getImagePath is used to change the image path on click event.
     */
    public getImagePath(imgPath: string, index: number) {
      // console.log(imgPath,index);
      document.querySelector('.border-active').classList.remove('border-active');
      this.mainImgPath = imgPath;
      document.getElementById(index + '_img').className += ' border-active';
  }

}
