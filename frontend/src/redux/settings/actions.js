import * as actionTypes from './types';
import { request } from '@/request';

const dispatchSettingsData = (datas) => {
  const settingsCategory = {};

  // Sort by created date to get the most recent settings first
  const sortedDatas = datas.sort((a, b) => new Date(b.created) - new Date(a.created));

  sortedDatas.map((data) => {
    // Only set the value if it hasn't been set yet (to avoid overwriting with older values)
    if (!settingsCategory[data.settingCategory]) {
      settingsCategory[data.settingCategory] = {};
    }
    
    if (!settingsCategory[data.settingCategory][data.settingKey]) {
      settingsCategory[data.settingCategory][data.settingKey] = data.settingValue;
      
  }
  });

  return settingsCategory;
};

export const settingsAction = {
  resetState: () => (dispatch) => {
    dispatch({
      type: actionTypes.RESET_STATE,
    });
  },
  updateCurrency:
    ({ data }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.UPDATE_CURRENCY,
        payload: data,
      });
    },
  update:
    ({ entity, settingKey, jsonData }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
      });
      let data = await request.patch({
        entity: entity + '/updateBySettingKey/' + settingKey,
        jsonData,
      });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_LOADING,
        });

        let data = await request.listAll({ entity });

        if (data.success === true) {
          const payload = dispatchSettingsData(data.result);
          window.localStorage.setItem(
            'settings',
            JSON.stringify(dispatchSettingsData(data.result))
          );

          dispatch({
            type: actionTypes.REQUEST_SUCCESS,
            payload,
          });
        } else {
          dispatch({
            type: actionTypes.REQUEST_FAILED,
          });
        }
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
        });
      }
    },
  updateMany:
    ({ entity, jsonData }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
      });
      let data = await request.patch({
        entity: entity + '/updateManySetting',
        jsonData,
      });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_LOADING,
        });

        let data = await request.listAll({ entity });

        if (data.success === true) {
          const payload = dispatchSettingsData(data.result);
          window.localStorage.setItem(
            'settings',
            JSON.stringify(dispatchSettingsData(data.result))
          );

          dispatch({
            type: actionTypes.REQUEST_SUCCESS,
            payload,
          });
        } else {
          dispatch({
            type: actionTypes.REQUEST_FAILED,
          });
        }
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
        });
      }
    },
  list:
    ({ entity }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
      });

      let data = await request.listAll({ entity });

      if (data.success === true) {
        const payload = dispatchSettingsData(data.result);
        window.localStorage.setItem('settings', JSON.stringify(dispatchSettingsData(data.result)));

        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          payload,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
        });
      }
    },
  upload:
    ({ entity, settingKey, jsonData }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
      });

      let data = await request.upload({
        entity: entity,
        id: settingKey,
        jsonData,
      });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_LOADING,
        });

        let data = await request.listAll({ entity });

        if (data.success === true) {
          const payload = dispatchSettingsData(data.result);
          window.localStorage.setItem(
            'settings',
            JSON.stringify(dispatchSettingsData(data.result))
          );
          dispatch({
            type: actionTypes.REQUEST_SUCCESS,
            payload,
          });
        } else {
          dispatch({
            type: actionTypes.REQUEST_FAILED,
          });
        }
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
        });
      }
    },
};
