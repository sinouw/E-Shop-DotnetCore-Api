import {Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {EmbryoService} from '../../../Services/Embryo.service';
import { AdminGenericService } from 'src/app/AdminPanel/Service/AdminGeneric.service';
import { BaseUrl } from 'src/app/models/baseurl.data';
import { PageEvent, MatPaginator , MatTableDataSource } from '@angular/material';

@Component({
    selector: 'app-ProductsList',
    templateUrl: './ProductsList.component.html',
    styleUrls: ['./ProductsList.component.scss']
})
export class ProductsListComponent implements OnInit {

    @ViewChild(MatPaginator,{static: false}) paginator : MatPaginator;
    
    panelOpenState = false;
    Products: any[] = [];
    type: any="";
    pips: boolean = true;
    tooltips: boolean = true;
    category: any;
    pageTitle: string;
    subPageTitle: string;
    public Count: number;
    public pageNumber: number=0;
    brandsOfProducts : any =[];
         // MatPaginator Inputs
    length = 100;
    pageSize = 4;
    filters:any="";
    pageSizeOptions: number[] = [5, 10, 25, 100];
    dataSource : MatTableDataSource<any> = new MatTableDataSource<any>();
    pageEvent: PageEvent;
    cardsObs: Observable<any>;
    categoriesdtopsimple: any=[];


    subscribers: any = {};
    productsGrid: any;
    selectedBrands: any;




    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public embryoService: EmbryoService,
        private genericservice : AdminGenericService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        
        console.clear()
        this.route.params.subscribe((res:any) => {
            this.type = res.type;
             this.getData()
             this.getCategoriesDtosimple()
            
         })
    }

    list(souscategorie,filters){
		return this.genericservice.get(BaseUrl+'/Produits?&page='+0+'&pageSize='+this.pageSize+'&sousCategorie='+souscategorie+'&filter='+filters)
    }
    // listWithSousCat(filters=this.filters){
	// 	// return this.genericservice.get(BaseUrl+'/Produits/WithSousCategorie?&page='+this.pageNumber+"&sousCategorie="+this.type+'&pageSize='+this.pageSize)	
	// 	return this.genericservice.get(BaseUrl+'/Produits/WithSousCategorie?&page=0&sousCategorie='+this.type+'&pageSize='+this.pageSize+'&filter='+filters)	
    // }

    getCategoriesDtosimple() {
        this.genericservice.get(BaseUrl + '/Categories/CategSousCategdto')
            .subscribe(res => {
                console.log(res);
                this.categoriesdtopsimple = res;
            }, err => {
                console.log(err);

            });
    }


    onselectCategorie(categories,souscategorie){
        console.clear()
        console.log(categories,souscategorie);
        
    }

    onselectBrand(event){
    //   this.list()
        console.log(this.selectedBrands);

        
        
    }

    onPage(pageEvent: PageEvent) {
        
        this.genericservice.get(BaseUrl+'/Produits/WithSousCategorie?page='+ pageEvent.pageIndex+"&sousCategorie="+this.type+"&pageSize="+pageEvent.pageSize)
        .subscribe(res=>{
            this.productsGrid=res.Items
            this.pageNumber = res.pageIndex;
            // this.length = res.Count;

            this.dataSource = new MatTableDataSource<any>(this.productsGrid);
            this.cardsObs = this.dataSource.connect();
        },
        err=>{
            console.log(err);   
        })    
    }
    

    getData(){
        // if(this.type===undefined){
            this.list( this.type,this.filters).subscribe(res=>{
                console.log(res);
                
                this.productsGrid=res.Items
                this.pageNumber = res.pageIndex;
                this.brandsOfProducts=res.Brands;
                this.dataSource = new MatTableDataSource<any>(this.productsGrid);
                this.cardsObs = this.dataSource.connect();
                console.log(this.cardsObs)
                this.dataSource.paginator = this.paginator;
            },
            err=>{
                console.log(err);
            })
        //  }
        //  else{
        //      this.listWithSousCat().subscribe(res=>{
        //          console.log(res);
                 
        //          this.productsGrid=res.Items
        //          this.pageNumber = res.pageIndex;
        //          this.length = res.Count;
        //          this.brandsOfProducts=res.Brands;
     
        //          this.dataSource = new MatTableDataSource<any>(this.productsGrid);
        //          this.cardsObs = this.dataSource.connect();
        //          console.log(this.cardsObs)
        //          this.dataSource.paginator = this.paginator;
        //         },
        //      err=>{
        //          console.log(err);
        //      })
        //  } 
    }
    
    formatLabel(value: number) {
        if (value >= 1000) {
          return Math.round(value / 1000) + 'k';
        }
        return value;
      }


    productPage(id, NScat) {
        console.log('hello work ^^ ');
        console.log(id);

        this.router.navigate(['/products', NScat, id]);
    }

    public getPageTitle() {
        this.pageTitle = null;
        this.subPageTitle = null;

        switch (this.type || this.category) {
            // case undefined:
            //    this.pageTitle = "Fashion";
            //    this.subPageTitle="Explore your favourite fashion style.";
            //    break;
            case undefined:
                this.pageTitle = 'Products';
                this.subPageTitle = 'Choose the wide range of best products.';
                break;

            case 'gadgets':
                this.pageTitle = 'Gadgets';
                this.subPageTitle = 'Check out our new gadgets.';
                break;

            case 'accessories':
                this.pageTitle = 'Accessories';
                this.subPageTitle = 'Choose the wide range of best accessories.';
                break;

            default:
                this.pageTitle = 'Products';
                this.subPageTitle = null;
                break;
        }
    }

    public addToCart(value) {
        this.embryoService.addToCart(value);
    }

    public addToWishList(value) {
        this.embryoService.addToWishlist(value);
    }

    public transformHits(hits) {
        hits.forEach(hit => {
            hit.stars = [];
            for (let i = 1; i <= 5; i) {
                hit.stars.push(i <= hit.rating);
                i += 1;
            }
        });
        return hits;
    }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  applyFilter(filterValue: string,event) {
    let value =filterValue.trim().toLowerCase()

         this.dataSource.filter = value;
         if (this.dataSource.paginator) {
             this.dataSource.paginator.firstPage();
         }
    }

   
}
