using Api.Dtos;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace Api.Helpers
{
    public class PhotoUrlResolver : IValueResolver<Photo, PhotoToReturnDto, string>
    {
        private readonly IConfiguration _config;

        public PhotoUrlResolver(IConfiguration config)
        {
            _config = config;
        }
        public string Resolve(Photo source, PhotoToReturnDto destination, string destMember, ResolutionContext context)
        {
            if(!string.IsNullOrWhiteSpace(source.PictureUrl))
            {
                return _config["ApiUrl"] + source.PictureUrl;
            }

            return null;
        }
    }
}
