// See https://aka.ms/new-console-template for more information
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;

Console.WriteLine("FirebaseAdminApp");

// Initialize the default app
var defaultApp = FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromFile($@"\service_account_private_key_file.json"),
});
Console.WriteLine(defaultApp.Name); // "[DEFAULT]"

// Retrieve services by passing the defaultApp variable...
var _ = FirebaseAuth.GetAuth(defaultApp);

// ... or use the equivalent shorthand notation
//defaultAuth = FirebaseAuth.DefaultInstance;

// These registration tokens come from the client FCM SDKs.
var registrationTokens = new List<string>()
{
    "<REGISTRATION_TOKEN>",
    "<REGISTRATION_TOKEN>",
};
var message = new MulticastMessage()
{
    Tokens = registrationTokens,
    Data = new Dictionary<string, string>()
    {
        { "title", "title" },
        { "body", "body" },
        { "url", "https://www.w3.org/Provider/Style/dummy.html"},
    },
};

var response = await FirebaseMessaging.DefaultInstance.SendMulticastAsync(message);

Console.WriteLine($"Send Multicast Response: {response}");

if (response.FailureCount > 0)
{
    var failedTokens = new List<string>();
    for (var i = 0; i < response.Responses.Count; i++)
    {
        if (!response.Responses[i].IsSuccess)
        {
            // The order of responses corresponds to the order of the registration tokens.
            failedTokens.Add(registrationTokens[i]);
        }
    }

    Console.WriteLine($"List of tokens that caused failures: {failedTokens}");
}
