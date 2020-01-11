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
    Products: any[] = [];
    type: any;
    pips: boolean = true;
    tooltips: boolean = true;
    category: any;
    pageTitle: string;
    subPageTitle: string;
    public Count: number;
    public pageNumber: number = 1;

         // MatPaginator Inputs
    length = 100;
    pageSize = 4;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    dataSource : MatTableDataSource<any> = new MatTableDataSource<any>();
    pageEvent: PageEvent;
    cardsObs: Observable<any>;

    subscribers: any = {};
    productsGrid: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public embryoService: EmbryoService,
        private genericservice : AdminGenericService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit() {

        this.changeDetectorRef.detectChanges();

        this.dataSource.paginator = this.paginator;

        this.list().subscribe(res=>{
            console.log(res);
            
            this.productsGrid=res.Items
            this.pageNumber = res.pageIndex;
            // this.length = res.Count;
            this.length = res.Count;

            this.dataSource = new MatTableDataSource<any>(this.productsGrid);
            this.cardsObs = this.dataSource.connect();
            console.log(this.cardsObs)
            this.dataSource.paginator = this.paginator;
		},
		err=>{
			console.log(err);
		})


        this.route.params.subscribe(params => {
            this.route.queryParams.forEach(queryParams => {
                this.category = queryParams['category'];
                this.type = null;
                this.type = params['type'];
              
                this.getPageTitle();
            });
        });
    }

    list(){
		// return this.genericservice.get(BaseUrl+'/Produits?&page=2&pageSize=4')
		return this.genericservice.get(BaseUrl+'/Produits?&page='+this.pageNumber+'&pageSize='+this.pageSize)
	}


    onPage(pageEvent: PageEvent) {
        this.genericservice.get(BaseUrl+'/Produits?page='+ pageEvent.pageIndex+"&pageSize="+this.pageSize)
        .subscribe(res=>{
            this.productsGrid=res.Items
            this.pageNumber = res.pageIndex;
            this.length = res.Count;

            this.dataSource = new MatTableDataSource<any>(this.productsGrid);
            this.cardsObs = this.dataSource.connect();
            console.log(this.cardsObs)
        },
        err=>{
            console.log(err);
            
        })

     
        


        
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

    productPage(id, NScat) {
        console.log('hello work ^^ ');
        console.log(id);

        this.router.navigate(['/products', NScat, id]);


    }
    
}
