const byText = (text) => `//android.widget.TextView[@text="${text}"]`;

async function waitForText(text) {
  const element = await $(byText(text));
  await element.waitForDisplayed();
  return element;
}

describe('Disaster Safety App - profile smoke flow', () => {
  it('logs in, opens Profile, saves edited details, and logs out', async () => {
    const timestamp = Date.now();
    const email = `appium-${timestamp}@example.com`;
    const password = 'Password123!';

    await (await $('~login-email-input')).waitForDisplayed();
    await (await $('~register-link')).click();
    await waitForText('Create account');

    await (await $('~register-first-name')).setValue('Appium');
    await (await $('~register-last-name')).setValue('Tester');
    await (await $('~register-phone')).setValue('9876543210');
    await (await $('~register-email')).setValue(email);
    await (await $('~register-password')).setValue(password);
    await (await $('~register-confirm-password')).setValue(password);
    await (await $('~register-submit-button')).click();

    await waitForText('Welcome back');

    const emailInput = await $('~login-email-input');
    const passwordInput = await $('~login-password-input');

    await emailInput.waitForDisplayed();
    await emailInput.setValue(email);
    await passwordInput.setValue(password);
    await (await $('~login-submit-button')).click();

    await waitForText('Dashboard');

    // Open the profile view directly from the visible header avatar action.
    await (await $('~profile-avatar-button')).waitForDisplayed();
    await (await $('~profile-avatar-button')).click();
    await (await $('~profile-screen-container')).waitForDisplayed();
    await (await $('~profile-personal-details-title')).waitForDisplayed();

    // Use the visible Edit action, then update the first name.
    await (await $('~profile-edit-button')).click();
    const firstNameInput = await $('//android.widget.EditText[1]');
    await firstNameInput.waitForDisplayed();
    await firstNameInput.clearValue();
    await firstNameInput.setValue(`Appium${timestamp}`);

    await (await waitForText('Save changes')).click();
    await waitForText('Profile saved successfully');

    await (await waitForText('Logout')).click();
    await waitForText('Welcome back');
  });
});
