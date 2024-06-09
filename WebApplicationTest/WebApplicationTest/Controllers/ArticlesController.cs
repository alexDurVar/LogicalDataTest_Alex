using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using WebApplicationTest.Models;

namespace WebApplicationTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController : ControllerBase
    {
        // Inyecciones de dependencias
        private readonly IConfiguration _configuration;
        public ArticlesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("{code}")]
        public JsonResult Get(string code)
        {
            string query = @"SELECT  name_, total_price_, IVA_ FROM [dbo].[Articles] WHERE code_ = @Code";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("LogicalDataTest");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@Code", code);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }


        //GET para extraer todos los datos de la tabla de Articulos, usando ADO.Net
        [HttpGet]
        public JsonResult Get()
        {
            string query = @" SELECT  code_, name_, price_, IVA_, total_price_ FROM [dbo].[Articles]";
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
        //POST para insertar nuevos registros
        [HttpPost]
        public JsonResult Post(Articles article)
        {
            string query = @" Insert into [dbo].[Articles] values (@Code, @Name, @Price, @IVA)";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("LogicalDataTest");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@Code", article.Code);
                    myCommand.Parameters.AddWithValue("@Name", article.Name);
                    myCommand.Parameters.AddWithValue("@Price", article.Price);
                    myCommand.Parameters.AddWithValue("@IVA", article.IVA);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            //return new JsonResult("Article added successfully");
            return new JsonResult(table);
        }
        //PUT para actualizar registros
        [HttpPut]
        public JsonResult Put(Articles article)
        {
            string query = @"UPDATE [dbo].[Articles] SET code_ = @Code, name_ = @Name, price_ = @Price, IVA_ = @IVA WHERE code_ = @Code";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("LogicalDataTest");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@Code", article.Code);
                    myCommand.Parameters.AddWithValue("@Name", article.Name);
                    myCommand.Parameters.AddWithValue("@Price", article.Price);
                    myCommand.Parameters.AddWithValue("@IVA", article.IVA);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Artcile updated successfully");
            //return new JsonResult(table);
        }
        [HttpDelete("{Code}")]
        public IActionResult Delete(string Code)
        {
            // Consulta para verificar si el código del artículo está referenciado en InvoiceDetails
            string queryCheckInvoiceDetails = @"SELECT TOP 1 1 FROM dbo.InvoiceDetails WHERE Artcode_ = @Code";

            // Consulta para eliminar el artículo de la tabla Articles
            string queryDeleteArticle = @"DELETE FROM dbo.Articles WHERE code_ = @Code";

            using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("LogicalDataTest")))
            {
                myCon.Open();

                // Verificar si el código del artículo está en InvoiceDetails
                using (SqlCommand commandCheckInvoiceDetails = new SqlCommand(queryCheckInvoiceDetails, myCon))
                {
                    commandCheckInvoiceDetails.Parameters.AddWithValue("@Code", Code);
                    object result = commandCheckInvoiceDetails.ExecuteScalar();

                    // Si se encontraron registros en InvoiceDetails, devolver un mensaje de error
                    if (result != null)
                    {
                        return BadRequest("No se puede eliminar el artículo porque está referenciado en InvoiceDetails");
                    }
                }

                // Si no se encontraron registros en InvoiceDetails, eliminar el artículo
                using (SqlCommand commandDeleteArticle = new SqlCommand(queryDeleteArticle, myCon))
                {
                    commandDeleteArticle.Parameters.AddWithValue("@Code", Code);
                    int rowsAffected = commandDeleteArticle.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound("El artículo no fue encontrado");
                    }
                }

                myCon.Close();
            }

            return Ok("Artículo eliminado exitosamente");
        }




    }
}