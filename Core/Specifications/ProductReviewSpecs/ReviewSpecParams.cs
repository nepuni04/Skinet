﻿namespace Core.Specifications.ProductReviewSpecs
{
    public class ReviewSpecParams
    {
        private const int _maxPageSize = 50;
        private int _pageSize = 10;
        public int PageIndex { get; set; } = 1;
        public int PageSize { 
            get => _pageSize; 
            set => _pageSize = value > _maxPageSize ? _maxPageSize : value; 
        }
    }
}
