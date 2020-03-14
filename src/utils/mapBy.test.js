const uuid = require("uuid");
const mapBy = require("./mapBy");

describe("mapBy", () => {

	["userId", "otherKey", "id"].forEach((key) => {
		it(`should convert objects array to map by ${key}`, async () => {
			// given
			const objects = createObjectsArray(key, 10);

			// when
			const map = mapBy(objects, key);

			// then
			expect(Object.keys(map).length).toBe(10);
			expect(map[objects[0][key]]).toBe(objects[0]);
			expect(map[objects[6][key]]).toBe(objects[6]);
		});

		it("should convert objects and extend initialMap", async () => {
			// given
			const objects = createObjectsArray(key, 10);
			const initialObject = createObject(key, 0);
			const initialMap = {
				[initialObject[key]]: initialObject
			};

			// when
			const map = mapBy(objects, key, initialMap);

			// then
			expect(Object.keys(map).length).toBe(11);
			expect(map[objects[0][key]]).toBe(objects[0]);
			expect(map[initialObject[key]]).toBe(initialObject);
		});

	});
});

function createObject(key, index) {
	return { [key]: uuid(), name: `object-${index}` };
}

function createObjectsArray(key, numberOfObjects) {
	const array = [];
	for (let i = 0; i < numberOfObjects; i++) {
		array.push(createObject(key, i));
	}
	return array;
}
