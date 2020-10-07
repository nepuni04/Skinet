using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entities.OrderAggregrate
{
    public class ShipToAddress
    {
        public ShipToAddress()
        {
        }

        public ShipToAddress(
            string firstName, 
            string lastName,
            string street, 
            string city, 
            string state, 
            string zipcode)
        {
            FirstName = firstName;
            LastName = lastName;
            Street = street;
            City = city;
            State = state;
            Zipcode = zipcode;
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zipcode { get; set; }
    }
}
