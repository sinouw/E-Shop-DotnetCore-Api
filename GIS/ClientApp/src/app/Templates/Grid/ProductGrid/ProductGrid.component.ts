import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AdminGenericService} from 'src/app/AdminPanel/Service/AdminGeneric.service';
import {BaseUrl} from '../../../models/baseurl.data';
import {Router} from '@angular/router';

@Component({
    selector: 'embryo-ProductGrid',
    templateUrl: './ProductGrid.component.html',
    styleUrls: ['./ProductGrid.component.scss']
})
export class ProductGridComponent implements OnInit {

    productsGrid: any[] = [];
    @Input() products: any;

    @Input() currency: string;

    @Input() gridLength: any;

    @Input() gridThree: boolean = false;

    @Output() addToCart: EventEmitter<any> = new EventEmitter();

    @Output() addToWishList: EventEmitter<any> = new EventEmitter();

    loaded = false;
    lg = 25;
    xl = 25;

    trackByObjectID(index, hit) {
        return hit.objectID;
    }

    constructor(
        private genericservice: AdminGenericService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.getProducts();

        if (this.gridThree) {
            this.lg = 33;
            this.xl = 33;
        }
    }

    public addToCartProduct(value: any) {
        this.addToCart.emit(value);
    }

    public onLoad() {
        this.loaded = true;
    }

    public productAddToWishlist(value: any, parentClass) {
        console.log(value);

        if (!(document.getElementById(parentClass).classList.contains('wishlist-active'))) {
            let element = document.getElementById(parentClass).className += ' wishlist-active';
        }
        this.addToWishList.emit(value);
    }

    public checkCartAlready(singleProduct) {
        let products = JSON.parse(localStorage.getItem('cart_item')) || [];
        if (!products.some((item) => item.name == singleProduct.name)) {
            return true;
        }
    }

    list(): any {
        return this.genericservice.get(BaseUrl + '/Produits');
    }

    getProducts() {
        this.list().subscribe(res => {
                this.productsGrid = res;
                console.log(this.productsGrid);

            },
            err => {
                console.log(err);
            });
    }

    productPage(id, NScat) {
        console.log('hello work ^^ ');
        console.log(id);

        this.router.navigate(['/products', NScat, id]);


    }

}
