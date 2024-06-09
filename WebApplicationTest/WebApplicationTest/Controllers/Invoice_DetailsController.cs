using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using WebApplicationTest.Models;
using Dapper;

namespace WebApplicationTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Invoice_DetailsController : ControllerBase
    {
        // Inyecciones de dependencias
        private readonly IConfiguration _configuration;
        public Invoice_DetailsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
       
        // GET para extraer todos los datos de la tabla de InvoiceDetails con información de artículos, usando ADO.Net
        [HttpGet]
        public JsonResult Get()
        {
            string query = @"
        SELECT 
            id.id_ AS invoice_detail_id, 
            id.invoice_id_, 
            a.id_ AS article_id, 
            a.code_ AS article_code, 
            a.name_ AS article_name, 
            a.price_ AS article_price, 
            a.IVA_ AS article_IVA, 
            id.quantity_, 
            id.total_price_
        FROM 
            dbo.InvoiceDetails id
        JOIN 
            dbo.Articles a ON id.article_id_ = a.id_;";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("LogicalDataTest");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }



        // POST para insertar nuevos registros
        [HttpPost]
        public async Task<ActionResult<int>> Post(Invoice_Details invoiceD)
        {
            try
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("LogicalDataTest")))
                {
                   

                    // Insertar los detalles de la factura
                    var insertQuery = @"INSERT INTO [dbo].[InvoiceDetails] (invoice_id_, Artcode_, quantity_, total_price_) 
                        VALUES (@InvoiceId, @ArticleId, @Quantity, @TotalPrice);
                        SELECT SCOPE_IDENTITY();"; // Obtener el ID del detalle de factura insertado

                    var id = await connection.ExecuteScalarAsync<int>(insertQuery, new
                    {
                        InvoiceId = invoiceD.InvoiceId,
                        ArticleId = invoiceD.ArticleCode,
                        Quantity = invoiceD.Quantity,
                        TotalPrice = invoiceD.TotalPrice
                    });

                    return id;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al insertar el detalle de la factura: {ex.Message}");
            }
        }


        // PUT para actualizar registros
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Invoice_Details invoiceD)
        {
            try
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("LogicalDataTest")))
                {
                    // Verificar si el registro existe
                    var existingDetail = await connection.QueryFirstOrDefaultAsync<Invoice_Details>(
                        "SELECT * FROM [dbo].[InvoiceDetails] WHERE id_ = @Id", new { Id = id });

                    if (existingDetail == null)
                    {
                        return NotFound("Invoice Detail not found");
                    }

                    // Actualizar los detalles de la factura
                    var updateQuery = @"UPDATE [dbo].[InvoiceDetails] 
                        SET invoice_id_ = @InvoiceId, 
                            Artcode_ = @ArticleId, 
                            quantity_ = @Quantity, 
                            total_price_ = @TotalPrice 
                        WHERE id_ = @Id;";
                    await connection.ExecuteAsync(updateQuery, new
                    {
                        Id = id,
                        InvoiceId = invoiceD.InvoiceId,
                        ArticleId = invoiceD.ArticleCode,
                        Quantity = invoiceD.Quantity,
                        TotalPrice = invoiceD.TotalPrice
                    });
                }
                return Ok("Invoice Detail updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al actualizar el detalle de la factura: {ex.Message}");
            }
        }


        // DELETE para eliminar registros
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var sql = @"DELETE FROM [dbo].[InvoiceDetails] WHERE id_ = @Id;";
                using (var connection = new SqlConnection(_configuration.GetConnectionString("LogicalDataTest")))
                {
                    await connection.ExecuteAsync(sql, new { Id = id });
                }
                return Ok("Invoice Detail deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al eliminar el detalle de la factura: {ex.Message}");
            }
        }

    }
}
