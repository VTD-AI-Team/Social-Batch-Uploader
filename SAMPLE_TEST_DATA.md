# Sample Test Data for Demo

## Quick Test URLs (Copy-paste ready)

### Facebook Posts (Public):
1. https://www.facebook.com/share/p/1BzQxqYvXN/
2. https://www.facebook.com/share/p/1BzQxqYvXN/
3. https://www.facebook.com/zuck/posts/10114845254814261

### TikTok Videos (Public):
1. https://www.tiktok.com/@tiktok/video/7106594312292453675
2. https://www.tiktok.com/@tiktok/video/7106594312292453675

## Sample Excel Data

Copy this into your Excel template:

| Mã NPP | Mã NV | POST 1 | POST 2 | POST 3 | POST 4 | POST 5 | POST 6 | POST 7 | POST 8 |
|--------|-------|--------|--------|--------|--------|--------|--------|--------|--------|
| NPP001 | NV001 | https://www.facebook.com/share/p/1BzQxqYvXN/ | https://www.tiktok.com/@tiktok/video/7106594312292453675 | | | | | | |
| NPP002 | NV002 | https://www.facebook.com/zuck/posts/10114845254814261 | | | | | | | |

## Test Scenarios

### Scenario 1: Basic Test (2 shops, 3 posts total)
- Expected time: ~2-3 minutes
- Expected success rate: 95%+
- Purpose: Verify basic functionality

### Scenario 2: Hashtag Test
- Use posts WITHOUT the required hashtags
- Expected result: "❌ Thiếu hashtag" status
- Purpose: Verify validation works

### Scenario 3: Duplicate Test
- Use same URL twice in one shop
- Expected result: "🚫 Link trùng" status
- Purpose: Verify duplicate detection

### Scenario 4: Error Test
- Use invalid URL: https://facebook.com/invalid-post-12345
- Expected result: "⚠️ Lỗi" status
- Purpose: Verify error handling

## Notes

⚠️ **Important**: 
- Use PUBLIC posts only (private posts will show "🔒 Riêng tư")
- Ensure stable internet connection
- First run may take longer due to Puppeteer setup

✅ **Expected Results**:
- Screenshots saved to `public/screenshots/`
- Excel file with 18 columns downloaded
- Success rate 95%+ for valid public URLs
