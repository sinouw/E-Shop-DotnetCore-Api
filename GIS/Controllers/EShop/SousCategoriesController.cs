using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;
using WebAPI.Models.ZahraShop;

namespace WebAPI.Controllers.EShop
{
    [Authorize(Roles = "Admin,SuperAdmin")]
    [Route("api/[controller]")]
    [ApiController]
    public class SousCategoriesController : ControllerBase
    {
        private readonly EshopContext _context;

        public SousCategoriesController(EshopContext context)
        {
            _context = context;
        }

        // GET: api/SousCategories
        [HttpGet]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<SousCategorie>>> GetSousCategories()
        {
            return await _context.SousCategories.Include( sc => sc.Categorie ).ToListAsync();
        }

        // GET: api/SousCategories/5
        [HttpGet("{id}")]
        [EnableQuery]
        public async Task<ActionResult<SousCategorie>> GetSousCategorie(Guid id)
        {
            var sousCategorie = await _context.SousCategories.Include(sc => sc.Categorie).SingleOrDefaultAsync(sc => sc.IdScat == id);

            if (sousCategorie == null)
            {
                return NotFound();
            }

            return sousCategorie;
        }

        // PUT: api/SousCategories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSousCategorie(Guid id, SousCategorie sousCategorie)
        {
            if (id != sousCategorie.IdScat)
            {
                return BadRequest();
            }

            _context.Entry(sousCategorie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SousCategorieExists(id))
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

        // POST: api/SousCategories
        [HttpPost]
        public async Task<ActionResult<SousCategorie>> PostSousCategorie(SousCategorie sousCategorie)
        {
            _context.SousCategories.Add(sousCategorie);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSousCategorie", new { id = sousCategorie.IdScat }, sousCategorie);
        }

        // DELETE: api/SousCategories/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<SousCategorie>> DeleteSousCategorie(Guid id)
        {
            var sousCategorie = await _context.SousCategories.FindAsync(id);
            if (sousCategorie == null)
            {
                return NotFound();
            }

            _context.SousCategories.Remove(sousCategorie);
            await _context.SaveChangesAsync();

            return sousCategorie;
        }

        private bool SousCategorieExists(Guid id)
        {
            return _context.SousCategories.Any(e => e.IdScat == id);
        }
    }
}
