using Core.Entities.OrderAggregrate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data.Config
{
    public class DeliveryMethodConfiguration : IEntityTypeConfiguration<DeliveryMethod>
    {
        public void Configure(EntityTypeBuilder<DeliveryMethod> builder)
        {
            builder.Property(d => d.Price).HasColumnType("decimal(18,2)");
            builder.Property(d => d.ShortName).HasMaxLength(10).IsRequired();
            builder.Property(d => d.DeliveryTime).HasMaxLength(50).IsRequired();
            builder.Property(d => d.Description).HasMaxLength(180).IsRequired();
        }
    }
}
