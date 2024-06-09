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
    public class InvoiceController : ControllerBase
    {
        // Inyecciones de dependencias
        private readonly IConfiguration _configuration;
        public InvoiceController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        //GET para extraer todos los datos de la tabla de Invoice, usando ADO.Net
        [HttpGet]
        public JsonResult Get()
        {
            string query = @"SELECT id_, customer_name_ FROM [dbo].[Invoices]";
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
        public async Task<ActionResult<int>> Post(Invoice invoice)
        {
            try
            {
                var sql = @"INSERT INTO [dbo].[Invoices] ( customer_name_) VALUES (@NameCustomer);
                    SELECT SCOPE_IDENTITY();"; // Obtener el ID de la factura insertada
                using (var connection = new SqlConnection(_configuration.GetConnectionString("LogicalDataTest")))
                {
                    var id = await connection.ExecuteScalarAsync<int>(sql, new {  NameCustomer = invoice.NameCustomer });
                    return id;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al insertar la factura: {ex.Message}");
            }
        }

        // PUT para actualizar registros
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Invoice invoice)
        {
            try
            {
                var sql = @"UPDATE [dbo].[Invoices] SET  customer_name_ = @NameCustomer WHERE id_ = @Id;";
                using (var connection = new SqlConnection(_configuration.GetConnectionString("LogicalDataTest")))
                {
                    await connection.ExecuteAsync(sql, new { Id = id, NameCustomer = invoice.NameCustomer });
                }
                return Ok("Invoice updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al actualizar la factura: {ex.Message}");
            }
        }

        // DELETE para eliminar registros
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deleteDetailsQuery = @"DELETE FROM [dbo].[InvoiceDetails] WHERE invoice_id_ = @Id;";
                var deleteInvoiceQuery = @"DELETE FROM [dbo].[Invoices] WHERE id_ = @Id;";

                using (var connection = new SqlConnection(_configuration.GetConnectionString("LogicalDataTest")))
                {
                    await connection.ExecuteAsync(deleteDetailsQuery, new { Id = id }); // Eliminar detalles de factura
                    await connection.ExecuteAsync(deleteInvoiceQuery, new { Id = id }); // Eliminar factura
                }
                return Ok("Invoice and associated details deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al eliminar la factura: {ex.Message}");
            }
        }

       
        //Consulta la factura con sus detalles de factura
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetInvoiceWithDetails(int id)
        {
            try
            {
                var sql = @"SELECT i.id_ AS invoice_id, i.invoice_date_, i.customer_name_, 
                        d.id_ AS detail_id, a.code_ AS article_code, a.name_ AS article_name, 
                        d.quantity_, d.price_, d.IVA_, d.total_price_
                    FROM dbo.Invoices i
                    JOIN dbo.InvoiceDetails d ON i.id_ = d.invoice_id_
                    JOIN dbo.Articles a ON d.article_id_ = a.id_
                    WHERE i.id_ = @InvoiceId;";

                using (var connection = new SqlConnection(_configuration.GetConnectionString("LogicalDataTest")))
                {
                    var result = await connection.QueryAsync<dynamic>(sql, new { InvoiceId = id });
                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener la factura: {ex.Message}");
            }
        }



    }
}
