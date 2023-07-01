import {getAppTheme, setAppTheme} from '../../Storage/GeneralStorage';

const types = {
  SET_THEME: 'SET_THEME',
};

const appStart = () => async dispatch => {
  //Manage APp Theme
  const theme = await getAppTheme();
  theme && (await setTheme(theme));
};

const setTheme = theme => async dispatch => {
  await setAppTheme(theme);
  dispatch({type: types.SET_THEME, payload: theme});
};

export default {types, appStart, setTheme};
