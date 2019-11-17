import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { AdminGenericService } from '../../Service/AdminGeneric.service';
import { BaseUrl } from 'src/app/models/baseurl.data';

@Component({
	selector: 'app-reports',
	templateUrl: './Reports.component.html',
	styleUrls: ['./Reports.component.scss']
})

export class ReportsComponent implements OnInit {
  
   tableTabData        : any;
   buySellChartContent : any;
   chartData           : any;

   displayedTransactionColumns : string [] = ['transid','date','account', 'type', 'amount','debit', 'balance'];

   displayedTransferColumns : string [] = ['transid','date','account', 'type', 'amount', 'balance','status'];

   displayedExpenseColumns : string [] = ['itmNo','date', 'type','companyName','amount','status'];
	
   constructor(private service : AdminPanelServiceService,
      private genericservice : AdminGenericService) {
   }


   'data': any = [
      {
          'image': 'https://via.placeholder.com/625x800',
          'image_gallery': [
              'https://via.placeholder.com/625x800',
          ]
      }
  ];


   mainImgPath = "Uploads/PubImages/1134mb5-blue-ngpu-nc-wt-nos-p-genmon-septem-genhs-vbbkmat.jpg"
   ngOnInit() {
      
      this.getpubImages()

   }

   public getImagePath(imgPath: string, index: number) {
      //  console.log(imgPath,index);

      document.querySelector('.border-active').classList.remove('border-active');
      this.mainImgPath = imgPath;
      document.getElementById(index + '_img').className += ' border-active';
     
  }


   getpubImages(){
      this.genericservice.get(BaseUrl+'/PubImages')
      .subscribe(res=>{
         console.log(res);
         
      },
      err=>{
         console.log(err);
         
      })
   }


}
