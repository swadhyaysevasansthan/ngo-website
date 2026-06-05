import { visitorAPI } from './api';

export const trackVisitor = async () => {
  try {

    let token =
      localStorage.getItem('visitorToken');

    if (!token) {

      token =
        crypto.randomUUID();

      localStorage.setItem(
        'visitorToken',
        token
      );

      await visitorAPI.track(token);
    }

  } catch (error) {

    console.error(
      'Visitor tracking failed:',
      error
    );

  }
};