import { LoginFirebaseAngular2Page } from './app.po';

describe('To-Do Firebase client', () => {
  let page: LoginFirebaseAngular2Page;

  beforeEach(() => {
    page = new LoginFirebaseAngular2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
