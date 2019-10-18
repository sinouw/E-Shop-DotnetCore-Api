using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;
using WebAPI.Models.ZahraShop;

namespace WebAPI.Controllers.Eshop
{
  
    [Route("api/images")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly EshopContext _context;
        public ImagesController(EshopContext context)
        {
            _context = context ?? throw new Exception();
        }

        [HttpGet]
        //Get : api/images
        public async Task<ICollection<Image>> Get()
        {
            return await _context.Images.ToListAsync();
        }


        //Post : api/images/produit/id
        [HttpPost("produit/{id}")]
        public async Task<IActionResult> Upload(Guid id)
        {
            try
            {
                var file = Request.Form.Files[0];
                string path = "Uploads/" + id;
                string fullPath = "";
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                if (file.Length > 0)
                {
                    fullPath = Path.Combine(path, file.FileName);
                    var stream = new FileStream(fullPath, FileMode.Create);
                    await file.CopyToAsync(stream);
                }
                _context.Images.Add(new Image() { ImageName = "Uploads/" + id + "/" + file.FileName, ProduitId = id });
                await _context.SaveChangesAsync();

                return Ok(_context);
            }
            catch (Exception e)
            {
                return Ok("fails execption" + e);
            }
        }


    }
}