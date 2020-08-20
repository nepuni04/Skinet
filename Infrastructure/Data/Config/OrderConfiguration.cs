using Core.Entities.OrderAggregrate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data.Config
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.Property(o => o.Subtotal).HasColumnType("decimal(18,2)");
            builder.Property(o => o.BuyerEmail).HasMaxLength(50).IsRequired();
            builder.Property(o => o.Status)
                .HasMaxLength(20)
                .IsRequired()
                .HasConversion(
                    o => o.ToString(),
                    o => (OrderStatus)Enum.Parse(typeof(OrderStatus), o)
                );

            builder.OwnsOne(o => o.ShipToAddress, sa => {
                sa.WithOwner();
                sa.Property(p => p.FirstName).HasMaxLength(25).IsRequired();
                sa.Property(p => p.LastName).HasMaxLength(25).IsRequired();
                sa.Property(p => p.Street).HasMaxLength(50).IsRequired();
                sa.Property(p => p.City).HasMaxLength(25).IsRequired();
                sa.Property(p => p.State).HasMaxLength(25).IsRequired();
                sa.Property(p => p.Zipcode).HasMaxLength(10).IsRequired();
            });

            builder.HasMany(o => o.OrderItems).WithOne().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
