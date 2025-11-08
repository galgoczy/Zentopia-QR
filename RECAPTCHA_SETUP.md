# Google reCAPTCHA v3 Setup Guide

## Current Status
The application is configured with **Google's TEST keys** which always pass validation.

⚠️ **IMPORTANT**: You must replace these with your own production keys before deploying.

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

### 5. Update Backend (Google Apps Script)

In your Google Apps Script (`doPost` function), add server-side validation:

```javascript
function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const recaptchaToken = params.recaptchaToken;

  // Verify reCAPTCHA token
  if (recaptchaToken && recaptchaToken !== 'not_available') {
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const payload = {
      'secret': 'YOUR_SECRET_KEY_HERE',
      'response': recaptchaToken
    };

    const options = {
      'method': 'post',
      'payload': payload
    };

    try {
      const response = UrlFetchApp.fetch(verifyUrl, options);
      const result = JSON.parse(response.getContentText());

      // Check score (0.0 = bot, 1.0 = human)
      if (result.success && result.score >= 0.5) {
        // Proceed with saving feedback
      } else {
        // Reject (likely bot)
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
}
```

---

## Testing

### Test with Google's Test Keys (Current Setup)
- Site Key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- Secret Key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

These keys always return `score: 1.0` (perfect human score).

### Test Your Production Keys
1. Open browser console (F12)
2. Submit feedback
3. Look for: `reCAPTCHA token generated successfully`
4. Check Google reCAPTCHA admin dashboard for analytics

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

Current setup uses **test keys** that always pass. This is safe for development.

**Before production deployment:**
1. Register at https://www.google.com/recaptcha/admin/create
2. Replace site key in `index.html` (line 48)
3. Replace site key in `app.js` (line 680)
4. Add server-side validation in Google Apps Script
5. Set threshold to 0.5 or higher

**Estimated time**: 5 minutes for frontend, 10 minutes for backend validation
