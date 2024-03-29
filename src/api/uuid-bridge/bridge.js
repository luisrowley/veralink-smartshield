const express = require('express');
const qrcode = require('qrcode');
const path = require('path');
const ejs = require('ejs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const PROXY_SERVER = process.env.PROXY_URL;
const WS_SERVER = process.env.WEB_SOCKET_SERVER;

/** :: TODO ::
 * create dedicated client for real-time
 * update and re-render of QR code payload
*/
router.get('/', async (req, res) => {
  const uuid = uuidv4();
  const urlToVerify = req.query.url;

  try {
    // Generate the QR code
    const qrCode = await qrcode.toDataURL(uuid);

    // Get the absolute path to the template file
    const templatePath = path.join(__dirname, 'qrcode.ejs');

    // Render the EJS template with the updated UUID and QR code
    const htmlTemplate = await ejs.renderFile(templatePath, {
      qrCode, uuid, urlToVerify, PROXY_SERVER, WS_SERVER,
    });

    // Send the HTML template as a response
    res.send(htmlTemplate);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
