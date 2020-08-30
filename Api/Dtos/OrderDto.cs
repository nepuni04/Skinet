using System.ComponentModel.DataAnnotations;

namespace Api.Dtos
{
  public class OrderDto
  {
    [Required]
    public string BasketId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Delivery method id cannot be 0")]
    public int DeliveryMethodId { get; set; }

    public AddressDto ShipToAddress { get; set; }
  }
}