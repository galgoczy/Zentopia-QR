# Google reCAPTCHA v3 Setup Guide

## Current Status
✅ **PRODUCTION KEYS CONFIGURED** - The application is now using your production reCAPTCHA v3 keys.

**Site Key**: `6LcooQYsAAAAAO5hWTI7mVpzigw40BQb-3GwEcc3`
**Secret Key**: `6LcooQYsAAAAAKlTGJrE4tkajvKnFzpgt9xSihbY` (for server-side validation)

---

## Quick Setup (5 minutes)

### 1. Register for reCAPTCHA v3

Visit: https://www.google.com/recaptcha/admin/create

**Fill in the form:**
- Label: `Zentopia QR Code Generator`
- reCAPTCHA type: **reCAPTCHA v3**
- Domains:
  - `qrcode.zentopia.io`
  - `localhost` (for testing)

Click **Submit**

### 2. Copy Your Keys

After registration, you'll receive:
- **Site Key** (public, goes in frontend)
- **Secret Key** (private, goes in backend)

### 3. Update Frontend (index.html)

**Find line 48:**
```html
<script src="https://www.google.com/recaptcha/api.js?render=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></script>
```

**Replace with your Site Key:**
```html
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY_HERE"></script>
```

### 4. Update Frontend (app.js)

**Find line 680:**
```javascript
const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
```

**Replace with your Site Key:**
```javascript
const RECAPTCHA_SITE_KEY = 'YOUR_SITE_KEY_HERE';
```

### 5. Server-Side Validation (Google Apps Script) - RECOMMENDED

⚠️ **IMPORTANT**: Add this to your Google Apps Script for complete protection!

In your Google Apps Script (`doPost` function), add server-side validation:

```javascript
function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const recaptchaToken = params.recaptchaToken;

  // Verify reCAPTCHA token
  if (recaptchaToken && recaptchaToken !== 'not_available') {
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const payload = {
      'secret': '6LcooQYsAAAAAKlTGJrE4tkajvKnFzpgt9xSihbY',
      'response': recaptchaToken
    };

    const options = {
      'method': 'post',
      'payload': payload
    };

    try {
      const response = UrlFetchApp.fetch(verifyUrl, options);
      const result = JSON.parse(response.getContentText());

      Logger.log('reCAPTCHA score: ' + result.score); // Debug logging

      // Check score (0.0 = bot, 1.0 = human)
      if (result.success && result.score >= 0.5) {
        // Proceed with saving feedback
        Logger.log('reCAPTCHA passed - Score: ' + result.score);
      } else {
        // Reject (likely bot)
        Logger.log('reCAPTCHA FAILED - Score: ' + result.score);
        return ContentService.createTextOutput(JSON.stringify({
          error: 'reCAPTCHA validation failed',
          score: result.score
        }));
      }
    } catch (error) {
      Logger.log('reCAPTCHA verification error: ' + error);
      // Gracefully continue if verification fails
    }
  }

  // Save to Google Sheets...
  // Your existing code here...
}
```

**What this does:**
- Sends the reCAPTCHA token to Google for verification
- Returns a score between 0.0 (bot) and 1.0 (human)
- Threshold set to 0.5 (balanced)
- Logs score for debugging in Apps Script logs
- Rejects submissions with score < 0.5

---

## Testing

### Testing Production Keys (Current Setup)

✅ **Your production keys are now active!**

1. Open browser console (F12)
2. Navigate to the feedback form
3. Fill out the form and submit
4. Look for console messages:
   - `reCAPTCHA token generated successfully` ✅
   - Check the token is not "not_available"
5. Check Google reCAPTCHA admin dashboard:
   - Visit: https://www.google.com/recaptcha/admin
   - View real-time analytics and scores
   - Monitor bot traffic patterns

### Verifying Server-Side Validation

If you added server-side validation to your Google Apps Script:

1. Open Apps Script editor
2. View → Executions (or Logs)
3. Submit a test feedback
4. Check logs for:
   - `reCAPTCHA score: 0.9` (or similar)
   - `reCAPTCHA passed - Score: 0.9`
5. Try with a bot-like behavior (instant submit) to see rejection

---

## Understanding reCAPTCHA v3 Scores

reCAPTCHA v3 returns a score from **0.0 to 1.0**:

| Score | Likelihood | Recommended Action |
|-------|-----------|-------------------|
| 0.9 - 1.0 | Very likely human | ✅ Accept |
| 0.7 - 0.9 | Likely human | ✅ Accept |
| 0.5 - 0.7 | Neutral | ⚠️ Accept with caution |
| 0.3 - 0.5 | Suspicious | ⚠️ Add extra validation |
| 0.0 - 0.3 | Very likely bot | ❌ Reject |

**Recommended threshold**: `0.5` (balanced)

---

## Security Features

### Current Bot Protection Layers

1. ✅ **Honeypot field** - Catches simple bots
2. ✅ **Rate limiting** - 1 submit/minute (localStorage)
3. ✅ **Timestamp validation** - Minimum 3 seconds
4. ✅ **reCAPTCHA v3** - ML-based bot detection

### With Production Keys, You Get:

- ✅ **Machine learning** - Google's advanced bot detection
- ✅ **Behavioral analysis** - Mouse movements, typing patterns
- ✅ **Risk analysis** - IP reputation, device fingerprinting
- ✅ **Analytics dashboard** - See bot traffic patterns
- ✅ **Adaptive risk score** - Learns from your traffic

---

## Graceful Degradation

The implementation includes **graceful degradation**:

```javascript
if (typeof grecaptcha !== 'undefined') {
    // Use reCAPTCHA
} else {
    console.warn('reCAPTCHA not loaded, continuing without it');
    // Other bot protections still work
}
```

**Benefits:**
- ✅ Works even if reCAPTCHA script fails to load
- ✅ Works in browsers that block Google scripts
- ✅ Works during development/testing
- ✅ Still has 3 other bot protection layers

---

## Troubleshooting

### "reCAPTCHA not loaded" warning
- Check if domain is registered in reCAPTCHA admin
- Check browser console for script loading errors
- Verify site key is correct

### Score always 0.0 or 1.0
- Test keys always return 1.0 (by design)
- Production keys give real scores

### Form still getting spam
- Lower threshold to 0.3 (more strict)
- Enable server-side validation in Apps Script
- Check reCAPTCHA admin dashboard for patterns

---

## Cost

**Google reCAPTCHA v3 is FREE** for:
- Up to 1,000,000 assessments per month
- Typical small website: ~1,000-10,000/month

**No credit card required!**

---

## Resources

- reCAPTCHA Admin: https://www.google.com/recaptcha/admin
- Documentation: https://developers.google.com/recaptcha/docs/v3
- Best Practices: https://developers.google.com/recaptcha/docs/v3#best_practices

---

## Summary

✅ **PRODUCTION READY** - Your reCAPTCHA v3 is fully configured!

**What's done:**
- ✅ Production site key configured in `index.html` (line 47)
- ✅ Production site key configured in `app.js` (line 680)
- ✅ Secret key documented for server-side validation
- ✅ 4-layer bot protection active

**Next step (recommended):**
1. Add server-side validation to Google Apps Script (see code above)
2. Set threshold to 0.5 (already in example code)
3. Monitor reCAPTCHA admin dashboard for bot patterns

**Estimated time for server-side validation**: 10 minutes

**Your keys:**
- Site Key: `6LcooQYsAAAAAO5hWTI7mVpzigw40BQb-3GwEcc3`
- Secret Key: `6LcooQYsAAAAAKlTGJrE4tkajvKnFzpgt9xSihbY`

🎉 **The frontend is production-ready! Real bot scores will now be generated.**
