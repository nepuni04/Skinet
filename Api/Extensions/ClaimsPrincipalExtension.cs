using System.Linq;
using System.Security.Claims;

namespace Api.Extensions
{
    public static class ClaimsPrincipalExtension
    {
        public static string GetEmailFromClaimsPrincipal(this ClaimsPrincipal user)
        {
            return user?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
        }

        public static string GetUserNameFromClaimsPrincipal(this ClaimsPrincipal user)
        {
            return user?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.GivenName)?.Value;
        }
    }
}
