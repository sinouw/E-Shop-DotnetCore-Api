using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GIS.Models.GisShop
{
    public class SimpleCategorie
    {
        public string Name { get; set; }
        public List<string> SousCategories { get; set; }
        public SimpleCategorie(string name,List<String> souscat)
        {
            Name = name;
            SousCategories = souscat;
        }
    }
}
