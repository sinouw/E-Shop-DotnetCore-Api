using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models.ZahraShop
{
    public class SearchFilter
    {
        public string NomProduit { get; set; } 
        public string SousCategorie { get; set; }
        public string Categorie { get; set; }
    }
}
