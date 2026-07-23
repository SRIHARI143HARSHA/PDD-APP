from openpyxl import Workbook

wb = Workbook()
ws = wb.active
ws.title = 'Test Report'

rows = [
    ['Category', 'Status', 'Evidence', 'Notes'],
    ['Appium-Android Tests', 'FAILED', 'Executed with npx wdio run wdio.appium.conf.js: 1 failing (16.5s), element "~login-email-input" still not displayed after 15000ms', 'Appium run currently fails because the app never reaches the expected login UI on the connected Android device'],
    ['Unit Tests - API', 'PASSED', 'Verified with npm test -- --runInBand: 4/4 suites passed, 33/33 tests passed', 'Jest suite passing'],
    ['Validation Tests', 'PASSED', 'Verified with npm run lint: completed with 0 problems', 'Lint clean'],
    ['Load Testing - Performance', 'PASSED', 'Repeated local benchmark: average 2.9572 s, min 2.736 s, max 3.258 s', 'Repeated-run local benchmark'],
]

for row in rows:
    ws.append(row)

ws.freeze_panes = 'A2'
ws.auto_filter.ref = ws.dimensions

wb.save('test_report_final.xlsx')
print('created: test_report_final.xlsx')
