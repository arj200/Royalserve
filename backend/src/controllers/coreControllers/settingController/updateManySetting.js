const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const updateManySetting = async (req, res) => {
  try {
    // req/body = [{settingKey:"",settingValue}]
    let settingsHasError = false;
    const updateDataArray = [];
    const { settings } = req.body;

    if (!settings || !Array.isArray(settings)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Settings must be an array',
      });
    }

    for (const setting of settings) {
      if (!setting.hasOwnProperty('settingKey') || !setting.hasOwnProperty('settingValue')) {
        settingsHasError = true;
        break;
      }

      const { settingKey, settingValue } = setting;

      // Validate settingKey
      if (!settingKey || typeof settingKey !== 'string') {
        settingsHasError = true;
        break;
      }


      updateDataArray.push({
        updateOne: {
          filter: { 
            settingKey: settingKey.toLowerCase(),
            removed: false 
          },
          update: { 
            settingValue: settingValue,
            updated: new Date()
          },
          upsert: false // Don't create new documents, only update existing ones
        },
      });
    }

    if (updateDataArray.length === 0) {
      return res.status(202).json({
        success: false,
        result: null,
        message: 'No settings provided ',
      });
    }
    if (settingsHasError) {
      return res.status(202).json({
        success: false,
        result: null,
        message: 'Settings provided has Error',
      });
    }
    const result = await Model.bulkWrite(updateDataArray);

    if (!result || result.nMatched < 1) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No settings found by to update',
      });
    } else {
      return res.status(200).json({
        success: true,
        result: [],
        message: 'we update all settings',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = updateManySetting;
