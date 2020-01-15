import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, NgForm, FormControl} from '@angular/forms';
import {AdminGenericService} from '../../Service/AdminGeneric.service';
import {Caracteristique} from '../../../models/Caracteristique.model';
import {BaseUrl} from '../../../models/baseurl.data';
import {HttpEventType} from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';

@Component({
    selector: 'app-add-product',
    templateUrl: './AddProduct.component.html',
    styleUrls: ['./AddProduct.component.scss']
})

export class AddProductComponent implements OnInit {


    addProductBtnDisa = true
    form: FormGroup;
    mainImgPath: string;
    colorsArray: string[] = ['Red', 'Blue', 'Yellow', 'Green'];
    sizeArray: number[] = [36, 38, 40, 42, 44, 46, 48];
    quantityArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    public imagePath;
    souscategories: any[] = [];
    productImages: any [] = [];
    base64Image: any;
    productsGrid    : any;
    productsList 	: any;
    showType				: string = 'list';
    caracteristiques : Caracteristique[]=[];
    carac :any= {key:'',value:''}
    caracteristiquesList
    displayedProductColumns : string [] = ['key','value','action' ];

  
caracForm :FormGroup ;

    myDataArray:any=[]

    formModel = {
        UserName: '',
        Password: ''
      }
    
    'data': any = [
        {
            'image': 'https://via.placeholder.com/625x800',
            'image_gallery': [
                'https://via.placeholder.com/625x800',
            ]
        }
    ];

    constructor(public formBuilder: FormBuilder,
                private genericservice: AdminGenericService) {
    }

    ngOnInit() {


        this.caracForm = new FormGroup({
            key: new FormControl(),
            value: new FormControl()
       }); 


        // this.caracteristiques.push(this.carac)

        this.getSousCategories();
        this.mainImgPath = this.data[0].image;
        this.form = this.formBuilder.group({
            NomProduit: ['', [Validators.required]],
            Prix: ['', [Validators.required]],
            Disponible: ['', [Validators.required]],
            Description: ['', [Validators.required]],
            Remise: [50, [Validators.required]],
            IdScat: ['', [Validators.required]],
            Couleur: ['', [Validators.required]],
            Marque: ['', [Validators.required]],
        });
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

    onSubmit() {
        this.AddProduct();

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

    AddProduct() {

      
        this.genericservice.post(BaseUrl + '/Produits', this.form.value)
            .subscribe(res => {
                    console.log(res);
                    this.UploadImages(res.IdProd);
                    
                    this.Discard();
                },
                err => {
                    console.log(err);
                });
    }

    Discard() {
        this.form = this.formBuilder.group({
            NomProduit: [],
            Prix: [],
            Disponible: [],
            Description: [],
            Remise: 0,
            IdScat: [],
            Couleur: [],
            Marque: [],
        });
        this.productImages=[]
        console.log(this.productImages[0])
        this.mainImgPath = this.data[0].image;
        this.data[0].image_gallery = []
        this.data[0].image_gallery.splice(0, 0, this.mainImgPath);

        this.addProductBtnDisa = true
 
    }

    UploadImages(id) {
        this.genericservice.postProductImages(this.productImages, id)
            .then(res => {
                console.log(res);
                this.UpdateFrontImg(id)
            },
            err=>console.log(err)
            );
    }

    UploadImage(files) {
        this.productImages.push(files[0]);
        console.log(this.productImages);
        var file: File = files[0];
        var reader = new FileReader();
        reader.onload = (event: any) => {
            this.mainImgPath = event.target.result;
            this.data[0].image_gallery.splice(0, 0, this.mainImgPath);
        };
        reader.readAsDataURL(file);

        this.addProductBtnDisa = false

    }


    UpdateFrontImg(id){
        
        this.genericservice.put(BaseUrl,'/images/produit/updateFrontImg/'+ id)
        .subscribe(res => {
            console.log(res);
        },
        err=>console.log(err)
        );
    }


    addRow(index) {    
        this.carac = {key: "", value: ""};  
        this.caracteristiques.push(this.carac);  
        console.log(this.caracteristiques);  
        return true;  
    } 

    deleteRow(index) {  
        if(this.caracteristiques.length ==0) {  
          console.log("Can't delete the row when there is only one row", 'Warning');  
            return false;  
        } else {  
            this.caracteristiques.splice(index, 1);  
            this.caracteristiquesList = new MatTableDataSource(this.caracteristiques);
            console.log('Row deleted successfully', 'Delete row');  
            return true;  
        }  
    } 


    validate(){


        console.log(this.caracForm.value);
        this.caracteristiques.push(this.caracForm.value)
        this.caracteristiquesList = new MatTableDataSource(this.caracteristiques);
        console.log(this.caracteristiques);
        
    }
    
    TestTable(){
        console.log(this.caracteristiques);

    }

  
}
