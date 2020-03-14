module.exports = function mapBy(objects, key, initialMap = {}) {
	return objects.reduce((agg, object) => ({ ...agg, [object[key]]: object }), { ...initialMap });
};
