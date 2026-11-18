# Our Little Corner: future setup

This is a single-browser prototype. Its localStorage is readable by anyone with access to that browser, is not encrypted, and does not sync. Profile selection is not authentication. Do not store sensitive information here. Clearing browser data can erase entries. No notification is sent today.

## Connect Firebase later

1. Create a Firebase project and register a web app in the [Firebase console](https://console.firebase.google.com/). Add its web configuration when you are ready; no keys or cloud services are required for this prototype.
2. Enable Firebase Authentication and choose a sign-in method for Dom and Emma. Replace the prototype profile selector with authenticated identities; never trust a name selected in the browser as proof of identity.
3. Create Cloud Firestore and design a private couple space containing moods, notes, and check-ins. Replace the `storage` adapter in `our-little-corner.js` with asynchronous Firestore reads and writes, and update the interface to handle loading, errors, and live updates.
4. Write and test Firestore security rules that allow only the two authorized user IDs to read or write their shared space. Deny all other access, validate document fields, and test with the Firebase Emulator Suite before deployment. Do not put private notes in public HTML or repository files.
5. Plan migration explicitly if you want to keep local entries: ask each person before uploading their browser data, and handle duplicates and failures.

## Future iPhone Home Screen and web push

The manifest and no-cache service worker are foundations, not an installation or push implementation. Add appropriately sized app icons and test installation on the target devices. Serve the site over HTTPS, then use Safari’s Share → Add to Home Screen. GitHub Pages project paths are relative in the manifest and worker registration.

iOS/iPadOS 16.4 or later supports Web Push for web apps added to the Home Screen. Request notification permission only after a clear user action from that installed app. A future implementation needs a push subscription, a secure server or trusted cloud function to send messages, and a service worker push handler; never place server credentials in client code. Authenticate and authorize subscription registration and sending, validate recipients, protect tokens, and avoid putting private note text in notification payloads. Test permission denial, expired subscriptions, and delivery on real devices. Consult [WebKit’s Web Push guidance](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) and [Firebase documentation](https://firebase.google.com/docs) for current details.

The worker currently does not cache or intercept requests. Before adding push handling, check for an existing service worker at the site scope and integrate with it instead of replacing it; a scope can have only one active registration.
