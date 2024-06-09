namespace WebApplicationTest.Models
{
    public class Users
    {
        //Atributos
        public int Id { get; set; }
        public string Name { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }

        //Constructor
        public Users(int id, string name, string login, string password)
        {
            this.Id = id;
            this.Name = name;
            this.Login = login;
            this.Password = password;
        }




    }
}
