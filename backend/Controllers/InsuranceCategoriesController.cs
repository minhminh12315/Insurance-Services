using InsuranceService.API.Models;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InsuranceService.API.DTOs.Category;
using InsuranceService.API.DTOs;

namespace InsuranceService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InsuranceCategoriesController : ControllerBase
    {
        private readonly InsuranceCategoryService _service;

        public InsuranceCategoriesController(InsuranceCategoryService service)
        {
            _service = service;
        }

        // GET: api/InsuranceCategories

        // GET: api/InsuranceCategories
        [HttpGet]
        public async Task<ActionResult<PagedResult<InsuranceCategoryResponseDto>>> GetInsuranceCategories([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
        {
            return Ok(await _service.GetAllCategoriesAsync(page, pageSize, search));
        }

        // GET: api/InsuranceCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InsuranceCategoryResponseDto>> GetInsuranceCategory(int id)
        {
            var category = await _service.GetByIdAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        // PUT: api/InsuranceCategories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInsuranceCategory(int id, InsuranceCategoryRequestDto insuranceCategory)
        {
            var result = await _service.UpdateAsync(id, insuranceCategory);

            if (result == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/InsuranceCategories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<InsuranceCategoryRequestDto>> PostInsuranceCategory(InsuranceCategoryRequestDto insuranceCategory)
        {
            var result = await _service.CreateCategoryAsync(insuranceCategory);
            return CreatedAtAction(
                nameof(GetInsuranceCategories),
                new { id = result.CategoryId },
                result
                );
        }

        // DELETE: api/InsuranceCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInsuranceCategory(int id)
        {
            var success = await _service.DeleteAsync(id);

            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
