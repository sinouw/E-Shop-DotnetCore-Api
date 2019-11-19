import {Component, OnInit} from '@angular/core';
import {AdminPanelServiceService} from '../../Service/AdminPanelService.service';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {BaseUrl} from '../../../models/baseurl.data';
import {AdminGenericService} from '../../Service/AdminGeneric.service';
import { join } from 'path';

@Component({
    selector: 'app-edit-product',
    templateUrl: './EditProduct.component.html',
    styleUrls: ['./EditProduct.component.scss']
})

export class EditProductComponent implements OnInit {


    'data': any = [
        {
            'image': 'https://via.placeholder.com/625x800',
            'image_gallery': [
                'https://via.placeholder.com/625x800',
            ]
        }
    ];
    idImageDis = true
    souscategories: any[] = [];
    product: any;
    idProd;
    editProductDetail: any;
    mainImgPath: string;
    productId: any;
    productType: any;
    showStatus: boolean;
    form: FormGroup;
    colorsArray: string[] = ['Red', 'Blue', 'Yellow', 'Green'];
    sizeArray: number[] = [36, 38, 40, 42, 44, 46, 48];
    quantityArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    imagenumber
    Images:any=[]
    ImagesPath:any=[]
    productImages: any = [];
    frontImg: string;
    Imagefront: any;
    DefaultFrontImgId: any;

    constructor(private adminPanelService: AdminPanelServiceService,
                public formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private genericservice: AdminGenericService
    ) {
    }

    ngOnInit() {
        this.getSousCategories();
        this.form = this.formBuilder.group({
            NomProduit: [],
            Prix: [],
            Disponible: [],
            Description: [],
            Remise: [],
            IdScat: [],
            Couleur: [],
            Marque: [],
            IdProd: []
        });

        this.idProd = this.route.snapshot.paramMap.get('id');
       
        this.getProduct(this.idProd)
            .subscribe(res => {
                this.product = res;
                console.log(res)
                this.Images=res.Images
                
                this.getProductData();

                this.Images.forEach(e => {
                    this.ImagesPath.push(e.ImageName)
                });
                this.imagenumber = this.ImagesPath.length
                this.mainImgPath=this.product.FrontImg
                // this.mainImgPath=this.ImagesPath[this.imagenumber - 1]
               
                
                console.info("this images path : ",this.ImagesPath);                
                this.data[0].image_gallery=this.ImagesPath

  
                
                
            });
    }


    //getProductData method is used to get the product data.
    getProductData() {
        this.form.patchValue({
            NomProduit: this.product.NomProduit,
            Prix: this.product.Prix,
            Disponible: this.product.Disponible,
            Description: this.product.Description,
            Remise: this.product.Remise,
            IdScat: this.product.IdScat,
            Couleur: this.product.Couleur,
            Marque: this.product.Marque,
            IdProd: this.idProd
        });

       
        for (let i = this.data[0].image_gallery.length ; i > this.imagenumber ; i--) {
            this.data[0].image_gallery.splice(0,1)
        }  

        this.productImages=[]
        this.productImages.forEach(e => {
            this.productImages.push(this.data[0].image_gallery)

        });

        console.table(this.productImages);



        
    }

    getProduct(id): any {
        return this.genericservice.get(BaseUrl + '/Produits/' + id);
    }

    getSousCategories() {
        this.genericservice.get(BaseUrl + `/souscategories`)
            .subscribe(res => {
                this.souscategories = res;
                console.log(res);
            }, err => {
                console.log(err);
            });
    }

    OnSubmit() {
        // console.log(this.form.value);

        this.genericservice.put(BaseUrl + '/Produits/' + this.idProd, this.form.value)
            .subscribe(res => {
                this.UploadImages(this.form.value.IdProd);
                this.editFrontImg()
                    console.log(res);
                },
                err => {
                    console.log(err);
                });
    }


    /**
     * getImagePath is used to change the image path on click event.
     */
    public getImagePath(imgPath: string, index: number) {

        if(imgPath==this.mainImgPath){
            this.idImageDis=false
        }else{
            this.idImageDis = false

        }
        //  console.log(imgPath,index);
        this.frontImg = imgPath;
        document.querySelector('.border-active').classList.remove('border-active');
        this.mainImgPath = imgPath;
        document.getElementById(index + '_img').className += ' border-active';
       
    }

    UploadImage(files) {
        this.productImages.push(files[0]);
        console.log("thisproduct image : ",this.productImages);
        var file: File = files[0];
        var reader = new FileReader();
        reader.onload = (event: any) => {
            this.mainImgPath = event.target.result;
            this.data[0].image_gallery.splice(0, 0, this.mainImgPath);
        };
        reader.readAsDataURL(file);

    }


    UploadImages(id) {
        this.genericservice.postProductImages(this.productImages, id)
            .then(res => {
                console.log(res);
            },
            err=>console.log(err)
            );
    }


    editFrontImg(){
        let body
        this.DefaultFrontImgId = this.product.Images.find(x=>x.ImageName==this.mainImgPath)
         this.Imagefront= this.product.Images.find(x=>x.ImageName==this.frontImg)
        
         if(this.Imagefront){
            // this.Imagefront=this.Imagefront.IdImage
             body = {
                GenericGuid:this.Imagefront.IdImage,
                GenericString:"hello"
            }

            console.log("image front",this.Imagefront);
            
        }

        else{
            body = {
                GenericGuid:this.DefaultFrontImgId.IdImage,
                GenericString:"hello"
            }
            console.log("image frontc",this.Imagefront);
        }
            


        // this.genericservice.post(BaseUrl+"/images/produit/FrontImg/"+this.idProd,body)
        this.genericservice.put(BaseUrl+"/images/produit/FrontImg/"+this.idProd,body)
        .subscribe(res=>{
           console.log(res);
           this.idImageDis = true    
       },
       err=>{
       console.log(err);

       })





        console.log(this.Imagefront);
        
        
        

    }


}
