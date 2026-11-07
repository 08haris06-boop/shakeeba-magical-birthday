# Shakeeba’s Magical Birthday Adventure

A responsive 11-chapter birthday website. It includes all 24 supplied gallery photos, a photo slideshow in place of an unprovided video, the bundled birthday song, the birthday letter and signature, the BESTIE mystery, and the finale.

## Run it on your computer

This project uses a small Node.js server, so do not open `index.html` by double-clicking it.

1. Install Node.js 20 or newer from https://nodejs.org/ (choose the LTS version).
2. Extract this ZIP file.
3. Open the extracted `shakeeba-magical-birthday` folder. It is the folder containing `package.json`.
4. Open a terminal in that folder.
   - **Windows:** open the folder in File Explorer, click the address bar, type `powershell`, and press Enter.
   - **Mac:** open Terminal and change directory into the extracted folder.
5. Run:

   ```bash
   npm install
   npm start
   ```

6. On that same computer, open http://localhost:3000 in a browser.
7. To stop the server, return to the terminal and press `Ctrl+C`.

Keep the terminal window open while you use the local website.

## Open it on a phone on the same Wi-Fi

1. Start the website on your computer using the steps above.
2. Find your computer's local IPv4 address (on Windows, run `ipconfig` and look for the IPv4 Address; on Mac, check Network settings).
3. On the phone connected to the same Wi-Fi, open `http://YOUR-COMPUTER-IP:3000` (replace the example with the actual local IPv4 address).

This local-network address only works while the computer is running the server and both devices are on the same network. It is not a public link.

## Publish a public link (desktop + mobile, from anywhere)

The app includes a Node/Express backend for optional email notifications, so deploy it as a **Web Service**, not a static-only site. A hosting account and a GitHub account are needed. If you are under 18, ask a parent or guardian to help with account setup and deployment.

One hosting route is Render:

1. Create a GitHub repository and upload the *contents* of this project folder so `package.json` and `server.js` are at the repository root. Do not upload your `.env` file or any secret keys.
2. In Render, choose **New → Web Service**, connect that repository, and select the Node runtime.
3. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
4. Deploy. When the service reports **Live**, Render shows an `onrender.com` URL. That is the public link to open on desktop or mobile.
5. Test the deployed link on both a computer and a phone. Free web services may sleep after inactivity and take a little time to wake when opened again.

Official instructions: https://render.com/docs/deploy-node-express-app and https://render.com/docs/web-services

## Optional email notifications

Email is **not configured by default**. To enable it, use an email provider such as Resend, verify a sender/domain, then set these environment variables in the hosting dashboard (or in a private local `.env` file):

- `RESEND_API_KEY` — your private provider API key
- `EMAIL_FROM` — a sender address verified with the provider
- `NOTIFY_TO` — the intended notification recipient (the project template currently uses `08haris06@gmail.com`)

Never paste API keys into chat, public code, or GitHub. The `.env.example` file is only a template; it does not contain a working key. Until these values are correctly configured and tested, email notifications and photo emails will not send. A provider accepting an email request does not guarantee inbox delivery or that a person read it.

## What is included / what is not

- All 24 gallery photos are bundled in `public/assets/memories/`.
- The birthday song is bundled in `public/assets/birthday-song.mp3` and can be controlled with the music button/player.
- The cinema chapter is a slideshow of the 24 photos because no separate birthday video was supplied.
- The royal portrait chapter intentionally asks the visitor to choose a photo before continuing. Photo email is optional and requires explicit consent plus working email configuration.
- The thank-you note is optional; the visitor can finish without typing.
- Local progress is stored in that browser and may not transfer to another device.
- The date gate is a playful interaction, not security.
