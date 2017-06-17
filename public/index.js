var endpoint;
var key;
var authSecret;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Set the public key
const applicationServerPublicKey = "BIFcQh6KI5-j2sggnMUOnQSBCiXecqSTcwvOAvot3GpGNncfXKNtGiQ0fho3Bx3e6_1ozj8icVwVd7lnFkzPRoo";
const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

// Register a Service Worker.
navigator.serviceWorker.register('sw.js')
.then(function(registration) {
  // Use the PushManager to get the user's subscription to the push service.
  return registration.pushManager.getSubscription()
  .then(function(subscription) {
    // If a subscription was found, return it.
    if (subscription) {
      return subscription;
    }

    return new Promise(function (resolve, reject) {
      document.getElementById('subscribe').onclick = resolve;
    }).then(function () {
      // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
      // send notifications that don't have a visible effect for the user).
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });
    });
  });
}).then(function(subscription) {
  // TODO: only upload the subscription when it exists and is new and add a pushsubscriptionchange handler
  // Retrieve the user's public key.
  var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
  key = rawKey ?
        btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
        '';
  var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
  authSecret = rawAuthSecret ?
               btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
               '';

  endpoint = subscription.endpoint;

  // Send the subscription details to the server using the Fetch API.
  fetch('./webpush/register', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ data: subscription })
  });
});
