﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/Admin")]
    [ApiController]
    public class AdminsController : ControllerBase
    {
        private UserManager<User> _userManager;
        private SignInManager<User> _singInManager;
        private readonly ApplicationSettings _appSettings;

        public AdminsController(UserManager<User> userManager, SignInManager<User> signInManager,IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            _singInManager = signInManager;
            _appSettings = appSettings.Value;
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("GetAdmins")]
        [EnableQuery]
        //Get : /api/Admin
        public async Task<ActionResult<User>> getAdmin()
        {
            var users = await _userManager.Users.ToListAsync();
            return Ok(users);
        }

        //[Authorize(Roles = "SuperAdmin")]
        [HttpPost]
        [Route("Register")]
        //POST : /api/Admin/Register
        public async Task<Object> Register(RegisterUserModel model)
        {
            
            var applicationUser = new User()
            {
                UserName = model.UserName,
                Email = model.Email,
                FullName = model.FullName,
                PhoneNumber = model.PhoneNumber,
                Gender = model.Gender,
                Role = model.Role,
                IsActive = true
            };

            try
            {
                var result = await _userManager.CreateAsync(applicationUser, model.Password);
                await _userManager.AddToRoleAsync(applicationUser, model.Role);
                return Ok(result);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        //Put : /api/Admins/Togglestatus
        [Authorize(Roles = "SuperAdmin")]
        [HttpPut("Togglestatus/{username}")]
        public async Task<IActionResult> StatusUser(string username)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(c => c.UserName == username);
            if (user == null)
            {
                return BadRequest();
            }

            try
            {
                user.IsActive = !user.IsActive;
                await _userManager.UpdateAsync(user);
                return Ok(user);

            }
            catch
            {
                return NoContent();
            }
        }

        //Get : /api/Admin/id
        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("GetRole/{id}")]
        public async Task<IActionResult> getAdmin(string id)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(c => c.Id == id);
            if (user == null)
            {
                return BadRequest();
            }
                return Ok(user);
        }

        //Put : /api/Admin/ToggleRole
        [Authorize(Roles = "SuperAdmin")]
        [HttpPut("ToggleRole/{username}")]
        public async Task<IActionResult> PutRole(string username)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(c => c.UserName == username);
            if (user == null)
            {
                return BadRequest();
            }
            try
            {
                List<string> roles = new List<string>();
                roles.Add("Admin");
                roles.Add("SuperAdmin");

                var role = await _userManager.GetRolesAsync(user);
                foreach(string i in role.ToList())
                    {
                    if (i == "Admin")
                    {
                        await _userManager.RemoveFromRoleAsync(user, "Admin");
                        await _userManager.AddToRoleAsync(user, "SuperAdmin");
                        user.Role = "SuperAdmin";
                        await _userManager.UpdateAsync(user);
                    }
                    if (i == "SuperAdmin"){
                        await _userManager.RemoveFromRoleAsync(user, "SuperAdmin");
                        await _userManager.AddToRoleAsync(user, "Admin");
                        user.Role = "Admin";
                        await _userManager.UpdateAsync(user);
                    }
                }
                var adminrole = await _userManager.GetRolesAsync(user);
                return Ok(adminrole);
            }
            catch
            {
                return NoContent();
            }
        }

        //Put : /api/Admin/ToggleRole
        [Authorize(Roles = "SuperAdmin")]
        [HttpPut("ChangeToSuper/{username}")]
        public async Task<IActionResult> ChangeToSuper(string username)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(c => c.UserName == username);
            if (user == null)
            {
                return BadRequest();
            }
            try
            {
                List<string> roles = new List<string>();
                roles.Add("Admin");
                roles.Add("SuperAdmin");

                var role = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, roles);
                await _userManager.AddToRoleAsync(user, "SuperAdmin");
                user.Role = "SuperAdmin";
                await _userManager.UpdateAsync(user);
             
                var adminrole = await _userManager.GetRolesAsync(user);
                return Ok(adminrole);
            }
            catch
            {
                return NoContent();
            }
        }



        //Put : /api/Admin/Edit
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPut("Edit/{id}")]
        public async Task<IActionResult> Edit(string id, User admin)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(c => c.Id == id);
            if (user == null)
            {
                return NotFound();
            }

            try
            {
                user.UserName = admin.UserName;
                user.Email = admin.Email;
                user.FullName = admin.FullName;
                user.PhoneNumber = admin.PhoneNumber;
                user.IsActive = admin.IsActive;
                user.Gender = admin.Gender;
                await _userManager.UpdateAsync(user);
                return Ok(user);

            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }

        //Delete : /api/Admin/Delete/username
        [HttpDelete("delete/{username}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Delete(string username)
        {

            var user = await _userManager.Users.SingleOrDefaultAsync(c => c.UserName == username);
            if (user == null)
            {
                return NotFound();
            }
            try
            {
                await _userManager.DeleteAsync(user);
                return NoContent();
            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }
    }
}