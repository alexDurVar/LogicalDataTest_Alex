namespace WebApplicationTest.Models
{
    public class Articles
    {
        // Atributos
       // public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal IVA { get; set; }
        public decimal TotalPrice { get; set; }

        // Constructor vacío requerido por Dapper
        public Articles() { }

        // Constructor con la firma correcta
        public Articles(/*int id,*/ string code, string name, decimal price, decimal iVA, decimal totalPrice)
        {
            //this.Id = id;
            this.Code = code;
            this.Name = name;
            this.Price = price;
            IVA = iVA;
            this.TotalPrice = totalPrice;
        }
    }
}
