module.exports = function (source) {
    const { i18nData } = this.query;

    let result = source;
    Object.keys(i18nData).forEach(key => {
        const value = i18nData[key];
        const regex = new RegExp(`__${key}__`, 'g');
        result = result.replace(regex, value);
    });

    return result;
};
