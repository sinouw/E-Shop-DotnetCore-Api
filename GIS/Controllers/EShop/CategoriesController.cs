using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GIS.Models.GisShop;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;
using WebAPI.Models.ZahraShop;

namespace WebAPI.Controllers.EShop
{

    //[Authorize(Roles = "Admin,SuperAdmin")]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly EshopContext _context;

        public CategoriesController(EshopContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Categorie>>> GetCategories()
        {
            return await _context.Categories.Include( c => c.SousCategories ).ThenInclude( sc => sc.Produits).ThenInclude(p => p.Images)
                .ToListAsync();

        }

        [Route("list")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SimpleCategorie>>> ListCategories()
        {
            var ls=  await _context.Categories.Include(c => c.SousCategories).ThenInclude(sc => sc.Produits).ThenInclude(p => p.Images)
                .ToListAsync();
            var catList = new List<SimpleCategorie>();
            ls.ForEach(c => catList.Add(new SimpleCategorie(c.Ncategorie, c.SousCategories.Select(s => s.NsousCategorie).ToList())));
            return catList;

        }
        // GET: api/Categories/5
        [HttpGet("{id}")]
        [EnableQuery]
        public async Task<ActionResult<Categorie>> GetCategorie(Guid id)
        {
            var categorie = await _context.Categories.Include(c => c.SousCategories).ThenInclude(sc => sc.Produits).ThenInclude(p => p.Images).SingleOrDefaultAsync( c => c.IdCat == id);

            if (categorie == null)
            {
                return NotFound();
            }

            return categorie;
        }

        // PUT: api/Categories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategorie(Guid id, Categorie categorie)
        {
            if (id != categorie.IdCat)
            {
                return BadRequest();
            }

            _context.Entry(categorie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategorieExists(id))
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

        // POST: api/Categories
        [HttpPost]
        public async Task<ActionResult<Categorie>> PostCategorie(Categorie categorie)
        {
            _context.Categories.Add(categorie);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategorie", new { id = categorie.IdCat }, categorie);
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Categorie>> DeleteCategorie(Guid id)
        {
            var categorie = await _context.Categories.FindAsync(id);
            if (categorie == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(categorie);
            await _context.SaveChangesAsync();

            return categorie;
        }

        private bool CategorieExists(Guid id)
        {
            return _context.Categories.Any(e => e.IdCat == id);
        }
    }
}
