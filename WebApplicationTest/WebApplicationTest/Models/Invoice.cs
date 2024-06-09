namespace WebApplicationTest.Models
{
    public class Invoice
    {
        //Atributos
        public int Id { get; set; }
        public string NameCustomer { get; set; }

        //Constructor
        public Invoice(int id, string nameCustomer)
        {
            this.Id = id;
            this.NameCustomer = nameCustomer;
        }
    }
}
