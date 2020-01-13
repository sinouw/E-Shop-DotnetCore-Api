﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using GIS.Models.Query;
using GIS.Models.Query.dto;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Formatter.Serialization;
using Microsoft.AspNet.OData.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WebAPI.Models;
using WebAPI.Models.ZahraShop;

namespace WebAPI.Controllers.EShop
{


    //[Authorize(Roles = "Admin,SuperAdmin")]
    [Route("api/Produits")]
    [ApiController]
    public class ProduitsController : ControllerBase
    {
        private readonly EshopContext _context;
    

        public ProduitsController(EshopContext context)
        {
            _context = context;
        }

        // GET: api/Produits
        [HttpGet]
        [EnableQuery]
        public ActionResult<IQueryable<Produit>> GetProduits(int? page, int pagesize = 10)
        {
            List<string> brands = new List<string>();

            var prods = _context.Produits.Select(s => new
            {
                s.IdProd,
                s.NomProduit,
                s.Description,
                s.Prix,
                s.Disponible,
                s.Remise,
                s.Couleur,
                s.Marque,
                s.CreationDate,
                s.IdScat,
                NsousCategorie = s.SousCategorie.NsousCategorie,
                s.FrontImg,
                s.Images,
                s.Caracteristiques
            });
            //}).AsQueryable();

            var prods2 = _context.Produits.ToList();

            foreach (var item in prods2)
            {
                brands.Add(item.Marque);
            }


            var countDetails = prods2.Count();

            var result = new GIS.Models.Query.PageResult<Produit>
            {
                Count = countDetails,
                PageIndex = page ?? 0,
                PageSize = pagesize,
                Items = prods2.Skip((page ?? 0) * pagesize).Take(pagesize).ToList(),
                Brands = brands.ToList()
            };


            //return Ok(prods);
            return Ok(result);
        }

        // GET: api/Produits/WithSousCategorie
        [HttpGet("WithSousCategorie")]
        [EnableQuery]
        public async Task<ActionResult<IQueryable<Produit>>> GetProduitsWithSousCategorie(int? page, string sousCategorie, int pagesize = 10)
        {
            List<string> brands = new List<string>();
            var prods = await _context.Produits.Include(x=>x.SousCategorie).Where(x=>x.SousCategorie.NsousCategorie.ToLower()==sousCategorie).ToListAsync();

            foreach (var item in prods)
            {
                brands.Add(item.Marque);
            }

            var countDetails = prods.Count();

            var result = new GIS.Models.Query.PageResult<Produit>
            {
                Count = countDetails,
                PageIndex = page ?? 0,
                PageSize = pagesize,
                Items = prods.Skip((page ?? 0) * pagesize).Take(pagesize).ToList(),
                Brands = brands.ToList()
            };
            return Ok(result);
        }

        // GET: api/Produits/5
        [HttpGet("{id}")]
        [EnableQuery]
        public async Task<ActionResult<Produit>> GetProduit(Guid id)
        {
            //var produit = await _context.Produits.Include(p => p.Caracteristiques).Include(p=>p.Images).SingleOrDefaultAsync(p=>p.IdProd==id);
            var produit = await _context.Produits.Select(s => new {
                s.IdProd,
                s.NomProduit,
                s.Description,
                s.Prix,
                s.Disponible,
                s.Remise,
                s.Couleur,
                s.Marque,
                s.CreationDate,
                s.IdScat,
                NsousCategorie = s.SousCategorie.NsousCategorie,
                s.Images,
                //FrontImg=s.Images.First<Image>().ImageName,
                FrontImg = s.FrontImg,
                s.Caracteristiques
            }).SingleOrDefaultAsync(p=>p.IdProd==id);

            if (produit == null)
            {
                return NotFound();
            }

            return Ok(produit);
        }

        // PUT: api/Produits/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduit(Guid id, Produit produit)
        {
            if(id != produit.IdProd)
            {
                return BadRequest();
            }


            
            _context.Entry(produit).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProduitExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Produits
        [HttpPost]
        public async Task<ActionResult<Produit>> PostProduit(Produit produit)
        {
            
            _context.Produits.Add(produit);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduit", new { id = produit.IdProd }, produit);
        }

        // DELETE: api/Produits/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Produit>> DeleteProduit(Guid id)
        {
            var produit = await _context.Produits.FindAsync(id);
            if (produit == null)
            {
                return NotFound();
            }

            _context.Produits.Remove(produit);
            string path = "wwwroot/uploads/" + id;
            Directory.Delete(path, true);


            await _context.SaveChangesAsync();

            return produit;
        }

        private bool ProduitExists(Guid id)
        {
            return _context.Produits.Any(e => e.IdProd == id);
        }

        

    }
}
