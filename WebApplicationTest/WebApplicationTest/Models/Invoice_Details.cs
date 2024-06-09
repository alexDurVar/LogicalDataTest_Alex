namespace WebApplicationTest.Models
{
    public class Invoice_Details
    {
        //Atributos
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public string ArticleCode { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal IVA { get; set; }
        public decimal TotalPrice { get; set; }

        //Constructor
        public Invoice_Details() { }
        public Invoice_Details(int id, int invoiceId, string articleCode, int quantity, decimal price, decimal iVA, decimal totalPrice)
        {
            Id = id;
            InvoiceId = invoiceId;
            ArticleCode = articleCode;
            Quantity = quantity;
            Price = price;
            IVA = iVA;
            TotalPrice = totalPrice;
        }

    }
}
