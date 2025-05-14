import {
  navMenu,
  firstDropDown,
  secondDropDown,
  thirdDropDown,
} from '../actions/actionsTypes';

export const NavMenu = (menu_name) => ({
  type: navMenu,
  payload: menu_name,
});

export const FirstDropDown = (firstDropDownName) => ({
  type: firstDropDown,
  payload: firstDropDownName,
});

export const SecondDropDown = (secondDropDownName) => ({
  type: secondDropDown,
  payload: secondDropDownName,
});

export const ThirdDropDown = (thirdDropDownName) => ({
  type: thirdDropDown,
  payload: thirdDropDownName,
});
