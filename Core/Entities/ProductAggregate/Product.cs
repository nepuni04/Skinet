﻿using System.Collections.Generic;
using System.Linq;

namespace Core.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int ProductTypeId { get; set; }
        public int ProductBrandId { get; set; }

        public ProductType ProductType { get; set; }
        public ProductBrand ProductBrand { get; set; }

        private List<Photo> _photos = new List<Photo>();
        public IReadOnlyList<Photo> Photos
        {
            get => _photos.AsReadOnly();
            private set => _photos = (List<Photo>)value;
        }

        public void AddPhoto(string pictureUrl, string fileName, bool isMain = false)
        {
            var photo = new Photo
            {
                FileName = fileName,
                PictureUrl = pictureUrl
            };

            if (_photos.Count == 0) photo.IsMain = true;

            _photos.Add(photo);
        }

        public void RemovePhoto(int photoId)
        {
            var photo = _photos.Find(x => x.Id == photoId);
            _photos.Remove(photo);
        }

        public void SetMainPhoto(int photoId)
        {
            var photo = _photos.Find(x => x.Id == photoId);
            if(photo != null)
            {
                foreach (var item in _photos.Where(p => p.IsMain))
                {
                    item.IsMain = false;
                }

                photo.IsMain = true;
            }
        }
    }
}
