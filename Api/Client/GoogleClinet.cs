﻿using System;

namespace Api.Client
{
    public class GoogleClinet : AbstractClientProvider
    {
         public GoogleClinet()
        {
        }

         public GoogleClinet(string oClientid, string oClientsecret, string oCallbackUrl, string oScope,
                                 string oAcceptedUrl, string oFailedUrl, string oProxy)
            : base(oClientid, oClientsecret, oCallbackUrl, oScope, oAcceptedUrl, oFailedUrl, oProxy)
        {
            ServiceType = typeof (Api.Service.GoogleService);
        }

        public class UserProfile
        {
            public string Id { get; set; }
            public string Email { get; set; }
            public string Verified_email { get; set; }
            public string Name { get; set; }
            public string Given_name { get; set; }
            public string Family_name { get; set; }
            public string Link { get; set; }
            public string Picture { get; set; }
            public string Gender { get; set; }
        }
    }
}
