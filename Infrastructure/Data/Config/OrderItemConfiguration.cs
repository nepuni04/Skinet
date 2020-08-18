using Core.Entities.OrderAggregrate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.Property(o => o.Price).HasColumnType("decimal(18,2)");

            builder.OwnsOne(o => o.ItemOrdered, io => {
                io.WithOwner();
                io.Property(p => p.ProductName).HasMaxLength(100).IsRequired();
                io.Property(p => p.PictureUrl).IsRequired();
            });
        }
    }
}
