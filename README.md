Firefox OS Push Notification Demo
===================

A demo app for registering and sending push notifications.

This is the "Hello World" of Push apps for Firefox OS.

<center>
<img src="http://i.imgur.com/3hdIkMN.png" style="border: 1px solid black; width: 240px" width="240" border="1">
</center>

Test on your phone and with <http://ffpush.dev.coolaj86.com/>

Install
=======

```bash
git clone https://github.com/coolaj86/firefox-os-push-notification-demo.git
pushd firefox-os-push-notification-demo
```

0. Install the [Android SDK](http://developer.android.com/sdk/installing/index.html?pkg=tools)
0. Install Firefox (includes App Manager by default now)
0. Install [ADB Helper](https://ftp.mozilla.org/pub/mozilla.org/labs/fxos-simulator/)
0. Connect your Firefox OS phone (I doubt the simulator would work for this)
0. Open [about:app-manager](about:app-manager)
0. Add the app by going to "Apps", then "Add Packaged App", then select the app folder
0. Click "Update"
0. Now run "Push Demo" from your home screen

Notes
=====

  * Tested working in Firefox OS 1.3.0 on the ZTE Open C with a T-Mobile SIM.
