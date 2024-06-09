// En tu controlador UsersController.cs

using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using WebApplicationTest.Models;
using System.Data;

namespace WebApplicationTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public UsersController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        //GET para extraer todos los datos de la tabla de Users, usando ADO.Net
        [HttpGet]
        public JsonResult Get()
        {
            string query = @" SELECT id_, name_, login_, password_ FROM [dbo].[Users]";
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

        [HttpPost("login")]
        public IActionResult Login(Users userLogin)
        {
            // Verificar las credenciales en la base de datos
            string query = @"SELECT id_ FROM dbo.Users WHERE login_ = @Login AND password_ = @Password";
            string connectionString = _configuration.GetConnectionString("LogicalDataTest");
            using (SqlConnection connection = new SqlConnection(connectionString))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Login", userLogin.Login);
                command.Parameters.AddWithValue("@Password", userLogin.Password);
                connection.Open();
                var result = command.ExecuteScalar();
                if (result != null)
                {
                    // Si las credenciales son válidas, generar un token de sesión y devolverlo
                    var token = Guid.NewGuid().ToString();
                    return Ok(new { token });
                }
            }

            // Si las credenciales no son válidas, devolver un error
            return Unauthorized();
        }
    }
}
